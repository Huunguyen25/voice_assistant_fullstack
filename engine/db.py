import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# query = "CREATE TABLE IF NOT EXISTS sys_command(id INTEGER PRIMARY KEY, name varchar(100), path varchar(1000))"
# cursor.execute(query)

query = "INSERT INTO sys_command VALUES (null, '', '')"
cursor.execute(query)

conn.commit()
