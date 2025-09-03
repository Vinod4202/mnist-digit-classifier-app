from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from PIL import Image

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = tf.keras.models.load_model("mnist_model.h5")


@app.post("/predict")
async def predict(file: UploadFile):
    img = Image.open(file.file).convert("L").resize((28, 28))
    arr = 255 - np.array(img)
    arr = arr.reshape(1, 28, 28, 1) / 255.0
    probs = model.predict(arr)[0]
    predicted_class = np.argmax(probs)
    confidence = probs[predicted_class]
    return {"prediction": int(predicted_class), "confidence": float(confidence)}
