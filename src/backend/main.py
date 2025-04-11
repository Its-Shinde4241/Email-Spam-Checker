from fastapi.responses import RedirectResponse
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pickle
import os

app = FastAPI()

# 🔓 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔁 Load model and vectorizer
BASE_DIR = os.path.dirname(__file__)

with open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)

with open(os.path.join(BASE_DIR, "model.pkl"), "rb") as f:
    model = pickle.load(f)


# ✅ Your predict API — keep it separate from frontend
@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    message = data.get("message")
    if not message:
        return {"error": "No message provided"}

    vector = vectorizer.transform([message])
    prediction = model.predict(vector)[0]
    probabilities = model.predict_proba(vector)[0]
    confidence = probabilities[prediction] * 100

    return {
        "prediction": "spam" if prediction == 1 else "not spam",
        "confidence": f"{confidence:.2f}%"
    }

# 🔁 Redirect root to frontend

@app.get("/")
async def root():
    return RedirectResponse("/index.html")

# ✅ Serve static frontend
frontend_path = os.path.join(os.path.dirname(__file__), "..", "Frontend", "dist")

app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
