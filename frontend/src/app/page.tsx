"use client";

import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  GraduationCap,
  Heart,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Course = {
  id: string;
  code: string;
  title: string;
  professor: string;
  rating: string;
  days: string[];
  time: string;
  room: string;
  credits: number;
  seats: number;
  color: "blue" | "orange" | "green" | "violet";
  start: number;
  duration: number;
};

const allCourses: Course[] = [
  {
    id: "biol-112-01",
    code: "BIOL 112-01",
    title: "Principles of Biology II",
    professor: "Dr. Maya Chen",
    rating: "4.8",
    days: ["Mon", "Wed"],
    time: "10:00 – 11:15 AM",
    room: "Science Hall 214",
    credits: 4,
    seats: 8,
    color: "blue",
    start: 10,
    duration: 1.25,
  },
  {
    id: "chem-120-03",
    code: "CHEM 120-03",
    title: "General Chemistry I",
    professor: "Prof. Daniel Ruiz",
    rating: "4.6",
    days: ["Tue", "Thu"],
    time: "11:30 AM – 12:45 PM",
    room: "Richardson Hall 101",
    credits: 4,
    seats: 12,
    color: "orange",
    start: 11.5,
    duration: 1.25,
  },
  {
    id: "math-122-02",
    code: "MATH 122-02",
    title: "Calculus II",
    professor: "Dr. Evelyn Brooks",
    rating: "4.9",
    days: ["Mon", "Wed"],
    time: "1:00 – 2:15 PM",
    room: "Center for Computing 305",
    credits: 4,
    seats: 5,
    color: "green",
    start: 13,
    duration: 1.25,
  },
  {
    id: "psyc-101-06",
    code: "PSYC 101-06",
    title: "General Psychology",
    professor: "Dr. Olivia Foster",
    rating: "4.7",
    days: ["Tue", "Thu"],
    time: "2:30 – 3:45 PM",
    room: "University Hall 204",
    credits: 3,
    seats: 16,
    color: "violet",
    start: 14.5,
    duration: 1.25,
  },
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const times = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const TERM_CODES: Record<string, string> = {
  "Fall 2026": "202710",
  "Spring 2027": "202720",
  "Summer 2027": "202730",
};

function normalizeApiCourses(payload: unknown): Course[] {
  const body = payload as { data?: unknown; sections?: unknown; results?: unknown };
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body?.sections)
        ? body.sections
        : Array.isArray(body?.results)
          ? body.results
          : [];

  return rows.flatMap((row, index) => {
    if (!row || typeof row !== "object") return [];
    const item = row as Record<string, unknown>;
    const text = (...keys: string[]) => keys.map((key) => item[key]).find((value) => value !== undefined && value !== null && value !== "")?.toString() ?? "";
    const code = text("courseCode", "course", "courseReferenceNumber", "subjectCourse").trim() || `COURSE ${index + 1}`;
    const title = text("courseTitle", "title", "courseName", "description").trim() || "Course section";
    const professor = text("faculty", "instructor", "professor", "instructorName").trim() || "Instructor TBD";
    const meeting = text("meetingTime", "time", "schedule", "meetingTimes").trim() || "Time TBD";
    const location = text("location", "room", "buildingDescription").trim() || "Location TBD";
    const rawDays = text("days", "meetingDays");
    const days = rawDays.match(/Mon|Tue|Wed|Thu|Fri/g) ?? ["Mon"];
    const rawSeats = Number(text("seatsAvailable", "availableSeats", "seats"));
    const color = (["blue", "orange", "green", "violet"] as const)[index % 4];
    return [{
      id: text("id", "courseReferenceNumber") || `${code}-${index}`,
      code,
      title,
      professor,
      rating: text("rating") || "—",
      days,
      time: meeting,
      room: location,
      credits: Number(text("credits", "creditHours")) || 3,
      seats: Number.isFinite(rawSeats) && rawSeats > 0 ? rawSeats : 0,
      color,
      start: 10 + (index % 5),
      duration: 1.25,
    }];
  });
}

