"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#071b12] text-white">
      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">
          <Image
            src="/farm.hero.jpg"
            alt="Green rice fields in morning sunlight"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/30" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* NAVBAR */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-7 md:px-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl">🌿</span>
            <span className="text-3xl font-extrabold">
              Hem's <span className="text-green-400">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 text-sm font-semibold md:flex">
            <Link
              href="/"
              className="border-b-2 border-green-400 pb-2 text-green-400"
            >
              Home
            </Link>
            <Link href="#features" className="hover:text-green-400">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-green-400">
              How It Works
            </Link>
            <Link href="#about" className="hover:text-green-400">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <Link
              href="/soil-analysis"
              className="hidden rounded-full bg-green-400 px-6 py-3 font-bold text-green-950 transition hover:bg-green-300 sm:block"
            >
              Get Started →
            </Link>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto grid min-h-[78vh] max-w-[1500px] items-center gap-10 px-6 pb-16 pt-10 md:grid-cols-2 md:px-12">
          {/* LEFT CONTENT */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-green-400/40 bg-green-900/40 px-5 py-3 text-sm font-semibold text-green-300 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              AI-POWERED SMART AGRICULTURE
            </div>

            <h2 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
              AI-Based Fertilizer
              <br />
              Recommendation
              <br />
              <span className="text-green-400">System</span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-100">
              An intelligent agricultural system that combines AI-based soil
              image classification, soil nutrient analysis and fertilizer
              insights to support informed farming decisions.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                href="/soil-analysis"
                className="rounded-full bg-green-400 px-8 py-4 font-bold text-green-950 shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-300"
              >
                🌱 Analyze Soil →
              </Link>

              <Link
                href="#how-it-works"
                className="rounded-full border border-white/60 bg-white/10 px-8 py-4 font-bold backdrop-blur-md transition hover:bg-white/20"
              >
                Explore Project
              </Link>
            </div>

            {/* FEATURE HIGHLIGHTS */}
            <div className="mt-16 flex flex-wrap gap-8">
              <div>
                <span className="text-3xl">🌱</span>
                <p className="mt-2 font-semibold">Soil Classification</p>
              </div>

              <div className="border-l border-white/30 pl-7">
                <span className="text-3xl">🧪</span>
                <p className="mt-2 font-semibold">NPK Analysis</p>
              </div>

              <div className="border-l border-white/30 pl-7">
                <span className="text-3xl">🤖</span>
                <p className="mt-2 font-semibold">Fertilizer Insights</p>
              </div>
            </div>
          </div>

          {/* RIGHT FLOATING AI PANELS */}
          <div className="relative hidden h-[550px] md:block">
            {/* SOIL HEALTH */}
            <div className="soil-card soil-card-one absolute right-5 top-12 w-64 rounded-2xl border border-green-300/50 bg-green-950/65 p-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🌿</span>
                <div>
                  <p className="text-sm text-green-200">Soil Health</p>
                  <h3 className="text-3xl font-bold">92%</h3>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[92%] rounded-full bg-green-400" />
              </div>

              <p className="mt-3 text-xs text-green-200">
                Illustrative interface value
              </p>
            </div>

            {/* PH LEVEL */}
            <div className="soil-card soil-card-two absolute left-0 top-48 w-60 rounded-2xl border border-cyan-300/50 bg-green-950/65 p-6 shadow-[0_0_40px_rgba(34,211,238,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="text-4xl">💧</span>
                <div>
                  <p className="text-sm text-cyan-200">pH Level</p>
                  <h3 className="text-3xl font-bold">6.8</h3>
                </div>
              </div>

              <div className="mt-5 h-2 rounded-full bg-white/20">
                <div className="h-full w-[68%] rounded-full bg-cyan-300" />
              </div>

              <p className="mt-3 text-xs text-cyan-200">
                Illustrative interface value
              </p>
            </div>

            {/* NPK PANEL */}
            <div className="soil-card soil-card-three absolute bottom-10 right-0 w-64 rounded-2xl border border-green-300/50 bg-green-950/65 p-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🧪</span>
                <div>
                  <p className="text-sm text-green-200">Soil Nutrients</p>
                  <h3 className="text-2xl font-bold">N · P · K</h3>
                </div>
              </div>

              <div className="mt-5 flex h-12 items-end gap-2">
                {[30, 55, 40, 75, 60, 90, 100].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t bg-green-400"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <p className="mt-3 text-xs text-green-200">
                Nutrient visualization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#f3f8f0] px-6 py-24 text-gray-900">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-bold uppercase tracking-widest text-green-600">
            Project Features
          </p>

          <h2 className="mt-4 text-4xl font-extrabold">
            Intelligent Agriculture Solutions
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            Explore AI-powered tools for soil classification, nutrient analysis
            and experimental fertilizer suggestions.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🌱",
                title: "Soil Image Classification",
                description:
                  "Classify soil images using an AI-based deep learning model.",
                link: "/soil-analysis",
              },
              {
                icon: "🧪",
                title: "Soil NPK Analysis",
                description:
                  "Enter soil nutrient and environmental measurements.",
                link: "/npk-analysis",
              },
              {
                icon: "🤖",
                title: "Fertilizer Recommendation",
                description:
                  "Explore experimental fertilizer suggestions using dataset records.",
                link: "/fertilizer-recommendation",
              },
            ].map((item) => (
              <Link
                href={item.link}
                key={item.title}
                className="rounded-3xl border border-green-100 bg-white p-9 text-left shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <span className="text-5xl">{item.icon}</span>
                <h3 className="mt-6 text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 leading-7 text-gray-600">
                  {item.description}
                </p>
                <p className="mt-6 font-bold text-green-600">Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#0b2115] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-bold uppercase tracking-widest text-green-400">
            Workflow
          </p>

          <h2 className="mt-4 text-4xl font-extrabold">How Hem's AI Works</h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-300">
            Three simple stages to explore soil information and fertilizer
            insights.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              [
                "01",
                "Upload Soil Image",
                "Upload an image for AI-based soil classification.",
              ],
              [
                "02",
                "Enter Soil Details",
                "Provide NPK values and available soil conditions.",
              ],
              [
                "03",
                "View Recommendations",
                "Explore soil analysis results and experimental fertilizer suggestions.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-2xl border border-green-800 bg-green-900/30 p-8"
              >
                <p className="text-4xl font-extrabold text-green-400">
                  {number}
                </p>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-gray-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="bg-[#f3f8f0] px-6 py-20 text-center text-gray-900"
      >
        <p className="font-bold uppercase tracking-widest text-green-600">
          About the Project
        </p>

        <h2 className="mt-4 text-4xl font-extrabold">Hem's AI</h2>

        <h3 className="mt-3 text-xl font-semibold text-green-700">
          AI-Based Fertilizer Recommendation System
        </h3>

        <p className="mx-auto mt-6 max-w-3xl leading-8 text-gray-600">
          Hem's AI is an AI-based agricultural project that combines soil image
          classification, soil nutrient analysis and dataset-based fertilizer
          insights to explore smarter agricultural technologies and support
          informed farming decisions.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#06170e] px-6 py-8 text-center text-gray-300">
        <p className="font-semibold">
          Hem's AI – AI-Based Fertilizer Recommendation System
        </p>
        <p className="mt-2 text-sm text-gray-400">
          © 2026 Hem's AI. All Rights Reserved.
        </p>
      </footer>

      {/* FLOATING ANIMATIONS */}
      <style jsx global>{`
        @keyframes floatBox {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-20px);
          }
        }

        .soil-card {
          animation: floatBox 4s ease-in-out infinite;
          will-change: transform;
        }

        .soil-card-one {
          animation-delay: 0s;
        }

        .soil-card-two {
          animation-delay: 1s;
          animation-duration: 5s;
        }

        .soil-card-three {
          animation-delay: 2s;
          animation-duration: 6s;
        }
      `}</style>
    </main>
  );
}
