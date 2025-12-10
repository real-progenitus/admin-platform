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
import { UserGrowthChartProps } from "./types";
import { TrendingUpIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

export function UserGrowthChart({ 
  userGrowth, 
  fetchUserMetrics, 
  fetchAvailableMonths 
}: UserGrowthChartProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = React.useState<number>(0);
  const [availableMonths, setAvailableMonths] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetchingMonth, setIsFetchingMonth] = React.useState(false);
  const [lastFetchedMonth, setLastFetchedMonth] = React.useState<string | null>(null);

  // Fetch available months on mount
  React.useEffect(() => {
    const loadAvailableMonths = async () => {
      setIsLoading(true);
      const months = await fetchAvailableMonths();
      setAvailableMonths(months);
      
      // Fetch data for the most recent month
      if (months.length > 0) {
        setIsFetchingMonth(true);
        const [year, month] = months[0].split('-');
        await fetchUserMetrics(parseInt(year, 10), parseInt(month, 10));
        setLastFetchedMonth(months[0]);
        setIsFetchingMonth(false);
      }
      setIsLoading(false);
    };
    
    loadAvailableMonths();
  }, []);

  // Fetch data when month index changes
  React.useEffect(() => {
    const selectedMonth = availableMonths[currentMonthIndex];
    
    // Only fetch if we have a valid month and it's different from the last fetched month
    if (selectedMonth && selectedMonth !== lastFetchedMonth) {
      const fetchMonth = async () => {
        setIsFetchingMonth(true);
        const [year, month] = selectedMonth.split('-');
        await fetchUserMetrics(parseInt(year, 10), parseInt(month, 10));
        setLastFetchedMonth(selectedMonth);
        setIsFetchingMonth(false);
      };
      fetchMonth();
    }
  }, [currentMonthIndex, availableMonths, lastFetchedMonth]);

  // Get current selected month
  const selectedMonth = availableMonths[currentMonthIndex];

  // Get formatted month name
  const currentMonthName = React.useMemo(() => {
    if (!selectedMonth || availableMonths.length === 0) return "Loading...";
    const [year, monthNum] = selectedMonth.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  }, [selectedMonth, availableMonths.length]);

  // Navigation handlers
  const canGoBack = currentMonthIndex < availableMonths.length - 1;
  const canGoForward = currentMonthIndex > 0;

  const handlePreviousMonth = () => {
    if (canGoBack) {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const handleNextMonth = () => {
    if (canGoForward) {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">User Growth</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousMonth}
            disabled={!canGoBack || isLoading || isFetchingMonth}
            className={`p-2 rounded-lg transition-all ${
              canGoBack && !isLoading && !isFetchingMonth
                ? "bg-purple-100 hover:bg-purple-200 text-purple-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            title="Previous month"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="min-w-[180px] text-center">
            <p className="text-sm font-bold text-gray-800">
              {currentMonthName}
            </p>
            {isFetchingMonth && (
              <p className="text-xs text-purple-600">Loading...</p>
            )}
          </div>
          <button
            onClick={handleNextMonth}
            disabled={!canGoForward || isLoading || isFetchingMonth}
            className={`p-2 rounded-lg transition-all ${
              canGoForward && !isLoading && !isFetchingMonth
                ? "bg-purple-100 hover:bg-purple-200 text-purple-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            title="Next month"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
            <p className="text-sm text-gray-600">Loading available months...</p>
          </div>
        </div>
      ) : isFetchingMonth ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
            <p className="text-sm text-gray-600">Loading month data...</p>
          </div>
        </div>
      ) : userGrowth.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-gray-600">No data available for this month</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis
              label={{
                value: "New Users",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value: number) => [value, "New Users"]}
            />
            <Bar dataKey="count" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
