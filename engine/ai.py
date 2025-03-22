from openai import OpenAI
from engine.db import *
import eel

conn = sqlite3.connect("database.db")
cursor = conn.cursor()


def retrieveAPI():
    cursor.execute("SELECT api FROM api_key")
    api = cursor.fetchall()
    return api[0][0]


@eel.expose
def ai_response(query):
    api = retrieveAPI()
    if api is not None:
        try:
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=f"{api}",
            )

            completion = client.chat.completions.create(
                extra_body={},
                model="deepseek/deepseek-chat:free",
                messages=[{"role": "user", "content": f"{query}"}],
            )
            return str(completion.choices[0].message.content)
        except Exception:
            return "Sorry, I can't help you at this time."
