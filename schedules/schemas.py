from pydantic import BaseModel, Field


class SchedulePayload(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    term: str = Field(min_length=1, max_length=40)
    course_ids: list[str] = Field(min_length=1, max_length=30)
