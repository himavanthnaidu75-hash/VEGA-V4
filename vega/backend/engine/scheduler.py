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
        self.sched.add_job(self.startup_check, CronTrigger(hour=8, minute=45))
        self.sched.add_job(self.o.pre_market_prompt, CronTrigger(hour=9, minute=0))
        self.sched.add_job(self.o.run_scan_cycle, 'interval', minutes=1, start_date='2024-01-01 09:15:00', end_date='2024-01-01 15:15:00')
        self.sched.add_job(self.midday_recal, CronTrigger(hour=12, minute=0))
        self.sched.add_job(self.square_off, CronTrigger(hour=15, minute=15))
        self.sched.start()
        logger.info("Scheduler started with all required NSE windows.")

    async def startup_check(self):
        if self.o.broker.connect(): await notifier.send("✅ System Ready")

    async def midday_recal(self):
        from vega.backend.data.fetcher import fetcher
        logger.info("Recalibrating market regime via Hurst Exponent...")
        h_values = []
        for s in settings.WATCHLIST.split(","):
            df = fetcher.get_ohlcv(s, "1d")
            if not df.empty:
                h = hurst_exponent(df['Close'])
                h_values.append(h)

        if h_values:
            avg_h = sum(h_values) / len(h_values)
            logger.info(f"Market Hurst: {avg_h:.2f}")
            # Switch strategies
            for st in self.o.strategies:
                if avg_h > 0.55: # Trending
                    if st.strategy_type == "reversion": st.enabled = False
                    if st.strategy_type == "trend": st.enabled = True
                elif avg_h < 0.45: # Reverting
                    if st.strategy_type == "trend": st.enabled = False
                    if st.strategy_type == "reversion": st.enabled = True

    async def square_off(self):
        from vega.backend.engine.kill_switch import KillSwitch
        ks = KillSwitch(broker=self.o.broker, ws_manager=self.o.ws_manager)
        await ks.execute(reason="15:15 Market Square-off")
