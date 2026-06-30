from typing import Optional
from pydantic import BaseModel
import requests

ELLUCIAN_PAGE_URL = "https://student-ssb-regis.montclair.edu/StudentRegistrationSsb/ssb"

class Course(BaseModel):
    txt_subject: str = None
    txt_courseNumber: Optional[str] = None
    txt_term: str = None
    startDatepicker: Optional[str] = None
    endDatepicker: Optional[str] = None
    pageOffset: Optional[int] = None
    pageMaxSize: Optional[int] = None


def search_class(session: requests.Session, course_info): 
    url = f"{ELLUCIAN_PAGE_URL}/searchResults/searchResults"

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Referer": f"{ELLUCIAN_PAGE_URL}/classSearch/classSearch",
        "X-Requested-With": "XMLHttpRequest",
    }
    params = Course(**course_info)

    response = session.get(url,params=params, headers=headers)
    response.raise_for_status()
    print(response.text)
      
