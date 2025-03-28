from openai import OpenAI
from engine.db import *
import eel
import tiktoken

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

    # implement a list storing up to 5 previous response
    # LOGIC for new chat:
    # if new chat then clear the list


def count_token(context, model="deepseek-v3"):
    try:
        encoder = tiktoken.encoding_for_model(model)
    except KeyError:
        encoder = tiktoken.get_encoding("cl100k_base")

    return len(encoder.encode(context))


previous_response = []


@eel.expose
def ai_response(query):
    for response in previous_response:
        print(f"Role: {response['role']}, Content: {response['content']}")
    previous_response.append({"role": "user", "content": query})
    try:
        api = retrieveAPI()
        if api is None:
            return "API key not found. Please add your API key in settings."

        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api,
        )

        context_messages = [{"role": "system", "content": "You are an AI assistant."}]
        # set max_tokes for deepseekv3
        max_tokens = 64000
        token_count = count_token(context_messages[0]["content"], "deepseek-v3")
        # looping through the reponses backward for newest first
        # append to context only if the context_token doesnt exceeds max toke - 500(for user query)
        for response in reversed(previous_response):
            response_token = count_token(response["content"])
            if token_count + response_token > max_tokens - 500:
                break
            context_messages.append(response)
            token_count += response_token
        context_messages.append({"role": "user", "content": f"{query}"})
        completion = client.chat.completions.create(
            model="deepseek/deepseek-chat-v3-0324:free",
            messages=context_messages,
        )
        ai_response = str(completion.choices[0].message.content)
        previous_response.append({"role": "assistant", "content": ai_response})
        if len(previous_response) > 100:
            if len(previous_response) >= 2:
                previous_response.pop(0)
                previous_response.pop(0)
        return ai_response
    except Exception as e:
        print(f"AI response error: {e}")
        return f"Sorry, I can't help you at this time. Error: {str(e)}"
    
    
@eel.expose
def ai_response_voice(query):
    try:
        api = retrieveAPI()
        if api is None:
            return "API key not found. Please add your API key in settings."

        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api,
        )
        completion = client.chat.completions.create(
            model="deepseek/deepseek-chat-v3-0324:free",
            messages=[
            {
                "role": "user",
                "content": f"{query}"
            }
            ]
        )
        ai_response = str(completion.choices[0].message.content)
        return ai_response
    except Exception as e:
        print(f"AI response error: {e}")
        return f"Sorry, I can't help you at this time. Error: {str(e)}"    