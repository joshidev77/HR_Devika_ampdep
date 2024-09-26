from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyDu3noOAGc6qsOZPUQwI4BqLqshOeM8Nsc")

generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(model_name="gemini-1.0-pro", generation_config=generation_config, safety_settings=safety_settings)

interview_history = []
question_count = 0
user_name = ""

@app.route('/interview', methods=['POST'])
def interview():
    global interview_history, question_count, user_name
    try:
        data = request.json
        candidate_input = data.get('candidate_input', '')
        restart = data.get('restart', False)

        if restart:
            interview_history = []
            question_count = 0
            user_name = ""

        if not interview_history:
            # Start of the interview
            hr_response = '<div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert"><p class="font-bold">Welcome to the interview!</p><p>Could you please tell me your name?</p></div>'
        elif not user_name:
            # Extract name from the introduction
            extracted_name = extract_name(candidate_input)
            if extracted_name:
                user_name = extracted_name
                hr_response = f'<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p class="font-bold">Nice to meet you, {user_name}!</p><p>Let\'s start our conversation. Could you tell me a bit about your family?</p></div>'
            else:
                hr_response = '<div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert"><p class="font-bold">I\'m sorry, I couldn\'t catch your name.</p><p>Could you please introduce yourself again, clearly stating your name?</p></div>'
        elif candidate_input.lower() == "i want to end the interview":
            # End of interview
            hr_response = generate_final_review()
            is_final_review = True
        else:
            # Continue the interview
            hr_response = generate_next_question(candidate_input)
            question_count += 1

        interview_history.append(f"Candidate: {candidate_input}\n\nHR: {hr_response}\n\n")

        return jsonify({
            'hr_response': hr_response,
            'is_final_review': 'i want to end the interview' in candidate_input.lower(),
            'question_count': question_count
        })
    except Exception as e:
        return jsonify({'error': str(e)})

def extract_name(input_text):
    prompt = f"""
    Extract the name from the following introduction: {input_text}
    Return the result in the format: "Name: [name]"
    If you can't identify, return: "Incomplete".
    """
    convo = model.start_chat(history=[])
    response = convo.send_message(prompt)
    result = response.text.strip()

    if result != "Incomplete":
        name = result.split("Name:")[1].strip()
        return name

    return None

def generate_next_question(candidate_input):
    prompt = f"""
    You are a friendly interviewer having a casual conversation. Here's the conversation history so far: {"".join(interview_history)}
    The person's latest response is: {candidate_input}
    Based on this response and the conversation history, ask a short, friendly follow-up question. Focus on personal topics like family, friends, hobbies, or interesting life experiences. Avoid professional or technical questions.
    Format the response in HTML with Tailwind CSS classes for a warm and inviting look. Use a div with appropriate background color, border, and text color classes.
    """
    convo = model.start_chat(history=[])
    response = convo.send_message(prompt)
    return response.text.strip()

def generate_final_review():
    prompt = f"""
    You are a friendly interviewer. Here's the complete conversation history: {"".join(interview_history)}
    Please provide a short, warm summary of the conversation with {user_name}, including:
    1. A brief recap of the interesting things you learned about {user_name}
    2. A couple of positive observations about {user_name}'s personality or experiences
    3. A friendly closing remark
    Format the response in HTML with Tailwind CSS classes for a warm and inviting look. Use separate divs with appropriate background color, border, and text color classes for each section.
    """
    convo = model.start_chat(history=[])
    response = convo.send_message(prompt)
    return response.text.strip()

if __name__ == '__main__':
    app.run(debug=True)
