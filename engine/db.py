import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

query = "CREATE TABLE IF NOT EXISTS sys_command(id INTEGER PRIMARY KEY, name varchar(100), path varchar(1000))"
cursor.execute(query)

query = "INSERT INTO sys_command VALUES (null, 'spotify', 'C:\\Users\\Skepzie\\AppData\\Roaming\\Spotify\\Spotify.exe')"
# cursor.execute(query)
# conn.commit()

# query = "DELETE FROM sys_command WHERE name = 'spotify'"
cursor.execute(query)
conn.commit()

# query = "DROP TABLE IF EXISTS web_command"
# cursor.execute(query)

query = "CREATE TABLE IF NOT EXISTS web_command(id INTEGER PRIMARY KEY, name VARCHAR(100), url VARCHAR(1000))"
cursor.execute(query)

# query = "INSERT INTO web_command VALUES (null,'grammarly','https://grammarly.com/')"
# query = "INSERT INTO web_command VALUES (null,'icollege','https://icollege.gsu.edu/')"
# cursor.execute(query)
# conn.commit()