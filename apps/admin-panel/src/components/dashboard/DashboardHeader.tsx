import React from "react";
import { DashboardHeaderProps } from "./types";
import { CheckCircleIcon, UserAddIcon } from "./icons";

export function DashboardHeader({
  user,
  onLogout,
  onCreateUser,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-sm text-gray-500">
              {user.email} • {user.role}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Logout
        </button>
      </div>

      {/* User Management Button */}
      <div className="mt-4">
        <button
          onClick={onCreateUser}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <UserAddIcon className="w-5 h-5" />
          Create New User
        </button>
      </div>
    </div>
  );
}
