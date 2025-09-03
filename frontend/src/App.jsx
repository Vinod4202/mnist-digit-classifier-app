import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import {Loader2} from "lucide-react"

function App() {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = "https://mnist-backend-mc7o.onrender.com";

  // Clear canvas
  const clearCanvas = () => {
    canvasRef.current.clearCanvas();
    setPrediction(null);
  };


  // Send drawing to backend
  const handlePredict = async () => {
    setLoading(true);
    const dataUrl = await canvasRef.current.exportImage("png");

    const resBlob = await fetch(dataUrl).then((r) => r.blob());


    const formData = new FormData();
    formData.append("file", resBlob, "digit.png");

    const res = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    const data = await res.json();
    setPrediction(data.prediction);
    setConfidence(data.confidence);
  
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6"> MNIST Digit Classifier</h1>

      {/* Canvas */}
      <ReactSketchCanvas
        ref={canvasRef}
        width="280px"
        height="280px"
        strokeWidth={25}
        strokeColor="black"
        className="border-2 border-gray-400 bg-white rounded-lg shadow-lg"
      />

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Clear
        </button>
        <button
          onClick={handlePredict}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          disabled={loading}
        >
          {
            loading ? (<><Loader2 className="animate-spin" />Loading...</>) : "Predict"
          }
        </button>
      </div>

      {/* Prediction Result */}
      {prediction !== null && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-lg text-xl">
          Predicted Digit: <span className="font-bold">{prediction}</span>
          <br />
          Confidence: <span className="font-bold">{(confidence * 100).toFixed(2)}%</span>
        </div>
      )}
    </div>
  )
}

export default App
