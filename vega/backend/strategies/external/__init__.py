from .strategy_3_1_price_momentum import PriceMomentumStrategy
from .strategy_3_2_earnings_momentum import EarningsMomentumStrategy
from .strategy_3_3_value import ValueStrategy
from .strategy_3_12_two_ma import TwoMAStrategy
def get_external_strategies(): return [PriceMomentumStrategy(), EarningsMomentumStrategy(), ValueStrategy(), TwoMAStrategy()]
