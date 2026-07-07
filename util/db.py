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
            )
        """
        cursor = conn.cursor()
        cursor.execute(user_table)