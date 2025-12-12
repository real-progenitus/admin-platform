import { LoginResponse } from "@admin-platform/shared-auth";

export interface LandingStats {
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

export interface UserMetrics {
  totalUsers: number;
  totalPartners: number;
  totalPartnerLocations: number;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
}

export interface LatestSearches {
  latestSearches: Array<{
    id: string;
    query: string;
    timestamp: number;
  }>;
  searchLogsLastWeek: number;
}

export interface AccessCodes {
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

export interface Messages {
  totalMessages: number;
  conversations: Array<{
    senderId: string;
    receiverId: string;
    postId: string;
    postTitle: string;
    messageCount: number;
    lastMessage: string;
    lastTimestamp: number;
  }>;
}

export interface PostsStats {
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

export interface DashboardProps {
  user: LoginResponse["user"];
  onLogout: () => void;
  landingStats: LandingStats | null;
  userMetrics: UserMetrics | null;
  latestSearches: LatestSearches | null;
  accessCodes: AccessCodes | null;
  messages: Messages | null;
  isLoadingData: boolean;
  dataError: string;
  fetchLandingStats: () => void;
  fetchUserMetrics: (year?: number, month?: number) => void;
  fetchLatestSearches: () => void;
  fetchAccessCodes: (page?: number, limit?: number) => void;
  fetchMessages: () => void;
  fetchAvailableMonths: () => Promise<string[]>;
  accessToken: string | null;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconGradient: string;
  subtitle?: string;
}

export interface NavigationDrawerProps {
  activeTab: "landing" | "regions" | "user-management" | "user-metrics" | "access-codes" | "latest-searches" | "messages";
  isMobileMenuOpen: boolean;
  onTabChange: (tab: "landing" | "regions" | "user-management" | "user-metrics" | "access-codes" | "latest-searches" | "messages") => void;
  onMobileMenuToggle: () => void;
  username: string;
  onLogout: () => void;
}

export interface DashboardHeaderProps {
  user: LoginResponse["user"];
  onLogout: () => void;
  onCreateUser: () => void;
}

export interface LatestSearchesWidgetProps {
  latestSearches: Array<{
    id: string;
    query: string;
    timestamp: number;
  }>;
  searchLogsLastWeek: number;
}

export interface AccessCodesWidgetProps {
  accessCodes: Array<{
    id: string;
    code: string;
    used: boolean;
    usedByEmail: string | null;
    createdAt: number;
  }>;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface UserGrowthChartProps {
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  fetchUserMetrics: (year?: number, month?: number) => void;
  fetchAvailableMonths: () => Promise<string[]>;
}

export interface CategoryChartsProps {
  categoryStats: Array<{
    category: string;
    totalPostCount: number;
    totalRewards: number;
    averageReward: number;
  }>;
}
