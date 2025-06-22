import logging
import os
from logging.handlers import TimedRotatingFileHandler

global_logger = None

def setup_main_logger(logfile, debug = False):
    global global_logger
    global_logger = logging.getLogger("asklvkaszus")

    log_level = logging.DEBUG if debug else logging.INFO
    global_logger.setLevel(log_level)

    log_format = "[Ask @lvkaszus! - Backend] - %(asctime)s - %(levelname)s - %(message)s"
    date_format = "%Y-%m-%d | %H:%M:%S"
    formatter = logging.Formatter(fmt=log_format, datefmt=date_format)

    if global_logger.hasHandlers():
        global_logger.handlers.clear()

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    global_logger.addHandler(console_handler)

    if logfile:
        if not os.path.isabs(logfile):
            logfile = os.path.join(os.getcwd(), logfile)

        log_dir = os.path.dirname(logfile)
        os.makedirs(log_dir, exist_ok=True)

        file_handler = TimedRotatingFileHandler(logfile, when='W0', backupCount=1)
        file_handler.setFormatter(formatter)
        file_handler.setLevel(log_level)
        global_logger.addHandler(file_handler)

def main_logger():
    global global_logger

    if global_logger is None:
        raise RuntimeError("Global Application Logger is not initialized!")

    return global_logger