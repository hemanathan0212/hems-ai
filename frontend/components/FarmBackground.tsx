"use client";

export default function FarmBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#102d20]">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cinematic sky */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#172f3a" />
            <stop offset="35%" stopColor="#718b7b" />
            <stop offset="70%" stopColor="#d7ae7d" />
            <stop offset="100%" stopColor="#f2c88e" />
          </linearGradient>

          {/* Realistic sunlight glow */}
          <radialGradient id="sunlight">
            <stop offset="0%" stopColor="#fff9d9" stopOpacity="1" />
            <stop offset="12%" stopColor="#ffe8a8" stopOpacity=".9" />
            <stop offset="30%" stopColor="#ffd58a" stopOpacity=".5" />
            <stop offset="60%" stopColor="#f5bb73" stopOpacity=".18" />
            <stop offset="100%" stopColor="#f5bb73" stopOpacity="0" />
          </radialGradient>

          {/* Warm atmospheric lighting */}
          <linearGradient id="warmLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe7a8" stopOpacity=".5" />
            <stop offset="100%" stopColor="#ffe7a8" stopOpacity="0" />
          </linearGradient>

          {/* Sun rays */}
          <linearGradient id="sunRay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff1bd" stopOpacity=".35" />
            <stop offset="100%" stopColor="#fff1bd" stopOpacity="0" />
          </linearGradient>

          {/* Mountains */}
          <linearGradient id="mountains" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#84947d" />
            <stop offset="100%" stopColor="#294d39" />
          </linearGradient>

          {/* Farmland */}
          <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#91a94e" />
            <stop offset="45%" stopColor="#557b32" />
            <stop offset="100%" stopColor="#17391c" />
          </linearGradient>

          {/* Golden field lighting */}
          <linearGradient id="goldenField" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4d18a" stopOpacity=".35" />
            <stop offset="100%" stopColor="#f4d18a" stopOpacity="0" />
          </linearGradient>

          {/* Mist */}
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff5d9" stopOpacity=".3" />
            <stop offset="100%" stopColor="#fff5d9" stopOpacity="0" />
          </linearGradient>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="20" />
          </filter>

          <filter id="lightGlow">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* SKY */}
        <rect width="1600" height="900" fill="url(#sky)" />

        {/* LARGE DIFFUSED SUNLIGHT */}
        <circle
          cx="1150"
          cy="280"
          r="380"
          fill="url(#sunlight)"
          filter="url(#softGlow)"
        />

        {/* SUN CORE */}
        <circle
          cx="1150"
          cy="280"
          r="105"
          fill="#ffe9b5"
          opacity=".35"
          filter="url(#softGlow)"
        />

        <circle
          cx="1150"
          cy="280"
          r="45"
          fill="#fff4d5"
          opacity=".9"
          filter="url(#lightGlow)"
        />

        {/* SUNLIGHT RAYS */}
        <g className="sun-rays">
          <path d="M1150 280 L750 900 L980 900Z" fill="url(#sunRay)" />

          <path d="M1150 280 L1120 900 L1280 900Z" fill="url(#sunRay)" />

          <path d="M1150 280 L1450 900 L1600 900Z" fill="url(#sunRay)" />

          <path
            d="M1150 280 L500 750 L650 900Z"
            fill="url(#sunRay)"
            opacity=".4"
          />
        </g>

        {/* DISTANT MOUNTAINS */}
        <path
          d="M0 480 L180 300 L340 440 L520 270 L760 465 L950 310 L1160 460 L1380 280 L1600 450 L1600 650 L0 650Z"
          fill="url(#mountains)"
        />

        {/* MOUNTAIN LIGHT HIGHLIGHTS */}
        <path
          d="M180 300 L340 440 L520 270 L420 430 L340 370Z"
          fill="#d9d2ad"
          opacity=".22"
        />

        <path
          d="M950 310 L1160 460 L1380 280 L1260 440 L1160 390Z"
          fill="#f1d5a4"
          opacity=".2"
        />

        {/* MORNING MIST */}
        <g className="mist-layer">
          <path
            d="M0 450 Q400 410 800 450 Q1200 390 1600 450 L1600 570 Q1000 510 0 570Z"
            fill="url(#mist)"
          />

          <ellipse
            cx="1050"
            cy="470"
            rx="450"
            ry="45"
            fill="#fff0cf"
            opacity=".16"
            filter="url(#softGlow)"
          />

          <ellipse
            cx="450"
            cy="490"
            rx="400"
            ry="35"
            fill="#fff0cf"
            opacity=".12"
            filter="url(#softGlow)"
          />
        </g>

        {/* DISTANT TREES */}
        <path
          d="M0 480 Q200 400 400 470 Q700 390 900 470 Q1200 390 1600 470 L1600 620 L0 620Z"
          fill="#234a30"
        />

        {/* FARMLAND */}
        <path
          d="M0 490 Q800 430 1600 490 L1600 900 L0 900Z"
          fill="url(#field)"
        />

        {/* GOLDEN LIGHT ON FIELD */}
        <path
          d="M850 490 Q1150 460 1600 490 L1600 750 Q1200 650 850 490Z"
          fill="url(#goldenField)"
        />

        {/* CROP ROWS */}
        <g fill="none" stroke="#b4d477" opacity=".55">
          <path d="M800 490 Q500 650 100 900" strokeWidth="5" />
          <path d="M800 490 Q650 650 400 900" strokeWidth="6" />
          <path d="M800 490 Q750 650 700 900" strokeWidth="7" />
          <path d="M800 490 Q850 650 1000 900" strokeWidth="7" />
          <path d="M800 490 Q1000 650 1300 900" strokeWidth="6" />
          <path d="M800 490 Q1150 650 1600 900" strokeWidth="5" />
        </g>

        {/* CROP SHADOWS */}
        <g fill="none" stroke="#173b1d" opacity=".7">
          <path d="M770 500 Q400 700 0 900" strokeWidth="12" />
          <path d="M820 500 Q700 700 550 900" strokeWidth="12" />
          <path d="M830 500 Q1100 700 1500 900" strokeWidth="12" />
        </g>

        {/* TRACTOR */}
        <g transform="translate(1050 550) scale(1.2)">
          <circle cx="90" cy="115" r="43" fill="#18251c" />
          <circle cx="90" cy="115" r="25" fill="#87918a" />
          <circle cx="90" cy="115" r="12" fill="#35473b" />

          <circle cx="205" cy="125" r="27" fill="#18251c" />
          <circle cx="205" cy="125" r="15" fill="#87918a" />
          <circle cx="205" cy="125" r="7" fill="#35473b" />

          <path
            d="M45 65 L175 65 L210 100 L195 125 L55 125 L30 100Z"
            fill="#c7a52e"
          />

          <rect x="150" y="50" width="65" height="48" rx="8" fill="#d8b633" />

          <path
            d="M75 65 L90 5 L155 5 L170 65Z"
            fill="#273f35"
            stroke="#e0bd42"
            strokeWidth="5"
          />

          <path
            d="M98 15 L145 15 L155 55 L88 55Z"
            fill="#8fc6bb"
            opacity=".7"
          />

          <path d="M82 0 L163 0 L170 10 L75 10Z" fill="#e3c34d" />

          <rect x="180" y="20" width="7" height="32" fill="#29372d" />
        </g>

        {/* AI CONNECTIONS */}
        <g
          fill="none"
          stroke="#83ffad"
          strokeWidth="2"
          filter="url(#glow)"
          className="ai-lines"
        >
          <path d="M800 530 Q1000 400 1250 300" />
          <path d="M800 530 Q1050 600 1350 480" />
          <path d="M800 530 Q1100 300 1450 200" />
        </g>

        {/* AI DATA POINTS */}
        <g fill="#9affbd" filter="url(#glow)" className="ai-points">
          <circle cx="1000" cy="430" r="5" />
          <circle cx="1250" cy="300" r="6" />
          <circle cx="1350" cy="480" r="5" />
          <circle cx="1450" cy="200" r="5" />
        </g>

        {/* FINAL LIGHT OVERLAY */}
        <rect width="1600" height="900" fill="url(#warmLight)" opacity=".2" />

        <rect width="1600" height="900" fill="#03170d" opacity=".18" />
      </svg>

      {/* CINEMATIC LIGHTING */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#061b12]/90 via-[#061b12]/30 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#06170e]/70 via-transparent to-black/10" />

      <style jsx>{`
        .sun-rays {
          animation: sunlightMove 12s ease-in-out infinite alternate;
          transform-origin: 1150px 280px;
        }

        .mist-layer {
          animation: mistMove 10s ease-in-out infinite alternate;
        }

        .ai-lines {
          animation: aiGlow 4s ease-in-out infinite alternate;
          opacity: 0.55;
        }

        .ai-points {
          animation: aiPulse 2.5s ease-in-out infinite alternate;
        }

        @keyframes sunlightMove {
          from {
            opacity: 0.45;
            transform: scale(1);
          }
          to {
            opacity: 0.85;
            transform: scale(1.04);
          }
        }

        @keyframes mistMove {
          from {
            transform: translateX(-15px);
            opacity: 0.55;
          }
          to {
            transform: translateX(15px);
            opacity: 0.9;
          }
        }

        @keyframes aiGlow {
          from {
            opacity: 0.25;
          }
          to {
            opacity: 0.9;
          }
        }

        @keyframes aiPulse {
          from {
            opacity: 0.4;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
