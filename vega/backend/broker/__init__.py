from vega.backend.config import settings

def get_broker():
    b = settings.BROKER.lower()
    if b == "dhan":
        from .dhan import DhanBroker
        return DhanBroker()
    if b == "angel":
        from .angel import AngelBroker
        return AngelBroker()
    if b == "zerodha":
        from .zerodha import ZerodhaBroker
        return ZerodhaBroker()
    from .paper import PaperBroker
    return PaperBroker()
