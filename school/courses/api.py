from typing import Any

import requests
from fastapi import APIRouter, HTTPException, Query

from school.courses.service import (
    get_term_list,
    handshake_request,
    like_browser_session,
    search_courses,
)

router = APIRouter()

@router.get("/terms")
def read_terms() -> list[dict[str, Any]]:
    try:
        with like_browser_session() as session:
            return get_term_list(session)
    except (requests.RequestException, ValueError) as error:
        raise HTTPException(status_code=502, detail=str(error)) from error


@router.post("/courses")
def read_courses(
    subject: str = Query(min_length=2, max_length=40),
    term: str | None = None,
    course_number: str | None = None,
) -> dict[str, Any]:
    try:
        with like_browser_session() as session:
            if term is None:
                terms = get_term_list(session)
                if not terms:
                    raise HTTPException(
                        status_code=404,
                        detail="No academic terms are currently available.",
                    )
                term = str(terms[1]["code"])

            handshake_request(session, term)
            return search_courses(
                session=session,
                subject=subject.strip().upper(),
                term=term,
                course_number=course_number,
            )
    except HTTPException:
        raise
    except (requests.RequestException, KeyError, ValueError) as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
