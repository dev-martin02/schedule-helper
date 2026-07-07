from util.db import get_connection

def search_user(name: str) -> list[str]:
    user_search = """
        SELECT * FROM users WHERE name = ? 
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(user_search, [name])
        return cursor.fetchall()

def insert_user(name: str) -> str:
    # Insert query
    user_insert = """
        INSERT INTO users (name) VALUES (?)  
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(user_insert, (name,))
        print(f"{name} was added it successfully !!")


if __name__ == "__main__" :
    def welcome_msg(): 
        print('Helloo, please say your name!! \n')
        name = input('Name: ')
        print("\nLooking for your account! ... \n")
        search_result = search_user(name)

        if len(search_result) == 0 :
            print('It seems like that name is not in our database... Adding you up right now !!\n')
            insert_user(name)
        else:
            print(f"Welcome Back, {name}!!")

    start_db()
    welcome_msg()