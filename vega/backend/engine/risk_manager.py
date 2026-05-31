from backend.config import settings
from backend.utils.indicators import kelly_fraction

class RiskManager:
    def calculate_position_size(self, entry, sl, method="atr", wr=0.5, aw=2, al=1):
        risk = abs(entry - sl)
        cap = settings.TOTAL_CAPITAL
        if method == "kelly":
            f = kelly_fraction(wr, aw, al)
            return int((cap * f) / entry) if entry > 0 else 1
        return int((cap * settings.MAX_RISK_PER_TRADE) / risk) if risk > 0 else 1

    def validate_trade(self, sig, pnl, count):
        if count >= settings.MAX_OPEN_POSITIONS: return False, "Max positions"
        if pnl <= -settings.TOTAL_CAPITAL * settings.MAX_DAILY_LOSS: return False, "Daily loss limit"
        risk = abs(sig['entry'] - sig['sl'])
        reward = abs(sig['tp'] - sig['entry'])
        if risk == 0 or (reward / risk) < settings.MIN_RR_RATIO: return False, "Low RR"
        return True, "Approved"
