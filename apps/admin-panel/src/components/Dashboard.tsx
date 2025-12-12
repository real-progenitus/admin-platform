import React, { useState, useEffect } from "react";
import { UserManagement } from "./UserManagement";
import { Regions } from "./Regions";
import { NavigationDrawer } from "./dashboard/NavigationDrawer";
import { SectionHeader } from "./dashboard/SectionHeader";
import { StatCard } from "./dashboard/StatCard";
import { UserGrowthChart } from "./dashboard/UserGrowthChart";
import { CategoryCharts } from "./dashboard/CategoryCharts";
import { LatestSearchesWidget } from "./dashboard/LatestSearchesWidget";
import { AccessCodesWidget } from "./dashboard/AccessCodesWidget";
import { CreateAccessCodeWidget } from "./dashboard/CreateAccessCodeWidget";
import { DashboardProps } from "./dashboard/types";
import { useEnvironment } from "../contexts/EnvironmentContext";
import {
  UsersIcon,
  SearchIcon,
  CalendarIcon,
  DocumentIcon,
  CurrencyIcon,
  InboxIcon,
  BuildingIcon,
  LocationIcon,
  CheckCircleFilledIcon,
} from "./dashboard/icons";

export function Dashboard({
  user,
  onLogout,
  landingStats,
  userMetrics,
  latestSearches,
  accessCodes,
  fetchLandingStats,
  fetchUserMetrics,
  fetchLatestSearches,
  fetchAccessCodes,
  fetchAvailableMonths,
  accessToken,
}: DashboardProps) {
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "landing"
    | "regions"
    | "user-management"
    | "user-metrics"
    | "access-codes"
    | "latest-searches"
  >("landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const { environment } = useEnvironment();

  // Function to recalculate average rewards
  const handleRecalculate = async () => {
    if (!accessToken) return;

    setIsRecalculating(true);
    try {
      const params = new URLSearchParams();
      if (environment) {
        params.append('environment', environment);
      }
      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/metrics/recalculate-average-rewards${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to recalculate");
      }

      // Refresh the landing stats to show updated data
      await fetchLandingStats();
      alert("Average rewards recalculated successfully!");
    } catch (error) {
      console.error("Error recalculating average rewards:", error);
      alert("Failed to recalculate average rewards. Please try again.");
    } finally {
      setIsRecalculating(false);
    }
  };

  // Lazy load data based on active tab (only on initial load, not on environment change)
  useEffect(() => {
    switch (activeTab) {
      case "landing":
        if (!landingStats) fetchLandingStats();
        break;
      case "latest-searches":
        if (!latestSearches) fetchLatestSearches();
        break;
      case "access-codes":
        if (!accessCodes) fetchAccessCodes();
        break;
      case "user-metrics":
        if (!userMetrics) fetchUserMetrics();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Refetch data when environment changes
  useEffect(() => {
    switch (activeTab) {
      case "landing":
        fetchLandingStats();
        break;
      case "latest-searches":
        fetchLatestSearches();
        break;
      case "access-codes":
        fetchAccessCodes();
        break;
      case "user-metrics":
        fetchUserMetrics();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment]);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <NavigationDrawer
        activeTab={activeTab}
        isMobileMenuOpen={isMobileMenuOpen}
        onTabChange={setActiveTab}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        username={user.name || user.email}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full p-4 md:p-6 pt-20 md:pt-6">
        <div className="max-w-6xl mx-auto w-full">
          {activeTab === "landing" ? (
            <>
              <SectionHeader
                title="Post Metrics"
                subtitle="Overview of posts and activity"
                icon={<DocumentIcon className="w-6 h-6 text-white" />}
                gradientFrom="from-indigo-400"
                gradientTo="to-indigo-600"
                actionButton={
                  <button
                    onClick={handleRecalculate}
                    disabled={isRecalculating}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isRecalculating ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Recalculating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Recalculate Charts
                      </>
                    )}
                  </button>
                }
              />
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Lost vs Found
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-red-600">
                          {landingStats?.lostPosts ?? "—"}
                        </p>
                        <p className="text-xl text-gray-400">/</p>
                        <p className="text-3xl font-bold text-green-600">
                          {landingStats?.foundPosts ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                      <SearchIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <StatCard
                  title="Posts Last Week"
                  value={landingStats?.postsLastWeek ?? "—"}
                  iconGradient="bg-gradient-to-br from-blue-400 to-blue-600"
                  icon={<CalendarIcon className="w-6 h-6 text-white" />}
                />

                <StatCard
                  title="Resolved Posts"
                  value={landingStats?.resolvedPosts ?? "—"}
                  iconGradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
                  subtitle={`${landingStats?.totalPosts ? Math.round((landingStats.resolvedPosts / landingStats.totalPosts) * 100) : 0}% of total`}
                  icon={
                    <CheckCircleFilledIcon className="w-6 h-6 text-white" />
                  }
                />
              </div>

              {/* Second Row Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard
                  title="Total Posts"
                  value={landingStats?.totalPosts ?? "—"}
                  iconGradient="bg-gradient-to-br from-indigo-400 to-indigo-600"
                  icon={<DocumentIcon className="w-6 h-6 text-white" />}
                />

                <StatCard
                  title="With Reward"
                  value={landingStats?.postsWithReward ?? "—"}
                  iconGradient="bg-gradient-to-br from-green-400 to-green-600"
                  subtitle={`${landingStats?.percentageWithReward ?? 0}% of total`}
                  icon={<CurrencyIcon className="w-6 h-6 text-white" />}
                />

                <StatCard
                  title="Without Reward"
                  value={landingStats?.postsWithoutReward ?? "—"}
                  iconGradient="bg-gradient-to-br from-gray-400 to-gray-600"
                  subtitle={`${landingStats ? 100 - landingStats.percentageWithReward : 0}% of total`}
                  icon={<InboxIcon className="w-6 h-6 text-white" />}
                />
              </div>

              {/* Chart Widgets Row */}
              {landingStats?.categoryStats && (
                <div className="mb-6">
                  <CategoryCharts categoryStats={landingStats.categoryStats} />
                </div>
              )}

              {/* User Management Modal */}
              {showUserManagement && (
                <UserManagement
                  accessToken={accessToken}
                  currentUserRole={user.role}
                  onClose={() => setShowUserManagement(false)}
                />
              )}
            </>
          ) : activeTab === "regions" ? (
            <Regions accessToken={accessToken} />
          ) : activeTab === "user-management" ? (
            <>
              <SectionHeader
                title="Admin Management"
                subtitle="Manage admin users and permissions"
                icon={<UsersIcon className="w-6 h-6 text-white" />}
                gradientFrom="from-teal-400"
                gradientTo="to-teal-600"
              />
              <UserManagement
                accessToken={accessToken}
                currentUserRole={user.role}
                onClose={() => {}}
                isModal={false}
              />
            </>
          ) : activeTab === "user-metrics" ? (
            <>
              <SectionHeader
                title="User Metrics"
                subtitle="User growth and statistics"
                icon={<UsersIcon className="w-6 h-6 text-white" />}
                gradientFrom="from-purple-400"
                gradientTo="to-purple-600"
              />
              {/* User Metrics Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard
                  title="Total Users"
                  value={userMetrics?.totalUsers ?? "—"}
                  iconGradient="bg-gradient-to-br from-purple-400 to-purple-600"
                  icon={<UsersIcon className="w-6 h-6 text-white" />}
                />

                <StatCard
                  title="Total Partners"
                  value={userMetrics?.totalPartners ?? "—"}
                  iconGradient="bg-gradient-to-br from-teal-400 to-teal-600"
                  icon={<BuildingIcon className="w-6 h-6 text-white" />}
                />

                <StatCard
                  title="Partner Locations"
                  value={userMetrics?.totalPartnerLocations ?? "—"}
                  iconGradient="bg-gradient-to-br from-cyan-400 to-cyan-600"
                  icon={<LocationIcon className="w-6 h-6 text-white" />}
                />
              </div>

              {/* User Growth Chart - Full Width */}
              {environment !== 'qa' && (
                <div className="mb-6">
                  <UserGrowthChart
                    userGrowth={userMetrics?.userGrowth || []}
                    fetchUserMetrics={fetchUserMetrics}
                    fetchAvailableMonths={fetchAvailableMonths}
                  />
                </div>
              )}
            </>
          ) : activeTab === "access-codes" ? (
            <>
              <SectionHeader
                title="Access Codes"
                subtitle="Create and manage access codes"
                icon={<InboxIcon className="w-6 h-6 text-white" />}
                gradientFrom="from-green-400"
                gradientTo="to-green-600"
              />
              <div className="space-y-6">
                <CreateAccessCodeWidget
                  accessToken={accessToken}
                  onCodeCreated={() => fetchAccessCodes(1)}
                />
                {accessCodes?.accessCodes && (
                  <AccessCodesWidget
                    accessCodes={accessCodes.accessCodes}
                    totalCount={accessCodes.totalCount}
                    currentPage={accessCodes.page}
                    totalPages={accessCodes.totalPages}
                    onPageChange={(page) => fetchAccessCodes(page)}
                  />
                )}
              </div>
            </>
          ) : activeTab === "latest-searches" ? (
            <>
              <SectionHeader
                title="Latest Searches"
                subtitle="Recent search activity"
                icon={<SearchIcon className="w-6 h-6 text-white" />}
                gradientFrom="from-orange-400"
                gradientTo="to-orange-600"
              />
              {latestSearches?.latestSearches && (
                <LatestSearchesWidget
                  latestSearches={latestSearches.latestSearches}
                  searchLogsLastWeek={latestSearches.searchLogsLastWeek}
                />
              )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
