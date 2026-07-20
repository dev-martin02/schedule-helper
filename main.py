from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schedules.api import router as schedules_router
from school.courses.api import router as courses_router
from util.db import start_db

app = FastAPI(title="Schedule Helper API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
start_db()


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(courses_router)
app.include_router(schedules_router)
