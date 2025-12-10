import React from "react";
import { LatestSearchesWidgetProps } from "./types";
import { SearchIcon } from "./icons";

export function LatestSearchesWidget({
  latestSearches,
  searchLogsLastWeek,
}: LatestSearchesWidgetProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">Latest Searches</h3>
        </div>
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg px-3 py-1">
          <p className="text-xs font-bold text-pink-700">
            {searchLogsLastWeek ?? "—"} this week
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {latestSearches && latestSearches.length > 0 ? (
          latestSearches.map((search) => (
            <div
              key={search.id}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700 truncate flex-1">
                  {search.query}
                </p>
                <p className="text-xs text-gray-500 ml-2">
                  {new Date(search.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No recent searches
          </p>
        )}
      </div>
    </div>
  );
}
