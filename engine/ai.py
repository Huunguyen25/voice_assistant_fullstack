from openai import OpenAI
from engine.db import *
import eel

conn = sqlite3.connect("database.db")
cursor = conn.cursor()


def retrieveAPI():
    try:
        cursor.execute("SELECT api FROM api_key")
        result = cursor.fetchall()
        if not result:
            return None
        return result[0][0]
    except Exception as e:
        print(f"Error retrieving API key: {e}")
        return None


@eel.expose
def ai_response(query):
    try:
        api = retrieveAPI()
        if api is None:
            return "API key not found. Please add your API key in settings."
        
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
    except Exception as e:
        print(f"AI response error: {e}")
        return f"Sorry, I can't help you at this time. Error: {str(e)}"
