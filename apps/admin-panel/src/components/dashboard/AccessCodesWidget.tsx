import React, { useState } from "react";
import { AccessCodesWidgetProps } from "./types";
import { KeyIcon } from "./icons";

export function AccessCodesWidget({
  accessCodes,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}: AccessCodesWidgetProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <KeyIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">
            Access Codes
          </h3>
        </div>
        {totalCount > 0 && (
          <p className="text-sm text-gray-500">
            {totalCount} total codes
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        {accessCodes && accessCodes.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Code
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Used By
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {accessCodes.map((accessCode) => (
                <tr
                  key={accessCode.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-3">
                    <p className="text-sm font-mono font-bold text-gray-800">
                      {accessCode.code}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    {accessCode.used ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">
                        Used
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-sm text-gray-600">
                      {accessCode.usedByEmail || '—'}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {!accessCode.used && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(accessCode.code);
                          setCopiedId(accessCode.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        {copiedId === accessCode.id ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({totalCount} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-1 text-sm font-semibold rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No access codes found
          </p>
        )}
      </div>
    </div>
  );
}
