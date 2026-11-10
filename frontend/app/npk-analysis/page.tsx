"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NPKAnalysisPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    moisture: "",
    temperature: "",
    humidity: "",
    crop: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recommend-fertilizer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nitrogen: Number(formData.nitrogen),
            phosphorus: Number(formData.phosphorus),
            potassium: Number(formData.potassium),
            moisture: Number(formData.moisture),
            temperature: Number(formData.temperature),
            humidity: Number(formData.humidity),
            crop: formData.crop,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Recommendation failed.");
      }

      // Save recommendation for the results page
      sessionStorage.setItem("fertilizerRecommendation", JSON.stringify(data));

      // Save submitted soil details
      sessionStorage.setItem("soilDetails", JSON.stringify(formData));

      router.push("/fertilizer-recommendation");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <main className="min-h-screen bg-[#f7faf7] text-gray-800">
      <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 md:px-16">
        <Link href="/" className="text-2xl font-bold text-green-800">
          Hem's AI
        </Link>

        <Link
          href="/"
          className="font-medium text-gray-600 transition hover:text-green-700"
        >
          ← Back to Home
        </Link>
      </nav>

      <section className="px-6 py-12 md:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-green-700">
            Soil Nutrient Assessment
          </p>

          <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
            NPK & Soil Analysis
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            Enter your soil test measurements and select the crop you want to
            cultivate.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10"
        >
          {/* NPK */}
          <div className="mb-10">
            <h2 className="mb-2 text-2xl font-bold text-green-800">
              01. Soil Nutrient Values
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Enter the values from your soil test report.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { name: "nitrogen", label: "Nitrogen (N)" },
                { name: "phosphorus", label: "Phosphorus (P)" },
                { name: "potassium", label: "Potassium (K)" },
              ].map((item) => (
                <div key={item.name}>
                  <label className="mb-2 block font-semibold">
                    {item.label}
                  </label>

                  <input
                    type="number"
                    name={item.name}
                    value={formData[item.name as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder="Enter value"
                    min="0"
                    step="any"
                    required
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Soil conditions */}
          <div className="mb-10">
            <h2 className="mb-2 text-2xl font-bold text-green-800">
              02. Soil Conditions
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Enter the available environmental measurements.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "moisture",
                  label: "Soil Moisture (%)",
                  min: "0",
                  max: "100",
                },
                {
                  name: "temperature",
                  label: "Temperature (°C)",
                },
                {
                  name: "humidity",
                  label: "Humidity (%)",
                  min: "0",
                  max: "100",
                },
              ].map((item) => (
                <div key={item.name}>
                  <label className="mb-2 block font-semibold">
                    {item.label}
                  </label>

                  <input
                    type="number"
                    name={item.name}
                    value={formData[item.name as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder="Enter value"
                    min={item.min}
                    max={item.max}
                    step="any"
                    required
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Crop */}
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-green-800">
              03. Crop Selection
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Select the crop you plan to cultivate.
            </p>

            <label className="mb-2 block font-semibold">Select Crop</label>

            <select
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Choose a crop</option>
              <option value="Barley">Barley</option>
              <option value="Cotton">Cotton</option>
              <option value="Ground Nuts">Ground Nuts</option>
              <option value="Maize">Maize</option>
              <option value="Millets">Millets</option>
              <option value="Oil seeds">Oil Seeds</option>
              <option value="Paddy">Paddy</option>
              <option value="Pulses">Pulses</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Tobacco">Tobacco</option>
              <option value="Wheat">Wheat</option>
            </select>
          </div>

          {/* Information */}
          <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm leading-6 text-green-900">
              <strong>Note:</strong> Enter NPK values using a soil test report.
              Soil photographs cannot directly measure nitrogen, phosphorus or
              potassium.
            </p>
          </div>

          {/* Error */}
          {message && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-700 px-6 py-4 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Generating Recommendation..."
              : "Get Fertilizer Recommendation →"}
          </button>
        </form>
      </section>

      <footer className="border-t border-gray-200 bg-white px-6 py-6 text-center text-sm text-gray-500">
        © 2026 Hem's AI. Intelligent Soil Analysis & Fertilizer Recommendation.
      </footer>
    </main>
  );
}
