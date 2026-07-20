from typing import Optional

from pydantic import BaseModel

class Course(BaseModel):
    txt_subject: str = None
    txt_courseNumber: Optional[str] = None
    txt_term: str = None
    startDatepicker: Optional[str] = None
    endDatepicker: Optional[str] = None
    pageOffset: Optional[int] = None
    pageMaxSize: Optional[int] = None
