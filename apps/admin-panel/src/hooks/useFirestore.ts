import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

interface PostsStats {
  totalUsers: number;
  totalPosts: number;
  lostPosts: number;
  foundPosts: number;
  postsLastWeek: number;
  postsWithReward: number;
  postsWithoutReward: number;
  percentageWithReward: number;
  totalPartners: number;
  totalPartnerLocations: number;
  searchLogsLastWeek: number;
  resolvedPosts: number;
  latestSearches: Array<{
    id: string;
    query: string;
    timestamp: number;
  }>;
  unusedAccessCodes: string[];
  categoryStats: Array<{
    category: string;
    totalPostCount: number;
    totalRewards: number;
    averageReward: number;
  }>;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
}

export function useFirestore(accessToken: string | null, isAuthenticated: boolean) {
  const [firestoreData, setFirestoreData] = useState<any[]>([]);
  const [postsStats, setPostsStats] = useState<PostsStats | null>(null);
  const [selectedCollection, setSelectedCollection] = useState('Posts');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  const fetchPostsStats = async () => {
    if (!accessToken) return;
    
    setIsLoadingData(true);
    setDataError('');
    
    try {
      const response = await fetch(`${API_URL}/metrics/posts/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      setPostsStats(data);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Failed to fetch stats');
      setPostsStats(null);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchFirestoreData = async (collection: string) => {
    if (!accessToken) return;
    
    setIsLoadingData(true);
    setDataError('');
    
    try {
      const response = await fetch(`${API_URL}/metrics/${collection}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      setFirestoreData(Array.isArray(data) ? data : []);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Failed to fetch data');
      setFirestoreData([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchPostsStats();
    }
  }, [isAuthenticated, accessToken]);

  const resetData = () => {
    setFirestoreData([]);
    setPostsStats(null);
    setDataError('');
  };

  return {
    firestoreData,
    postsStats,
    selectedCollection,
    setSelectedCollection,
    isLoadingData,
    dataError,
    fetchFirestoreData,
    fetchPostsStats,
    resetData,
  };
}
