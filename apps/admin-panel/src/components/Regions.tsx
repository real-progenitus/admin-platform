import React, { useState } from "react";
import { IberiaMap } from "./IberiaMap";
import { UKMap } from "./UKMap";

interface RegionsProps {
  accessToken: string | null;
}

type TabType = "iberia" | "uk";

export function Regions({ accessToken }: RegionsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("iberia");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Regions Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage regions and locations
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
        <div className="border-b border-gray-200">
          <nav className="flex gap-2 p-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("iberia")}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === "iberia"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              Iberia Regions
            </button>
            <button
              onClick={() => setActiveTab("uk")}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === "uk"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              UK Regions
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "iberia" && <IberiaMap />}
          {activeTab === "uk" && <UKMap />}
        </div>
      </div>
    </div>
  );
}