function CourseCard({
  course,
  selected,
  onToggle,
}: {
  course: Course;
  selected: boolean;
  onToggle: () => void;
}) {
  const [favorite, setFavorite] = useState(false);

  return (
    <article className={`course-card ${selected ? "course-card-selected" : ""}`}>
      <div className="course-card-top">
        <div>
          <span className={`course-code ${course.color}`}>{course.code}</span>
          <h3>{course.title}</h3>
        </div>
        <button
          className={`icon-button ${favorite ? "favorite" : ""}`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => setFavorite(!favorite)}
        >
          <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="professor-row">
        <span className="avatar-mini">{course.professor.split(" ").at(-1)?.[0]}</span>
        <span>{course.professor}</span>
        <span className="rating">★ {course.rating}</span>
      </div>
      <div className="course-meta">
        <span><CalendarDays size={15} /> {course.days.join(" & ")}</span>
        <span><Clock3 size={15} /> {course.time}</span>
        <span><MapPin size={15} /> {course.room}</span>
      </div>
      <div className="course-card-footer">
        <span>{course.credits} credits</span>
        <span className={course.seats <= 5 ? "seats-low" : "seats-open"}>
          <i /> {course.seats} seats left
        </span>
        <Button
          variant={selected ? "outline" : "dark"}
          onClick={onToggle}
          aria-label={`${selected ? "Remove" : "Add"} ${course.code}`}
        >
          {selected ? <><Check size={15} /> Added</> : <><Plus size={15} /> Add</>}
        </Button>
      </div>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(["biol-112-01", "chem-120-03", "math-122-02"]);
  const [semester, setSemester] = useState("Fall 2026");
  const [showFilters, setShowFilters] = useState(false);
  const [scheduleSaved, setScheduleSaved] = useState(false);
  const [apiCourses, setApiCourses] = useState<Course[] | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      const resetTimer = window.setTimeout(() => {
        setApiCourses(null);
        setApiError(false);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setApiLoading(true);
      setApiError(false);
      try {
        const response = await fetch(`${API_URL}/courses?subject=${encodeURIComponent(term)}&term=${TERM_CODES[semester] ?? "202710"}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`Course search failed (${response.status})`);
        const data = normalizeApiCourses(await response.json());
        setApiCourses(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setApiError(true);
        setApiCourses(null);
      } finally {
        setApiLoading(false);
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, semester]);

  const courses = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (apiCourses) return apiCourses;
    if (!term) return allCourses;
    return allCourses.filter((course) =>
      [course.code, course.title, course.professor].some((value) => value.toLowerCase().includes(term)),
    );
  }, [apiCourses, query]);

  const selectedCourses = (apiCourses ?? allCourses).filter((course) => selected.includes(course.id));
  const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);

  function toggleCourse(id: string) {
    setScheduleSaved(false);
    setSaveError(false);
    setSelected((current) =>
      current.includes(id) ? current.filter((courseId) => courseId !== id) : [...current, id],
    );
  }

  async function saveCurrentSchedule() {
    if (!selectedCourses.length) return;
    setSaveError(false);
    try {
      const response = await fetch(`${API_URL}/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Joan Morel",
          term: semester,
          course_ids: selectedCourses.map((course) => course.id),
        }),
      });
      if (!response.ok) throw new Error(`Schedule save failed (${response.status})`);
      setScheduleSaved(true);
    } catch {
      setSaveError(true);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Scheduly home">
          <span className="brand-mark"><CalendarDays size={20} /></span>
          <span>Scheduly</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="active" href="#builder">Schedule builder</a>
          <a href="#courses">Course catalog</a>
          <a href="#saved">My schedules</a>
        </nav>
        <div className="topbar-actions">
          <button className="help-button" aria-label="Help"><CircleHelp size={19} /></button>
          <div className="profile">
            <span className="profile-avatar">JM</span>
            <span><b>Joan Morel</b><small>Student</small></span>
            <ChevronDown size={15} />
          </div>
        </div>
      </header>

      <section className="page-heading" id="top">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> Smart schedule builder</span>
          <h1>Build a week that works for you.</h1>
          <p>Find the right classes, compare professors, and shape your semester without the spreadsheet chaos.</p>
        </div>
        <div className="semester-select">
          <label htmlFor="semester">Planning for</label>
          <div className="select-wrap">
            <GraduationCap size={17} />
            <select id="semester" value={semester} onChange={(event) => setSemester(event.target.value)}>
              <option>Fall 2026</option>
              <option>Spring 2027</option>
              <option>Summer 2027</option>
            </select>
            <ChevronDown size={15} />
          </div>
        </div>
      </section>

      <section className="builder" id="builder">
        <aside className="catalog-panel" id="courses">
          <div className="panel-heading">
            <div><span className="step-number">1</span><div><h2>Find your courses</h2><p>{apiLoading ? "Searching the course catalog…" : apiError ? "Showing saved recommendations" : apiCourses ? `${apiCourses.length} sections from the catalog` : `${allCourses.length} recommended sections`}</p></div></div>
            <button className="icon-button" aria-label="More options"><MoreHorizontal size={19} /></button>
          </div>

          <div className="search-row">
            <div className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search subject, course, or professor"
                aria-label="Search courses"
              />
              {query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={15} /></button>}
            </div>
            <Button variant={showFilters ? "dark" : "outline"} className="filter-button" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters
            </Button>
          </div>

          {showFilters && (
            <div className="filter-strip">
              <button>Morning <ChevronDown size={13} /></button>
              <button>Any day <ChevronDown size={13} /></button>
              <button>Open seats <Check size={13} /></button>
            </div>
          )}

          <div className="results-label">
            <span>Best matches</span>
            <button>Sort by fit <ChevronDown size={13} /></button>
          </div>

          <div className="course-list">
            {courses.length ? courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                selected={selected.includes(course.id)}
                onToggle={() => toggleCourse(course.id)}
              />
            )) : (
              <div className="empty-state"><Search size={24} /><h3>No courses found</h3><p>Try a subject code like BIOL or a professor name.</p></div>
            )}
          </div>
        </aside>

        <section className="schedule-panel" id="saved">
          <div className="panel-heading schedule-heading">
            <div><span className="step-number">2</span><div><h2>Your weekly schedule</h2><p>{selectedCourses.length} courses · {totalCredits} credits</p></div></div>
            <div className="calendar-actions">
              <button aria-label="Previous week"><ChevronLeft size={18} /></button>
              <button className="today-button">Typical week</button>
              <button aria-label="Next week"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="schedule-summary">
            <div><Clock3 size={17} /><span><b>Earliest class</b><small>{selectedCourses.length ? "10:00 AM" : "—"}</small></span></div>
            <div><BookOpen size={17} /><span><b>Weekly class time</b><small>{selectedCourses.length ? `${(selectedCourses.length * 2.5).toFixed(1)} hours` : "0 hours"}</small></span></div>
            <div><UserRound size={17} /><span><b>Average rating</b><small>{selectedCourses.length ? "4.8 / 5" : "—"}</small></span></div>
          </div>

          <div className="calendar-scroll">
            <div className="calendar" aria-label="Weekly class schedule">
              <div className="calendar-corner" />
              {dayLabels.map((day) => <div className="day-header" key={day}><b>{day}</b><span>{day === "Mon" ? "7" : day === "Tue" ? "8" : day === "Wed" ? "9" : day === "Thu" ? "10" : "11"}</span></div>)}
              <div className="time-labels">
                {times.map((time) => <span key={time}>{time}</span>)}
              </div>
              {dayLabels.map((day, dayIndex) => (
                <div className="day-column" key={day} style={{ gridColumn: dayIndex + 2 }}>
                  {selectedCourses.filter((course) => course.days.includes(day)).map((course) => (
                    <div
                      className={`calendar-event ${course.color}`}
                      key={course.id}
                      style={{ top: `${(course.start - 8) * 64 + 8}px`, height: `${course.duration * 64 - 8}px` }}
                    >
                      <button aria-label={`Remove ${course.code}`} onClick={() => toggleCourse(course.id)}><Trash2 size={12} /></button>
                      <b>{course.code.split("-")[0]}</b>
                      <span>{course.time.split(" – ")[0]}</span>
                      <small>{course.room.split(" ").slice(0, 2).join(" ")}</small>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="schedule-footer">
            <div className={`fit-score ${selectedCourses.length >= 3 ? "good" : ""}`}>
              <span>{selectedCourses.length >= 3 ? "94" : "—"}</span>
              <div><b>Schedule fit</b><small>{selectedCourses.length >= 3 ? "Great match for your preferences" : "Add more classes to see your fit"}</small></div>
            </div>
            <Button variant="dark" onClick={saveCurrentSchedule} disabled={!selectedCourses.length}>
              {scheduleSaved ? <><Check size={16} /> Schedule saved</> : saveError ? "Try saving again" : "Save this schedule"}
            </Button>
          </div>
        </section>
      </section>
    </main>
  );
}
