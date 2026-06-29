import requests 

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


def get_term_list(session: requests.Session) -> list[str]:
    url = f"{ELLUCIAN_PAGE_URL}/classSearch/getTerms?searchTerm=&offset=1&max=5"
    response = session.get(url, timeout=30)
    response.raise_for_status()
    return [term for term in response.json()]

def search_term(session: requests.Session, term: str) -> str:
    url = f"{ELLUCIAN_PAGE_URL}/term/termSelection?mode=search"
    response = session.get(url, timeout=30)
    response.raise_for_status()
    return response.text

def main():
    print("Hello from backend!")
    session = like_browser_session()
    term_list = get_term_list(session)
    print(term_list)

if __name__ == "__main__":
    main()
