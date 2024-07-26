from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import mysql.connector
from mysql.connector import Error
import re

app = Flask(__name__)
CORS(app)

Tableschema = "TABLE employeedata (employee_id SERIAL PRIMARY KEY,first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL,gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),date_of_birth DATE NOT NULL,email VARCHAR(100) UNIQUE NOT NULL,phone_number VARCHAR(20),hire_date DATE NOT NULL,job_title VARCHAR(50) NOT NULL,department VARCHAR(50) NOT NULL,salary DECIMAL(10, 2) NOT NULL,address VARCHAR(255),city VARCHAR(50),state VARCHAR(50),postal_code VARCHAR(20),country VARCHAR(50))......this is the schema for my database table, can you generate me the sql query in single line for the statement : "

database_config = {
    "host": "roundhouse.proxy.rlwy.net",
    "port": 44347,
    "database": "railway",
    "user": "root",
    "password": "dxHtGTQnJaPXEeXiifplXAfHnbWbkYHr"
}

def run_query(query, params=None):
    conn = None
    cursor = None
    try:
        # Connect to the database
        conn = mysql.connector.connect(**database_config)
        if conn.is_connected():
            # Use a context manager to handle the cursor
            with conn.cursor(dictionary=True) as cursor:
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)

                if query.strip().upper().startswith("SELECT"):
                    results = cursor.fetchall()
                    return results
                else:
                    conn.commit()
                    return {"message": "Query executed successfully."}

    except Error as error:
        return {"error": str(error)}

    finally:
        # Ensure `conn` is not None before checking if it's connected
        if conn is not None and conn.is_connected():
            conn.close()

@app.route('/request_query', methods=['POST'])
def request_query():
    try:
        data = request.json
        requery = data.get('requery')
        if requery is None:
            raise ValueError('Request query is not mentioned in the request.')

        final = Tableschema + requery
        genai.configure(api_key="AIzaSyBDsnIJKr2YV--005hsm-yYikjy2bxCYvk")

        generation_config = {
            "temperature": 0.9,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 2048,
        }

        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
        ]

        model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                                      generation_config=generation_config,
                                      safety_settings=safety_settings)
        convo = model.start_chat(history=[])
        convo.send_message(final)
        datatext = convo.last.text

        # Clean the query
        clean_query = clean_sql_query(datatext)

        # Execute the query and get results
        query_results = run_query(clean_query)

        response = {
            'query': clean_query,
            'results': query_results
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)})

def clean_sql_query(query):
    # Remove any leading/trailing whitespace
    query = query.strip()

    # Remove any markdown code block indicators and quotation marks
    query = query.replace('```', '').replace('"""', '').replace("'''", "")

    # Remove any leading "SQL query:" or similar text
    query = re.sub(r'^(SQL query:?\s*)', '', query, flags=re.IGNORECASE)

    # Remove any comments
    query = re.sub(r'--.*$', '', query, flags=re.MULTILINE)
    query = re.sub(r'/\.?\*/', '', query, flags=re.DOTALL)
    query = re.sub(r'^SQL\s+', '', query, flags=re.IGNORECASE)

    # Replace multiple spaces with a single space
    query = re.sub(r'\s+', ' ', query)

    # Ensure the query ends with a semicolon
    if not query.strip().endswith(';'):
        query += ';'

    return query.strip()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)