import requests 
from school.courses import search_class 
ELLUCIAN_PAGE_URL = "https://student-ssb-regis.montclair.edu/StudentRegistrationSsb/ssb"

# Creates a browser session
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

# Get the terms aviable
def get_term_list(session: requests.Session) -> list[str]:
    url = f"{ELLUCIAN_PAGE_URL}/classSearch/getTerms?searchTerm=&offset=1&max=5"
    response = session.get(url, timeout=30)
    response.raise_for_status()
    return response.json()

# Most important step!! without it you won't get the correct data!!!
def initialize_term(session: requests.Session, term: str) -> str:
    url = f"{ELLUCIAN_PAGE_URL}/term/termSelection?mode=search"
    response = session.get(url, timeout=30)
    response.raise_for_status()

    term_search_url = f"{ELLUCIAN_PAGE_URL}/term/search?mode=search"

    r = session.post(term_search_url, data={"term": term}, timeout=30)
    if r.status_code >= 400:
        print('Fallback option!')
        # Fallback: some instances use txt_term.
        r = session.post(term_search_url, data={"txt_term": term}, timeout=30)
    r.raise_for_status()
    response.raise_for_status()

    return term # try to delete this 
      
class_test = {"txt_subject" : 'BIOL', "txt_term": "202710"}


def main():
    session = like_browser_session()

    term_list = get_term_list(session)
    test_term = term_list[0]["code"] #Get the latest term aviable

    initialize_term(session, test_term)
    result = search_class(session, class_test)

    print(result)
if __name__ == "__main__":
    main()
