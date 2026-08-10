from typing import Any
import requests

from school.courses.schemas import Course
from school.courses.util import clean_course_request


ELLUCIAN_PAGE_URL = (
    "https://student-ssb-regis.montclair.edu/StudentRegistrationSsb/ssb"
)

# Utilities
def handshake_request(session: requests.Session, term: str) -> None:
    """Initialize the selected term before requesting course results."""
    selection_url = f"{ELLUCIAN_PAGE_URL}/term/termSelection?mode=search"
    response = session.get(selection_url, timeout=30)
    response.raise_for_status()

    search_url = f"{ELLUCIAN_PAGE_URL}/term/search?mode=search"
    response = session.post(search_url, data={"term": term}, timeout=30)

    if response.status_code >= 400:
        response = session.post(
            search_url,
            data={"txt_term": term},
            timeout=30,
        )
    response.raise_for_status()


def like_browser_session() -> requests.Session:
    """Create the session required by the university registration site."""
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept": "*/*",
            "Connection": "keep-alive",
        }
    )
    return session

def get_term_list(session: requests.Session) -> list[dict[str, Any]]:
    """Get the academic terms available for course searches."""
    url = f"{ELLUCIAN_PAGE_URL}/classSearch/getTerms"
    response = session.get(
        url,
        params={"searchTerm": "", "offset": 1, "max": 5},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()

def search_courses(
    session: requests.Session,
    subject: str,
    term: str,
    course_number: str | None = None,
) -> dict[str, Any]:
    """Request course results from the university registration site."""
    url = f"{ELLUCIAN_PAGE_URL}/searchResults/searchResults"
    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Referer": f"{ELLUCIAN_PAGE_URL}/classSearch/classSearch",
        "X-Requested-With": "XMLHttpRequest",
    }
    params = {
        "txt_subject": subject,
        "txt_term": term,
        "pageOffset": 0,
        "pageMaxSize": 50,
    }
    if course_number:
        params["txt_courseNumber"] = course_number

    response = session.get(
        url,
        params=params,
        headers=headers,
        timeout=30,
    )
    response.raise_for_status()
    return clean_request(response.json())

def search_class(session: requests.Session, course_info):
    url = f"{ELLUCIAN_PAGE_URL}/searchResults/searchResults"

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Referer": f"{ELLUCIAN_PAGE_URL}/classSearch/classSearch",
        "X-Requested-With": "XMLHttpRequest",
    }
    params = Course(**course_info)

    response = session.get(url, params=params, headers=headers)
    response.raise_for_status()
    print(response.text)

def clean_request(course_info: dict[str, Any]) -> dict[str, Any]:
    cleaned_data = [
    clean_course_request(course)
    for course in course_info.get("data")
    ]
    return {
        "success": course_info.get("success"),
        "totalCount": course_info.get("totalCount"),
        "pageOffset": course_info.get("pageOffset", 0),
        "pageMaxSize": course_info.get("pageMaxSize", 0),
        "data": cleaned_data,
    }   