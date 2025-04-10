# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Knowledge base for the chatbot
knowledge_base = {
    "greetings": [
        "Hello! How can I assist you today?",
        "Hi there! What can I do for you?",
        "Greetings! How may I help you?"
    ],
    "farewell": [
        "Goodbye! Have a great day!",
        "Farewell! Until next time.",
        "See you later!"
    ],
    "capabilities": [
        "I can answer questions, provide information, and have conversations.",
        "My capabilities include chatting, answering queries, and assisting with various topics.",
        "I'm here to help with information and conversation."
    ],
    "default": [
        "I'm not sure I understand. Could you rephrase that?",
        "Interesting point. Could you elaborate?",
        "I'm still learning. Could you ask me something else?"
    ]
}

# Function to generate response
def generate_response(user_input):
    user_input = user_input.lower()
    
    if any(word in user_input for word in ["hello", "hi", "hey", "greetings"]):
        return random.choice(knowledge_base["greetings"])
    elif any(word in user_input for word in ["bye", "goodbye", "see you", "farewell"]):
        return random.choice(knowledge_base["farewell"])
    elif any(word in user_input for word in ["what can you do", "capabilities", "abilities", "help"]):
        return random.choice(knowledge_base["capabilities"])
    elif "time" in user_input:
        return f"The current time is {time.strftime('%H:%M:%S')}"
    elif "date" in user_input:
        return f"Today's date is {time.strftime('%Y-%m-%d')}"
    elif "your name" in user_input:
        return "I'm Jarvis, your personal assistant."
    elif "who made you" in user_input or "who created you" in user_input:
        return "I was created by a talented developer using Python and Flask."
    else:
        return random.choice(knowledge_base["default"])

# API endpoint for chatbot
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    # Simulate thinking delay
    time.sleep(random.uniform(0.1, 0.5))
    
    bot_response = generate_response(user_message)
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)