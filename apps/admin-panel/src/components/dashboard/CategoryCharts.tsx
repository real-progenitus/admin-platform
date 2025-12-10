import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CategoryChartsProps } from "./types";
import { BarChartIcon, ChartIcon } from "./icons";

export function CategoryCharts({ categoryStats }: CategoryChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Average Reward per Category */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChartIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">
            Average Reward per Category
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryStats || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{
                value: "Avg Reward (€)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
            <Bar dataKey="averageReward" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Post Count per Category */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ChartIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">
            Post Count per Category
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryStats || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{
                value: "Total Posts",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar dataKey="totalPostCount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
