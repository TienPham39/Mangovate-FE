import { useState, useRef } from "react";
import axios from "axios";
import { Upload, ImageUp, CircleCheckBig, TriangleAlert } from "lucide-react";

const MangoClassifier = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setError("");
      setResult(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a photo before predicting");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/predicted/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 10000,
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(
        "Could not connect to API or there was an error processing the image. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getClassText = (className) => {
    switch (className) {
      case "Unripe":
        return "Unripe";
      case "Partially Ripe":
        return "Partially Ripe";
      case "Ripe":
        return "Ripe";
      case "Disease":
        return "Disease";
      default:
        return className;
    }
  };

  const getClassColor = (className) => {
    switch (className) {
      case "Unripe":
        return "bg-lime-600";
      case "Partially Ripe":
        return "bg-yellow-500";
      case "Ripe":
        return "bg-orange-500";
      case "Disease":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  const getRecommendation = (className) => {
    switch (className) {
      case "Unripe":
        return "Mango is not yet ripe – store in a cool area for 2–3 days before drying to enhance flavor.";
      case "Partially Ripe":
        return "Partially ripe mango – suitable for pre-processing but should be sorted again before drying.";
      case "Ripe":
        return "Ripe mango – ready for slicing and drying. Recommended to process within 24h for best quality.";
      case "Disease":
        return "Mangoes showing signs of disease – should be removed immediately to avoid affecting the entire production process.";
      default:
        return "Unknown result. Please recheck the image or handle manually.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-6 font-nunito">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-6 mb-8">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full blur-3xl"></div>
            </div>

            {/* Main title */}
            <div className="relative z-10 space-y-4">
              <h1 className="mb-1 text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent leading-tight antialiased">
                Classifying Mango
                <br />
                <span className="text-3xl md:text-5xl">Maturity Stages</span>
              </h1>

              <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-gray-600">
                <span className="font-medium">
                  Based on Physiological Features
                </span>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
                  <span className="text-sm font-medium text-green-700">
                    🤖 AI Powered
                  </span>
                </div>
                <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-yellow-200 shadow-sm">
                  <span className="text-sm font-medium text-yellow-700">
                    ⚡ Real-time
                  </span>
                </div>
                <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 shadow-sm">
                  <span className="text-sm font-medium text-orange-700">
                    🎯 High Accuracy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Upload /> Upload Mango Image
            </h2>

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                dragActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg shadow"
                  />
                  <p className="text-sm text-gray-600 break-words">
                    {file?.name}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm text-gray-700 border px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Select another image
                  </button>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col items-center text-gray-600">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full shadow-inner">
                    <ImageUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    Drag and drop image here
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to select a file from your device
                  </p>
                  <p className="text-xs italic text-gray-400">
                    Supported: JPG, PNG, GIF (max 10MB)
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className={`w-full py-3 font-medium rounded-md text-white transition ${
                loading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {loading ? "Analyzing..." : "Predict Maturity"}
            </button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm mt-2">
                <TriangleAlert className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 mb-4">
              <CircleCheckBig /> Predicted Results
            </h2>

            {loading ? (
              <p className="text-center text-gray-500">Processing image...</p>
            ) : result ? (
              <div className="space-y-6">
                {/* Classification */}
                <div className="text-center space-y-3">
                  {result.annotated_image && (
                    <img
                      src={`data:image/png;base64,${result.annotated_image}`}
                      alt="Predicted results"
                      className="mx-auto rounded-lg border border-gray-200 shadow-md max-h-64"
                    />
                  )}
                  <div
                    className={`inline-block px-4 py-2 ${getClassColor(
                      result.predicted_class
                    )} text-white rounded-full font-medium text-lg`}
                  >
                    {getClassText(result.predicted_class)}
                  </div>
                </div>

                {/* Confidence */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getClassColor(
                        result.predicted_class
                      )} h-3 rounded-full transition-all`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <p className="text-right text-sm font-semibold text-gray-700 mt-1">
                    {(result.confidence).toFixed(1)}%
                  </p>
                </div>

                {/* Recommendation - Compact Design */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-400 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">
                        💡
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                        Recommended Action:
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {getRecommendation(result.predicted_class)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button - Fixed at bottom */}
                <div className="pt-2">
                  <button
                    onClick={resetForm}
                    className="w-full px-6 py-3 text-gray-700 font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Analyze another image
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 space-y-2">
                <ImageUp className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-lg font-medium">No results yet</p>
                <p className="text-sm">Upload mango image to start analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangoClassifier;
