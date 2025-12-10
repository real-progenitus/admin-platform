import React from "react";
import { StatCardProps } from "./types";

export function StatCard({
  title,
  value,
  icon,
  iconGradient,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 ${iconGradient} rounded-xl flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
