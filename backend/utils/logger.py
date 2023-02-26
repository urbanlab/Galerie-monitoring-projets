import logging

from rich.logging import RichHandler

FORMAT = "%(message)s"
logging.basicConfig(
    level="NOTSET", format=FORMAT, datefmt="[%X]", handlers=[RichHandler()]
)  # set level=20 or logging.INFO to turn of debug
logger = logging.getLogger("rich")

# logger.debug("debug...")
# logger.info("info...")
# logger.warning("warning...")
# logger.error("error...")
# logger.fatal("fatal...")
