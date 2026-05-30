from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import asyncio
from vega.backend.utils.logger import logger
from vega.backend.utils.notifier import notifier
from vega.backend.utils.indicators import hurst_exponent
from vega.backend.config import settings

class VegaScheduler:
    def __init__(self, orch):
        self.o = orch
        self.sched = AsyncIOScheduler(timezone='Asia/Kolkata')

    def start(self):
        # 08:45 — startup_check
        self.sched.add_job(self.startup_check, CronTrigger(hour=8, minute=45))
        # 09:00 — pre_market_prompt
        self.sched.add_job(self.o.pre_market_prompt, CronTrigger(hour=9, minute=0))
        # 09:10 — load_universe
        self.sched.add_job(self.load_universe, CronTrigger(hour=9, minute=10))
        # 09:15 — scanning loop (Market Hours)
        self.sched.add_job(self.o.run_scan_cycle, CronTrigger(hour='9-14', minute='*', second='0'))
        # 09:30 — activate_orb
        self.sched.add_job(self.activate_orb, CronTrigger(hour=9, minute=30))
        # 11:00 — deactivate_orb
        self.sched.add_job(self.deactivate_orb, CronTrigger(hour=11, minute=0))
        # 12:00 — midday_recal (Hurst)
        self.sched.add_job(self.midday_recal, CronTrigger(hour=12, minute=0))
        # 14:45 — stop_scalping
        self.sched.add_job(self.stop_scalping, CronTrigger(hour=14, minute=45))
        # 15:00 — stop_new_entries
        self.sched.add_job(self.stop_entries, CronTrigger(hour=15, minute=0))
        # 15:15 — square_off_all
        self.sched.add_job(self.square_off, CronTrigger(hour=15, minute=15))
        # 15:20 — eod_report
        self.sched.add_job(self.eod_report, CronTrigger(hour=15, minute=20))
        # 15:25 — standby
        self.sched.add_job(self.standby, CronTrigger(hour=15, minute=25))

        self.sched.start()
        logger.info("Scheduler started with all 12 institutional jobs.")

    async def startup_check(self):
        if self.o.broker.connect(): await notifier.send("✅ VEGA 2.0: Startup diagnostic passed.")

    async def load_universe(self): logger.info("Loading market universe...")

    async def activate_orb(self):
        for s in self.o.strategies:
            if "ORB" in s.name: s.enabled = True
        logger.info("ORB strategies activated.")

    async def deactivate_orb(self):
        for s in self.o.strategies:
            if "ORB" in s.name: s.enabled = False
        logger.info("ORB strategies deactivated.")

    async def midday_recal(self):
        from vega.backend.data.fetcher import fetcher
        h_values = []
        for s in settings.WATCHLIST.split(","):
            df = fetcher.get_ohlcv(s, "1d")
            if not df.empty: h_values.append(hurst_exponent(df['Close']))
        if h_values:
            avg_h = sum(h_values)/len(h_values)
            for st in self.o.strategies:
                if avg_h > 0.55: # Trending
                    if st.strategy_type == "reversion": st.enabled = False
                    if st.strategy_type == "trend": st.enabled = True
                elif avg_h < 0.45: # Reverting
                    if st.strategy_type == "trend": st.enabled = False
                    if st.strategy_type == "reversion": st.enabled = True
            logger.info(f"Hurst recalibration: {avg_h:.2f}")

    async def stop_scalping(self):
        for s in self.o.strategies:
            if s.timeframe == "1m": s.enabled = False
        logger.info("1m scalping strategies disabled.")

    async def stop_entries(self):
        self.o.is_running = False # Scan cycle will check this
        logger.info("New entry window closed.")

    async def square_off(self):
        from vega.backend.engine.kill_switch import KillSwitch
        ks = KillSwitch(broker=self.o.broker, ws_manager=self.o.ws_manager)
        await ks.execute(reason="End of Session Purge")

    async def eod_report(self): logger.info("Generating EOD report...")
    async def standby(self): logger.info("System entering standby.")
