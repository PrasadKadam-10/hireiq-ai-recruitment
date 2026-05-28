from ulid import ULID
from datetime import datetime

def generate_ulid() -> str:
    """Generate a new ULID as a string"""
    return str(ULID())

def ulid_to_timestamp(ulid_str: str) -> datetime:
    """Extract timestamp from ULID"""
    ulid = ULID.from_str(ulid_str)
    return ulid.timestamp.datetime

def is_valid_ulid(ulid_str: str) -> bool:
    """Check if a string is a valid ULID"""
    try:
        ULID.from_str(ulid_str)
        return True
    except (ValueError, AttributeError):
        return False