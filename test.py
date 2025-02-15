from transformers import pipeline
pipe = pipeline("text2text-generation", model="facebook/blenderbot-400M-distill")

user_message = "Hello, how are you?"
