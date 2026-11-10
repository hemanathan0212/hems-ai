"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PredictionResult {
  success: boolean;
  filename: string;
  predicted_soil: string;
  confidence: number;
}

export default function SoilAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Generate image preview
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [file]);

  // Select image
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setResult(null);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image size must be below 10 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  // Connect to FastAPI soil prediction endpoint
  async function handleAnalyze() {
    if (!file) {
      setError("Please select a soil image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/predict-soil`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Soil analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the backend.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Remove selected image
  function removeImage() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#f5f8ef] px-6 py-10">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-green-800">
          Hem's <span className="text-green-600">AI</span>
        </Link>

        <Link
          href="/"
          className="font-medium text-green-800 hover:text-green-600"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Heading */}
      <section className="mx-auto mt-16 max-w-3xl text-center">
        <p className="font-bold uppercase tracking-widest text-green-700">
          Computer Vision
        </p>

        <h1 className="mt-4 text-4xl font-extrabold text-gray-900">
          Soil Image Analysis
        </h1>

        <p className="mt-5 leading-8 text-gray-600">
          Upload a soil photograph and let our trained AI model identify its
          visual soil classification.
        </p>
      </section>

      {/* Upload Card */}
      <section className="mx-auto mt-12 max-w-2xl rounded-3xl border border-green-100 bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="text-5xl">🌱</div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Upload Your Soil Image
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            Supported formats: JPG, PNG, WEBP · Maximum 10 MB
          </p>
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mt-8">
            <img
              src={preview}
              alt="Selected soil"
              className="mx-auto max-h-72 w-full rounded-2xl object-contain"
            />

            <p className="mt-3 text-center text-sm text-gray-600">
              {file?.name}
            </p>

            <button
              onClick={removeImage}
              className="mt-3 w-full text-sm font-semibold text-red-600 hover:text-red-800"
            >
              Remove Image ✕
            </button>
          </div>
        )}

        {/* File Input */}
        <div className="mt-8">
          <label
            htmlFor="soil-image"
            className="block cursor-pointer rounded-2xl border-2 border-dashed border-green-300 bg-green-50 px-6 py-8 text-center transition hover:bg-green-100"
          >
            <span className="text-3xl">📁</span>

            <p className="mt-3 font-semibold text-green-800">
              Choose Soil Image
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Click here to browse your files
            </p>
          </label>

          <input
            id="soil-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="mt-8 w-full rounded-xl bg-green-700 px-6 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Analyzing Soil..." : "Analyze Soil Image →"}
        </button>

        {/* Prediction Result */}
        {result && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
            <p className="font-bold uppercase tracking-wider text-green-700">
              Analysis Completed
            </p>

            <h3 className="mt-4 text-2xl font-extrabold text-gray-900">
              {result.predicted_soil.replaceAll("_", " ")}
            </h3>

            <p className="mt-3 text-gray-700">
              Model Confidence:{" "}
              <span className="font-bold text-green-800">
                {result.confidence.toFixed(2)}%
              </span>
            </p>

            <p className="mt-4 text-sm text-gray-600">
              Your soil image has been classified successfully. Confidence
              indicates the model's prediction score, not a guarantee of
              classification accuracy.
            </p>
          </div>
        )}
      </section>

      {/* Important Information */}
      <section className="mx-auto mt-10 max-w-2xl rounded-2xl bg-yellow-50 p-6">
        <h3 className="font-bold text-yellow-900">Important Information</h3>

        <p className="mt-3 text-sm leading-7 text-yellow-800">
          Soil photographs can help identify visual soil categories. They cannot
          determine nitrogen, phosphorus or potassium concentrations. Use a
          laboratory soil test for accurate nutrient measurements.
        </p>
      </section>
    </main>
  );
}
