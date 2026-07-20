import json
from typing import Any

from fastapi import APIRouter, Query

from schedules.schemas import SchedulePayload
from util.db import get_connection


router = APIRouter()


@router.post("/schedules", status_code=201)
def save_schedule(payload: SchedulePayload) -> dict[str, Any]:
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO schedules (name, term, course_ids) VALUES (?, ?, ?)",
            (payload.name.strip(), payload.term.strip(), json.dumps(payload.course_ids)),
        )
        return {"id": cursor.lastrowid, **payload.model_dump()}


@router.get("/schedules")
def read_schedules(
    name: str = Query(default="Joan Morel", min_length=1, max_length=120),
) -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT id, name, term, course_ids, created_at FROM schedules WHERE name = ? ORDER BY id DESC",
            (name.strip(),),
        ).fetchall()
    return [
        {
            "id": row[0],
            "name": row[1],
            "term": row[2],
            "course_ids": json.loads(row[3]),
            "created_at": row[4],
        }
        for row in rows
    ]
