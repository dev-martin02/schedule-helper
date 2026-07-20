import sqlite3

def get_connection():
    connection = sqlite3.connect("School.db")
    return connection

def start_db(): 
    with get_connection() as conn :
        user_table = """
            CREATE TABLE IF NOT EXISTS users (  
                name TEXT NOT NULL UNIQUE,
                id INTEGER PRIMARY KEY AUTOINCREMENT
            ); 
        """

        user_available_days = """
            CREATE TABLE IF NOT EXISTS user_available_days (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                day_of_week TEXT NOT NULL CHECK (
                    day_of_week IN (
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday'
                    )
                ),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        """

        availability_preferences = """
            CREATE TABLE IF NOT EXISTS availability_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                morning_classes BOOLEAN NOT NULL,
                gap_preference TEXT NOT NULL CHECK (
                    gap_preference IN ('none', 'short', 'long')
                ),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        """
        schedules = """
            CREATE TABLE IF NOT EXISTS schedules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                term TEXT NOT NULL,
                course_ids TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        """
        cursor = conn.cursor()
        cursor.executescript(user_table + availability_preferences + user_available_days + schedules)
