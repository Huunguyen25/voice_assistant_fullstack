import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

query = "CREATE TABLE IF NOT EXISTS sys_command()"
