import requests
# Create a class that will mimic the main.py flow automatically for you without the need to do it manually
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
class School:
    url = "https://student-ssb-regis.montclair.edu/StudentRegistrationSsb/ssb"

    def __inti__(self, session, term, course):
        self.session = like_browser_session()
        pass