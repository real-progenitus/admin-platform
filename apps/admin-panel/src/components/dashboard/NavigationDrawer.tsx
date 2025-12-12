import React from "react";
import { NavigationDrawerProps } from "./types";
import { MenuIcon, CloseIcon, HomeIcon, GlobeIcon, UsersIcon, CalendarIcon, InboxIcon, SearchIcon, LogoutIcon } from "./icons";
import { EnvironmentSelector } from "../EnvironmentSelector";

export function NavigationDrawer({
  activeTab,
  isMobileMenuOpen,
  onTabChange,
  onMobileMenuToggle,
  username,
  onLogout,
}: NavigationDrawerProps) {
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuToggle}
        className="md:hidden fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-lg p-3 rounded-xl shadow-lg"
      >
        {isMobileMenuOpen ? (
          <CloseIcon className="w-6 h-6 text-gray-800" />
        ) : (
          <MenuIcon className="w-6 h-6 text-gray-800" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Left Drawer Navigation */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-white/90 backdrop-blur-lg shadow-2xl border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-md font-bold text-gray-800">{username}</h2>
        </div>
        <nav className="flex-1 p-4">
          <button
            onClick={() => {
              onTabChange("landing");
              onMobileMenuToggle();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 mb-2 ${
              activeTab === "landing"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            Post Metrics
          </button>
          <button
            onClick={() => {
              onTabChange("regions");
              onMobileMenuToggle();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 mb-2 ${
              activeTab === "regions"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <GlobeIcon className="w-5 h-5" />
            Regions
          </button>
          <button
            onClick={() => {
              onTabChange("user-management");
              onMobileMenuToggle();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 mb-2 ${
              activeTab === "user-management"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UsersIcon className="w-5 h-5" />
            Admin Management
          </button>
          <button
            onClick={() => {
              onTabChange("user-metrics");
              onMobileMenuToggle();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 mb-2 ${
              activeTab === "user-metrics"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            User Metrics
          </button>
          <button
            onClick={() => {
              onTabChange("access-codes");
              onMobileMenuToggle();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 mb-2 ${
              activeTab === "access-codes"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <InboxIcon className="w-5 h-5" />
            Access Codes
          </button>
          <button
            onClick={() => {
              onTabChange("latest-searches");
              onMobileMenuToggle();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "latest-searches"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <SearchIcon className="w-5 h-5" />
            Latest Searches
          </button>
        </nav>
        
        {/* Environment Selector */}
        <div className="px-4 py-3 border-t border-gray-200">
          <EnvironmentSelector />
        </div>

        {/* Logout Button at Bottom */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              onLogout();
              onMobileMenuToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-red-600 hover:bg-red-50"
          >
            <LogoutIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
