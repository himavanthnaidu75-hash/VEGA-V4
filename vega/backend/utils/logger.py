from loguru import logger
import sys, os
def setup():
    if not os.path.exists("logs"): os.makedirs("logs")
    logger.remove()
    logger.add(sys.stdout, format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | {message}")
setup()
