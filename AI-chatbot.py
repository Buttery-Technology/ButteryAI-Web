import time
import random
import json
import uuid
from datetime import datetime


FAKE_RESPONSES = []      
CURRENT_CHAT = None       


# Simulate POST /chats
def post_new_chat():
    """Starts a new chat and returns success response"""
    global CURRENT_CHAT
    chat_id = str(uuid.uuid4())
    timestamp = datetime.now().isoformat()

    # Create chat structure
    CURRENT_CHAT = {
        "id": chat_id,
        "lastModified": timestamp,
        "snippet": "",
        "messages": []
    }

    return {
        "timestamp": timestamp,
        "isCreated": True
    }


# Simulate POST /chats/{ID}
def post_message_to_chat(chat_id, value):
    """Adds a new message to the current chat"""
    global CURRENT_CHAT
    if not CURRENT_CHAT or CURRENT_CHAT["id"] != chat_id:
        return None

    timestamp = datetime.now().isoformat()

    # Create message structure
    message = {
        "timestamp": timestamp,
        "value": value,
        "id": str(uuid.uuid4()),
        "isCompleted": True,
        "originatorID": "mock-user-id",
        "originatorType": "USER" if len(CURRENT_CHAT["messages"]) % 2 == 0 else "SYSTEM"
    }

    # Update chat state
    CURRENT_CHAT["messages"].append(message)
    CURRENT_CHAT["lastModified"] = timestamp
    CURRENT_CHAT["snippet"] = value[:30]

    return message

# Simulate GET /chats
def get_current_chat():
    """Returns the current chat session"""
    return {
        "timestamp": datetime.now().isoformat(),
        "currentChat": CURRENT_CHAT
    }

def typewriter(text: str):
    """Prints text character by character with delay"""
    for char in text:
        print(char, end='', flush=True)
        time.sleep(random.uniform(0.05, 0.15))
    print()

def fake_ai_chat(user_input):
    print("AI is thinking", end="")
    for _ in range(3):
        time.sleep(.2)
        print("🧈", end="", flush=True)
    print()

    # Add user's message
    post_message_to_chat(CURRENT_CHAT["id"], user_input)

    response = random.choice(FAKE_RESPONSES)

    # Add AI message
    post_message_to_chat(CURRENT_CHAT["id"], response)

    typewriter(response)



if __name__ == "__main__":
    try:
        with open("fakeResponse.json", "r") as file:
            data = json.load(file)
            FAKE_RESPONSES = data.get("responses", [])
    except FileNotFoundError:
        print("Error: fakeResponse.json not found.")
        exit(1)

    if not FAKE_RESPONSES:
        print("Error: No fake responses found.")
        exit(1)

    # Start a new chat
    new_chat_response = post_new_chat()
    if new_chat_response["isCreated"]:
        print("New chat started.")

    # Chat loop
    while True:
        user_input = input("You: ")
        if user_input.lower() in {"exit", "quit", "e", "q"}:
            print("Ending chat.")
            break
        fake_ai_chat(user_input)

    # Show full chat history
    print("\nFull Chat History:")
    chat_data = get_current_chat()
    for msg in chat_data["currentChat"]["messages"]:
        speaker = "You" if msg["originatorType"] == "USER" else "AI"
        print(f"{speaker} [{msg['timestamp']}]: {msg['value']}")
