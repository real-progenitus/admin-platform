import { useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface LandingStats {
  totalPosts: number;
  lostPosts: number;
  foundPosts: number;
  postsLastWeek: number;
  postsWithReward: number;
  postsWithoutReward: number;
  percentageWithReward: number;
  searchLogsLastWeek: number;
  resolvedPosts: number;
  categoryStats: Array<{
    category: string;
    totalPostCount: number;
    totalRewards: number;
    averageReward: number;
  }>;
}

interface UserMetrics {
  totalUsers: number;
  totalPartners: number;
  totalPartnerLocations: number;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  availableMonths?: string[];
}

interface LatestSearches {
  latestSearches: Array<{
    id: string;
    query: string;
    timestamp: number;
  }>;
  searchLogsLastWeek: number;
}

interface AccessCodes {
  accessCodes: Array<{
    id: string;
    code: string;
    used: boolean;
    usedByEmail: string | null;
    createdAt: number;
  }>;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useFirestore(
  accessToken: string | null,
  isAuthenticated: boolean,
  environment?: string,
) {
  const [firestoreData, setFirestoreData] = useState<any[]>([]);
  const [landingStats, setLandingStats] = useState<LandingStats | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [latestSearches, setLatestSearches] = useState<LatestSearches | null>(
    null
  );
  const [accessCodes, setAccessCodes] = useState<AccessCodes | null>(null);
  const [selectedCollection, setSelectedCollection] = useState("Posts");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");

  const fetchLandingStats = useCallback(async () => {
    if (!accessToken) return;

    setIsLoadingData(true);
    setDataError("");

    try {
      const params = new URLSearchParams();
      if (environment) {
        params.append('environment', environment);
      }

      const queryString = params.toString();
      const url = `${API_URL}/metrics/posts/stats${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      setLandingStats(data);
    } catch (err) {
      setDataError(
        err instanceof Error ? err.message : "Failed to fetch stats"
      );
      setLandingStats(null);
    } finally {
      setIsLoadingData(false);
    }
  }, [accessToken, environment]);

  const fetchUserMetrics = useCallback(async (year?: number, month?: number) => {
    if (!accessToken) return;

    setIsLoadingData(true);
    setDataError("");

    try {
      const params = new URLSearchParams();
      if (year && month) {
        params.append("year", year.toString());
        params.append("month", month.toString());
      }
      if (environment) {
        params.append('environment', environment);
      }
      
      const url = `${API_URL}/metrics/user-metrics${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user metrics: ${response.statusText}`);
      }

      const data = await response.json();
      setUserMetrics(data);
    } catch (err) {
      setDataError(
        err instanceof Error ? err.message : "Failed to fetch user metrics"
      );
      setUserMetrics(null);
    } finally {
      setIsLoadingData(false);
    }
  }, [accessToken, environment]);

  const fetchAvailableMonths = useCallback(async () => {
    if (!accessToken) return [];

    try {
      const response = await fetch(
        `${API_URL}/metrics/user-metrics/available-months`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch available months: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.months || [];
    } catch (err) {
      console.error("Error fetching available months:", err);
      return [];
    }
  }, [accessToken]);

  const fetchLatestSearches = useCallback(async () => {
    if (!accessToken) return;

    setIsLoadingData(true);
    setDataError("");

    try {
      const params = new URLSearchParams();
      if (environment) {
        params.append('environment', environment);
      }

      const queryString = params.toString();
      const url = `${API_URL}/metrics/latest-searches${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch latest searches: ${response.statusText}`
        );
      }

      const data = await response.json();
      setLatestSearches(data);
    } catch (err) {
      setDataError(
        err instanceof Error ? err.message : "Failed to fetch latest searches"
      );
      setLatestSearches(null);
    } finally {
      setIsLoadingData(false);
    }
  }, [accessToken, environment]);

  const fetchAccessCodes = useCallback(async (page: number = 1, limit: number = 10) => {
    if (!accessToken) return;

    setIsLoadingData(true);
    setDataError("");

    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (environment) {
        params.append('environment', environment);
      }

      const response = await fetch(
        `${API_URL}/metrics/access-codes?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch access codes: ${response.statusText}`);
      }

      const data = await response.json();
      setAccessCodes(data);
    } catch (err) {
      setDataError(
        err instanceof Error ? err.message : "Failed to fetch access codes"
      );
      setAccessCodes(null);
    } finally {
      setIsLoadingData(false);
    }
  }, [accessToken, environment]);

  const fetchFirestoreData = useCallback(async (collection: string) => {
    if (!accessToken) return;

    setIsLoadingData(true);
    setDataError("");

    try {
      const params = new URLSearchParams();
      if (environment) {
        params.append('environment', environment);
      }

      const queryString = params.toString();
      const url = `${API_URL}/metrics/${collection}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      setFirestoreData(Array.isArray(data) ? data : []);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Failed to fetch data");
      setFirestoreData([]);
    } finally {
      setIsLoadingData(false);
    }
  }, [accessToken, environment]);

  // Remove auto-fetch on mount - let components fetch when needed
  // useEffect(() => {
  //   if (isAuthenticated && accessToken) {
  //     fetchLandingStats();
  //   }
  // }, [isAuthenticated, accessToken]);

  const resetData = () => {
    setFirestoreData([]);
    setLandingStats(null);
    setUserMetrics(null);
    setLatestSearches(null);
    setAccessCodes(null);
    setDataError("");
  };

  return {
    firestoreData,
    landingStats,
    userMetrics,
    latestSearches,
    accessCodes,
    selectedCollection,
    setSelectedCollection,
    isLoadingData,
    dataError,
    fetchFirestoreData,
    fetchLandingStats,
    fetchUserMetrics,
    fetchLatestSearches,
    fetchAccessCodes,
    fetchAvailableMonths,
    resetData,
  };
}
