"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function PasswordSuccessScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleBackToSettings();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBackToSettings = () => {
    router.push("/settings");
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen bg-gray-200 animate-in slide-in-from-right duration-300 flex flex-col items-center justify-center p-6">
      <div className="mb-6 animate-in fade-in zoom-in duration-500 delay-100">
        <svg
          width="100"
          height="100"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated expanding circles with shadow effect */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#9ca3af"
            strokeWidth="3"
            opacity="0.2"
            filter="url(#glow)"
          >
            <animate
              attributeName="r"
              values="50;55;50"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.1;0.2"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            cx="60"
            cy="60"
            r="42"
            stroke="#9ca3af"
            strokeWidth="3"
            opacity="0.25"
            filter="url(#glow)"
          >
            <animate
              attributeName="r"
              values="42;47;42"
              dur="3s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="0.25;0.12;0.25"
              dur="3s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>

          {/* Shadow/glow filter definition */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main circle background */}
          <circle cx="60" cy="60" r="35" fill="#f3f4f6" />
          <circle cx="60" cy="60" r="35" stroke="#6b7280" strokeWidth="2.5" />

          {/* Checkmark with smooth curves */}
          <path
            d="M45 60 L54 69 L75 48"
            stroke="#6b7280"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="50"
            strokeDashoffset="50"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="50"
              to="0"
              dur="0.6s"
              fill="freeze"
              begin="0.3s"
            />
          </path>

          {/* Subtle corner accents */}
          <circle cx="28" cy="32" r="2" fill="#1f2937" opacity="0.2" />
          <circle cx="92" cy="32" r="2" fill="#1f2937" opacity="0.2" />
          <circle cx="28" cy="88" r="2" fill="#1f2937" opacity="0.2" />
          <circle cx="92" cy="88" r="2" fill="#1f2937" opacity="0.2" />
        </svg>
      </div>

      <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
          Password Reset Successfully
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Your password has been updated and is now secure.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
        <Button
          onClick={handleBackToSettings}
          className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 rounded-lg font-medium text-base active:scale-95 shadow-lg shadow-gray-900/10"
        >
          Back to Settings
        </Button>

        <p className="text-center text-sm text-gray-500">
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
        </p>
      </div>
    </div>
  );
}
