import sqlite3
import eel


def create_tables(conn):
    cursor = conn.cursor()

    # Create sys_command table
    query = "CREATE TABLE IF NOT EXISTS sys_command(id INTEGER PRIMARY KEY, name varchar(100), path varchar(1000))"
    cursor.execute(query)

    # Create web_command table
    query = "CREATE TABLE IF NOT EXISTS web_command(id INTEGER PRIMARY KEY, name VARCHAR(100), url VARCHAR(1000))"
    cursor.execute(query)

    query = "CREATE TABLE IF NOT EXISTS api_key(id INTEGER PRIMARY KEY, name VARCHAR(100), api VARCHAR(1000))"
    cursor.execute(query)

    query = "CREATE TABLE IF NOT EXISTS chat_log(id INTEGER PRIMARY KEY, session_id VARCHAR(100), user_message VARCHAR(10000), ai_message VARCHAR(10000), timestamp VARCHAR(100))"
    cursor.execute(query)

    conn.commit()
    conn.close()


@eel.expose
def add_sys_command(name, path):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    query = "INSERT INTO sys_command VALUES (null, ?, ?)"
    cursor.execute(query, (name, path))
    conn.commit()
    conn.close()


@eel.expose
def add_web_command(name, url):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    query = "INSERT INTO web_command VALUES (null, ?, ?)"
    cursor.execute(query, (name, url))
    conn.commit()
    conn.close()


@eel.expose
def add_openrouter_api_key(openrouter, api):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    query = "INSERT INTO api_key VALUES (null, ?, ?)"
    cursor.execute(query, (openrouter, api))
    conn.commit()
    conn.close()


@eel.expose
def delete_openrouter_api_key(openrouter):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    query = "DELETE FROM api_key WHERE api = ?"
    cursor.execute(query, (openrouter,))
    conn.commit()
    conn.close()


@eel.expose
def add_picovoice_api_key(picovoice, picovoice_api):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    query = "INSERT INTO api_key VALUES (null, ?, ?)"
    cursor.execute(query, (picovoice, picovoice_api))
    conn.commit()
    conn.close()


@eel.expose
def delete_picovoice_api_key(picovoice_api):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    query = "DELETE FROM api_key WHERE api = ?"
    cursor.execute(query, (picovoice_api,))
    conn.commit()
    conn.close()


@eel.expose
def delete_sys_command(name):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    query = "DELETE FROM sys_command WHERE name = ?"
    cursor.execute(query, (name,))
    conn.commit()
    conn.close()


@eel.expose
def delete_web_command(name):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    query = "DELETE FROM web_command WHERE name = ?"
    cursor.execute(query, (name,))
    conn.commit()
    conn.close()


# query = "INSERT INTO sys_command VALUES (null, 'spotify', 'C:\\Users\\Skepzie\\AppData\\Roaming\\Spotify\\Spotify.exe')"
# cursor.execute(query)
# conn.commit()

# query = "DELETE FROM sys_command WHERE name = 'spotify'"
# cursor.execute(query)
# conn.commit()

# query = "DROP TABLE IF EXISTS web_command"
# cursor.execute(query)

# query = "INSERT INTO web_command VALUES (null,'grammarly','https://grammarly.com/')"
# query = "INSERT INTO web_command VALUES (null,'icollege','https://icollege.gsu.edu/')"
# cursor.execute(query)
# conn.commit()
