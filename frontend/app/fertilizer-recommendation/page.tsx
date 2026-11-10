"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Recommendation {
  success: boolean;
  crop: string;
  recommended_fertilizer: string;
  similar_records: number;
  matching_crop_records: number;
  message: string;
}

interface SoilDetails {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  moisture: string;
  temperature: string;
  humidity: string;
  crop: string;
}

export default function FertilizerRecommendationPage() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );

  const [soilDetails, setSoilDetails] = useState<SoilDetails | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const recommendationData = sessionStorage.getItem(
        "fertilizerRecommendation",
      );

      const soilData = sessionStorage.getItem("soilDetails");

      if (recommendationData && soilData) {
        setRecommendation(JSON.parse(recommendationData));
        setSoilDetails(JSON.parse(soilData));
      }
    } catch (error) {
      console.error("Unable to load recommendation:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const inputClass =
    "flex justify-between gap-4 border-b border-gray-100 py-3 text-sm";

  // Illustrative UI value only. NOT an actual fertilizer dosage calculation.
  // The displayed value changes when the entered measurements change.
  const demoQuantity = soilDetails
    ? `${
        18 +
        (Math.round(
          Number(soilDetails.nitrogen) +
            Number(soilDetails.phosphorus) +
            Number(soilDetails.potassium) +
            Number(soilDetails.moisture) +
            Number(soilDetails.temperature) +
            Number(soilDetails.humidity),
        ) %
          5)
      } kg / acre`
    : "20 kg / acre";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
        <p className="text-lg font-semibold text-green-800">
          Loading your soil analysis results...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf7] text-gray-800">
      {/* Navbar */}

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
        {/* Heading */}

        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold uppercase tracking-widest text-green-700">
            Intelligent Agriculture
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-5xl">
            Fertilizer Recommendation
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            Your soil measurements have been processed by the Hem's AI
            recommendation engine.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          {/* No Recommendation */}

          {!recommendation || !soilDetails ? (
            <div className="rounded-3xl border border-yellow-200 bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">⚠️</div>

              <h2 className="mt-5 text-2xl font-bold text-gray-900">
                No Recommendation Found
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Please enter your soil nutrient values and crop information to
                generate a fertilizer recommendation.
              </p>

              <Link
                href="/npk-analysis"
                className="mt-8 inline-block rounded-full bg-green-700 px-8 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Enter Soil Details →
              </Link>
            </div>
          ) : (
            <>
              {/* Success Message */}

              <div className="rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm md:p-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                  🌱
                </div>

                <p className="mt-5 font-semibold uppercase tracking-widest text-green-700">
                  Analysis Completed
                </p>

                <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
                  Your Soil Analysis Results
                </h2>

                <p className="mt-3 text-gray-600">
                  Your fertilizer suggestion has been generated successfully.
                </p>
              </div>

              {/* Fertilizer Recommendation */}

              <div className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-8 text-center shadow-sm md:p-10">
                <p className="font-semibold uppercase tracking-widest text-green-700">
                  Recommended Fertilizer
                </p>

                <div className="mt-5 text-5xl">🧪</div>

                <h2 className="mt-4 text-3xl font-bold text-green-900 md:text-4xl">
                  {recommendation.recommended_fertilizer}
                </h2>

                <p className="mt-4 text-gray-700">
                  Selected Crop: <strong>{recommendation.crop}</strong>
                </p>

                <div className="mx-auto mt-7 grid max-w-lg grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-sm text-gray-500">Similar Records</p>
                    <p className="mt-2 text-2xl font-bold text-green-800">
                      {recommendation.similar_records}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-sm text-gray-500">Crop Matches</p>
                    <p className="mt-2 text-2xl font-bold text-green-800">
                      {recommendation.matching_crop_records}
                    </p>
                  </div>
                </div>
              </div>

              {/* Soil Nutrient Information */}

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔬</span>

                  <h3 className="text-xl font-bold text-gray-900">
                    Soil Nutrient Analysis
                  </h3>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Values entered from your soil test report.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-green-50 p-5 text-center">
                    <p className="font-medium text-gray-600">Nitrogen (N)</p>
                    <p className="mt-2 text-2xl font-bold text-green-800">
                      {soilDetails.nitrogen}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-5 text-center">
                    <p className="font-medium text-gray-600">Phosphorus (P)</p>
                    <p className="mt-2 text-2xl font-bold text-green-800">
                      {soilDetails.phosphorus}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-5 text-center">
                    <p className="font-medium text-gray-600">Potassium (K)</p>
                    <p className="mt-2 text-2xl font-bold text-green-800">
                      {soilDetails.potassium}
                    </p>
                  </div>
                </div>
              </div>

              {/* Environmental Information */}

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌡️</span>

                  <h3 className="text-xl font-bold text-gray-900">
                    Soil Environmental Conditions
                  </h3>
                </div>

                <div className="mt-5 space-y-1">
                  <div className={inputClass}>
                    <span className="text-gray-500">Soil Moisture</span>
                    <strong>{soilDetails.moisture}%</strong>
                  </div>

                  <div className={inputClass}>
                    <span className="text-gray-500">Temperature</span>
                    <strong>{soilDetails.temperature} °C</strong>
                  </div>

                  <div className={inputClass}>
                    <span className="text-gray-500">Humidity</span>
                    <strong>{soilDetails.humidity}%</strong>
                  </div>

                  <div className={inputClass}>
                    <span className="text-gray-500">Selected Crop</span>
                    <strong>{soilDetails.crop}</strong>
                  </div>
                </div>
              </div>

              {/* Fertilizer Quantity Display */}

              <div className="mt-8 overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-green-50 shadow-sm">
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                      🤖
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-purple-700">
                        Hem's AI Assistant
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-purple-950 md:text-2xl">
                        Illustrative Fertilizer Quantity
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 leading-7 text-gray-700">
                    The displayed value changes with your entered measurements
                    for project demonstration.
                  </p>

                  <div className="mt-7 rounded-2xl border border-purple-200 bg-white p-7 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Illustrative Demo Output
                    </p>

                    <h2 className="mt-4 text-4xl font-extrabold text-purple-800 md:text-5xl">
                      {demoQuantity}
                    </h2>

                    <span className="mt-4 inline-block rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold text-yellow-800">
                      SIMULATED VALUE — NOT FOR FARM USE
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-purple-100 p-6">
                    <h4 className="font-bold text-purple-950">
                      Analysis Summary
                    </h4>

                    <div className="mt-4 space-y-3 text-sm text-purple-950">
                      <div className="flex justify-between gap-4">
                        <span>Selected Crop</span>
                        <strong>{recommendation.crop}</strong>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>Recommended Fertilizer</span>
                        <strong>{recommendation.recommended_fertilizer}</strong>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>Nitrogen</span>
                        <strong>{soilDetails.nitrogen}</strong>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>Phosphorus</span>
                        <strong>{soilDetails.phosphorus}</strong>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>Potassium</span>
                        <strong>{soilDetails.potassium}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Agricultural Disclaimer */}

              <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-6">
                <h3 className="font-bold text-orange-900">
                  Important Agricultural Disclaimer
                </h3>

                <p className="mt-3 text-sm leading-7 text-orange-900">
                  The displayed quantity is a simulated project value that
                  changes with the entered measurements. It is not calculated
                  using validated agronomic dosage rules and must not be used
                  for actual fertilizer application. Actual quantities must be
                  determined from a valid soil test and crop-specific
                  recommendations from Tamil Nadu agricultural authorities or a
                  qualified agricultural expert.
                </p>
              </div>
            </>
          )}

          {/* Navigation */}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/soil-analysis"
              className="rounded-full border border-green-700 px-7 py-3 font-semibold text-green-800 transition hover:bg-green-50"
            >
              ← Soil Image Analysis
            </Link>

            <Link
              href="/npk-analysis"
              className="rounded-full bg-green-700 px-7 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Analyze Again →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t border-gray-200 bg-white px-6 py-6 text-center text-sm text-gray-500">
        © 2026 Hem's AI. Intelligent Soil Analysis & Fertilizer Recommendation.
      </footer>
    </main>
  );
}
