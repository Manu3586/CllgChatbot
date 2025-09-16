from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# Load FAQs from data.json
with open("cllg_info.json") as f:
    faq_data = json.load(f)

@app.route("/")
def home():
    return render_template("index.html")  # frontend UI

@app.route("/chat", methods=["POST"])
def chat():
    user_query = request.json.get("query", "").lower()   # get user input

    # Find best match
    for key, answer in faq_data.items():
        if key in user_query:
            return jsonify({"response": answer})

    return jsonify({"response": "Sorry, I don’t know about that. Please contact admin office."})

if __name__ == "__main__":
    app.run(debug=True)
