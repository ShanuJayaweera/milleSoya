from enum import Enum

class EStatus(Enum):
	INACTIVE = 0
	ACTIVE = 1

class ELicenseType(Enum):
	TRIAL = 0
	ONETIME = 1
    SUBSCRIPTION = 2
    TIMED = 3