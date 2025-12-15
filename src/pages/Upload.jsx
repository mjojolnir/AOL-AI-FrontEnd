import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Upload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setSelectedImage(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleDiagnose = async () => {
    if (!selectedImage) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Redirect ke Results
      navigate("/results", {
        state: {
          imageURL: previewURL,
          prediction: data.prediction,
          probability: data.probability,
        },
      });
    } catch (err) {
      alert("Failed to send image to server. Is your backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101A2C] to-[#0F2238] text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-6">Upload Chest X-Ray</h1>

      {/* Back Button */}
      <Link
        to="/"
        className="
        mb-6
        px-5 py-2 
        rounded-xl 
        bg-white/10 
        text-gray-200 
        hover:bg-white/20 
        transition-all
        border border-white/20
      "
      >
        ← Back to Homepage
      </Link>

      <label
        className="
          w-[480px] h-[260px]
          border-2 border-dashed border-gray-500
          rounded-2xl flex flex-col items-center justify-center
          cursor-pointer hover:border-gray-300 transition
          bg-white/5
        "
      >
        <span className="text-gray-300 mb-2">
          Click to upload or drag file here
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {previewURL && (
        <div className="mt-6">
          <img
            src={previewURL}
            alt="Preview"
            className="max-w-[450px] rounded-xl shadow-xl"
          />
        </div>
      )}

      {/* Diagnose Button */}
      <button
        onClick={handleDiagnose}
        disabled={!selectedImage || loading}
        className={`mt-6 px-8 py-3 rounded-xl font-semibold transition-all
          ${
            !selectedImage || loading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:opacity-90"
          }
        `}
      >
        {loading ? "Analyzing..." : "Diagnose X-ray"}
      </button>
    </div>
  );
}
