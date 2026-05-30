from .trend.ema_confluence import EMAConfluenceStrategy
from .trend.macd_momentum import MACDMomentumStrategy
from .trend.supertrend_strategy import SupertrendStrategy
from .trend.adx_trend import ADXTrendStrategy
from .reversion.rsi_reversal import RSIReversalStrategy
from .reversion.bb_squeeze_strategy import BBSqueezeStrategy
from .reversion.vwap_reversion import VWAPReversionStrategy
from .breakout.orb_strategy import ORBStrategy
from .breakout.volume_profile_breakout import VolumeProfileBreakoutStrategy
from .breakout.pivot_breakout import PivotBreakoutStrategy
from .quant.zscore_reversion import ZScoreReversionStrategy
from .quant.linreg_channel import LinearRegressionChannelStrategy
from .quant.kalman_trend import KalmanFilterTrendStrategy
from .quant.hurst_regime_switcher import HurstRegimeSwitcher
from .options.iv_rank_strategy import IVRankStrategy
from .options.delta_neutral_straddle import DeltaNeutralStraddleStrategy
from .options.directional_spread import DirectionalSpreadStrategy
from .options.iron_condor import IronCondorStrategy

def get_builtin_strategies():
    return [
        EMAConfluenceStrategy(), MACDMomentumStrategy(), SupertrendStrategy(), ADXTrendStrategy(),
        RSIReversalStrategy(), BBSqueezeStrategy(), VWAPReversionStrategy(),
        ORBStrategy(), VolumeProfileBreakoutStrategy(), PivotBreakoutStrategy(),
        ZScoreReversionStrategy(), LinearRegressionChannelStrategy(), KalmanFilterTrendStrategy(),
        IVRankStrategy(), DeltaNeutralStraddleStrategy(), DirectionalSpreadStrategy(), IronCondorStrategy()
    ]
