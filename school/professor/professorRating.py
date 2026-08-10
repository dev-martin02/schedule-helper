import requests

query = """
query SearchProfessors($search: TeacherSearchQuery!, $count: Int) {
  newSearch {
    teachers(query: $search, first: $count) {
      edges {
        node {
          legacyId
          firstName
          lastName
          department
          avgRating
          avgDifficulty
          numRatings
          wouldTakeAgainPercentRounded
          school {
            name
          }
        }
      }
    }
  }
}
"""

def get_professor_rating(professor_name):
    # Flip Name
    data = professor_name.split(',')

    professor_fullname = f"{data[1]} {data[0]}"

    response = requests.post(
        "https://www.ratemyprofessors.com/graphql",
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Authorization": "null",
        },
        json={
            "query": query,
            "variables": {
                "search": {
                    "text": professor_fullname,
                    "schoolID": "U2Nob29sLTYzMA==",
                },
                "count": 1,
            },
        },
        timeout=20,
    )

    data = response.json()

    if data.get("errors"):
        print("GraphQL error:", data["errors"])
    else:
        professors = data["data"]["newSearch"]["teachers"]["edges"]

        if not professors:
            print("No professor found. Check the spelling and school ID.")

        names = []
        for edge in professors: 
            names.append(edge["node"])
        return names
