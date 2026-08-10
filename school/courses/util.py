from school.professor.professorRating import get_professor_rating
def clean_course_request(section):
    return {
        "id": section.get("id"),
        "termDesc": section.get("termDesc"),
        "courseReferenceNumber": section.get("courseReferenceNumber"),
        "courseNumber": section.get("courseNumber"),
        "subject": section.get("subject"),
        "subjectDescription": section.get("subjectDescription"),
        "campusDescription": section.get("campusDescription"),
        "courseTitle": section.get("courseTitle"),

        "maximumEnrollment": section.get("maximumEnrollment"),
        "enrollment": section.get("enrollment"),
        "seatsAvailable": section.get("seatsAvailable"),

        "waitCapacity": section.get("waitCapacity"),
        "waitCount": section.get("waitCount"),
        "waitAvailable": section.get("waitAvailable"),

        "creditHourLow": section.get("creditHourLow"),

        "faculty": [
            {
                "ProfessorName": faculty.get('displayName'),
                "displayName": get_professor_rating(faculty.get("displayName"))
            }
            for faculty in section.get("faculty", [])
        ],

        "meetingsFaculty": [
            {
                "meetingType": meeting.get("meetingType"),

                "meetingTime": {
                    "startDate": meeting.get("meetingTime", {}).get("startDate"),
                    "endDate": meeting.get("meetingTime", {}).get("endDate"),

                    "beginTime": meeting.get("meetingTime", {}).get("beginTime"),
                    "endTime": meeting.get("meetingTime", {}).get("endTime"),

                    "meetingScheduleType": (
                        meeting.get("meetingTime", {})
                        .get("meetingScheduleType")
                    ),

                    "room": meeting.get("meetingTime", {}).get("room"),
                    "term": meeting.get("meetingTime", {}).get("term"),

                    "monday": meeting.get("meetingTime", {}).get("monday"),
                    "tuesday": meeting.get("meetingTime", {}).get("tuesday"),
                    "wednesday": meeting.get("meetingTime", {}).get("wednesday"),
                    "thursday": meeting.get("meetingTime", {}).get("thursday"),
                    "friday": meeting.get("meetingTime", {}).get("friday"),
                    "saturday": meeting.get("meetingTime", {}).get("saturday"),
                    "sunday": meeting.get("meetingTime", {}).get("sunday"),
                }
            }
            for meeting in section.get("meetingsFaculty", [])
        ]
    }

