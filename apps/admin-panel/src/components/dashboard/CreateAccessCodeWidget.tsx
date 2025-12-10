import React, { useState } from "react";
import { KeyIcon } from "./icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface CreateAccessCodeWidgetProps {
  accessToken: string | null;
  onCodeCreated: () => void;
}

export function CreateAccessCodeWidget({
  accessToken,
  onCodeCreated,
}: CreateAccessCodeWidgetProps) {
  const [numberOfCodes, setNumberOfCodes] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/metrics/access-codes/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ count: numberOfCodes }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create access codes: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess(`Successfully created ${numberOfCodes} access code(s)`);
      setNumberOfCodes(1);
      onCodeCreated();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create access codes");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-4">
        <KeyIcon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">
          Create Access Codes
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleCreateCodes}>
        <div className="mb-4">
          <label
            htmlFor="numberOfCodes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of Codes
          </label>
          <input
            id="numberOfCodes"
            type="number"
            min="1"
            max="100"
            value={numberOfCodes}
            onChange={(e) => setNumberOfCodes(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isCreating}
          />
          <p className="text-xs text-gray-500 mt-1">
            Create between 1 and 100 access codes at once
          </p>
        </div>

        <button
          type="submit"
          disabled={isCreating || numberOfCodes < 1}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isCreating ? "Creating..." : `Create ${numberOfCodes} Code${numberOfCodes > 1 ? "s" : ""}`}
        </button>
      </form>
    </div>
  );
}
