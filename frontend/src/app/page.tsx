"use client";

import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type Course = {
  id: string;
  code: string;
  title: string;
  instructor: string;
  credits: string;
  seats: string;
};

function text(item: Record<string, unknown>, ...keys: string[]) {
  const value = keys
    .map((key) => item[key])
    .find((entry) => entry != null && entry !== "");
  return value == null ? "" : String(value);
}

function normalizeCourses(payload: unknown): Course[] {
  const rows = (payload as { data?: unknown })?.data;
  if (!Array.isArray(rows)) return [];

  return rows.map((row, index) => {
    const item = row as Record<string, unknown>;
    const faculty = Array.isArray(item.faculty) ? item.faculty[0] : null;
    const instructor =
      faculty && typeof faculty === "object"
        ? text(faculty as Record<string, unknown>, "displayName", "fullName")
        : text(item, "instructor", "professor");
    const subject = text(item, "subject");
    const number = text(item, "courseNumber");
    const section = text(item, "sequenceNumber");
    const available = Number(item.maximumEnrollment) - Number(item.enrollment);

    return {
      id: text(item, "courseReferenceNumber", "id") || String(index),
      code:
        text(item, "courseCode") ||
        [subject, number, section].filter(Boolean).join(" "),
      title: text(item, "courseTitle", "title") || "Untitled course",
      instructor: instructor || "Instructor not announced",
      credits:
        text(item, "creditHourHigh", "creditHours", "creditHourLow") || "—",
      seats: Number.isFinite(available) ? String(Math.max(0, available)) : "—",
    };
  });
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const match = query
      .trim()
      .match(/^([a-zA-Z]{2,})(?:\s*-?\s*(\d+[a-zA-Z]?))?$/);
    if (!match) {
      setStatus("error");
      setMessage(
        "Use a subject code, with an optional course number — for example, CSIT 104.",
      );
      return;
    }

    setStatus("loading");
    setMessage("");
    const params = new URLSearchParams({ subject: match[1].toUpperCase() });
    if (match[2]) params.set("course_number", match[2].toUpperCase());

    try {
      const response = await fetch(`${API_URL}/courses?${params}`);
      if (!response.ok) throw new Error();
      const results = normalizeCourses(await response.json());
      setCourses(results);
      setStatus("success");
      setMessage(
        results.length
          ? `${results.length} courses found`
          : "No courses matched that search.",
      );
    } catch {
      setCourses([]);
      setStatus("error");
      setMessage(
        "The course catalog could not be reached. Make sure the backend is running.",
      );
    }
  }

  return (
    <main className={`page ${status === "success" ? "has-results" : ""}`}>
      <section className="search-section">
        <p className="kicker">Montclair course finder</p>
        <h1>What do you want to learn?</h1>
        <p className="intro">
          Search the current catalog by subject or course number.
        </p>

        <form className="search-form" onSubmit={search} role="search">
          <label className="sr-only" htmlFor="course-search">
            Search courses
          </label>
          <span className="search-icon" aria-hidden="true" />
          <input
            id="course-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try CSIT or CSIT 104"
            autoComplete="off"
            autoFocus
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Searching…" : "Search"}
          </button>
        </form>

        <p
          className={`status ${status === "error" ? "error" : ""}`}
          aria-live="polite"
        >
          {message}
        </p>
      </section>

      {status === "success" && courses.length > 0 && (
        <section className="results" aria-label="Course search results">
          {courses.map((course) => (
            <article className="course" key={course.id}>
              <div>
                <p className="course-code">{course.code}</p>
                <h2>{course.title}</h2>
                <p className="instructor">{course.instructor}</p>
              </div>
              <dl>
                <div>
                  <dt>Credits</dt>
                  <dd>{course.credits}</dd>
                </div>
                <div>
                  <dt>Seats</dt>
                  <dd>{course.seats}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
