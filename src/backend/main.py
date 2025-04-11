from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pickle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load vectorizer and model once
with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    message = data.get("message")

    if not message:
        return {"error": "No message provided"}

    # Vectorize the input message
    vector = vectorizer.transform([message])

    # Predict class and probability
    prediction = model.predict(vector)[0]
    probabilities = model.predict_proba(vector)[0]

    # Get confidence percentage for the predicted class
    confidence = probabilities[prediction] * 100

    return {
        "prediction": "spam" if prediction == 1 else "not spam",
        "confidence": f"{confidence:.2f}%"
    }
