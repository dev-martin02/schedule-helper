import requests

ELLUCIAN_PAGE_URL = "https://student-ssb-regis.montclair.edu/StudentRegistrationSsb/ssb"


# Creates a browser-like session
def like_browser_session() -> requests.Session:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept": "*/*",
        "Connection": "keep-alive",
    }
    session = requests.Session()
    session.headers.update(headers)
    return session


def get_term_list(session: requests.Session) -> list[dict]:
    url = f"{ELLUCIAN_PAGE_URL}/classSearch/getTerms?searchTerm=&offset=1&max=5"
    response = session.get(url, timeout=30)
    response.raise_for_status()
    return response.json()


# STEP 1: initialize session properly (IMPORTANT)
def initialize_term(session: requests.Session, term: str) -> str:
    # 1. load term selection page (sets cookies)
    url = f"{ELLUCIAN_PAGE_URL}/term/termSelection?mode=search"
    r = session.get(url, timeout=30)
    r.raise_for_status()

    # 2. send term selection (server state setup)
    term_search_url = f"{ELLUCIAN_PAGE_URL}/term/search?mode=search"

    r = session.post(term_search_url, data={"term": term}, timeout=30)
    if r.status_code >= 400:
        r = session.post(term_search_url, data={"txt_term": term}, timeout=30)

    r.raise_for_status()
    return term


# STEP 2: search class properly
def search_class(session: requests.Session, term_code: str):
    url = f"{ELLUCIAN_PAGE_URL}/searchResults/searchResults"

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Referer": f"{ELLUCIAN_PAGE_URL}/classSearch/classSearch",
        "X-Requested-With": "XMLHttpRequest",
    }

    params = {
        "txt_subject": "BIOL",
        "txt_courseNumber": "110",
        "txt_term": term_code,
        "startDatepicker": "",
        "endDatepicker": "",
        "pageOffset": "0",
        "pageMaxSize": "10",
        "sortColumn": "subjectDescription",
        "sortDirection": "asc",
    }

    response = session.get(url, params=params, headers=headers)
    response.raise_for_status()

    # IMPORTANT: always return JSON, not print text
    try:
        return response.json()
    except Exception:
        return {"raw": response.text}


def main():
    print("Starting...")

    session = like_browser_session()

    # get terms
    term_list = get_term_list(session)
    test_term = term_list[0]["code"]

    # initialize session (critical missing step in your version)
    initialize_term(session, test_term)

    # search classes
    result = search_class(session, test_term)

    print(result)


if __name__ == "__main__":
    main()