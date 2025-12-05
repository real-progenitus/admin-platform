import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FirestoreService } from '../firestore/firestore.service';

@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get('posts/stats')
  async getPostsStats() {
    const [allPosts, totalUsers, partners, partnerLocations, searchLogs, accessCodes, averageRewards, userGrowthData] = await Promise.all([
      this.firestoreService.getCollection('Posts'),
      this.firestoreService.getAuthenticatedUsersCount(),
      this.firestoreService.getCollection('Partners'),
      this.firestoreService.getCollection('PartnerLocations'),
      this.firestoreService.getCollection('SearchLogs'),
      this.firestoreService.getCollection('AccessCodes'),
      this.firestoreService.getDocument('Dynamic', 'average_rewards'),
      this.firestoreService.getUserGrowthLastMonth(),
    ]);
    
    const postsWithReward = allPosts.filter((post: any) => post.reward && post.reward.trim() !== '');
    const lostPosts = allPosts.filter((post: any) => post.type === 'Lost');
    const foundPosts = allPosts.filter((post: any) => post.type === 'Found');
    const resolvedPosts = allPosts.filter((post: any) => post.isResolved === true);
    
    // Posts in the last 7 days
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const postsLastWeek = allPosts.filter((post: any) => post.timestamp && post.timestamp >= oneWeekAgo);
    
    // Search logs in the last 7 days
    const searchLogsLastWeek = searchLogs.filter((log: any) => {
      if (!log.timestamp) return false;
      const timestamp = log.timestamp?.toMillis ? log.timestamp.toMillis() : log.timestamp;
      return timestamp >= oneWeekAgo;
    });
    
    // Latest 5 searches (sorted by timestamp descending)
    const latestSearches = searchLogs
      .filter((log: any) => log.timestamp)
      .sort((a: any, b: any) => {
        const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : a.timestamp;
        const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : b.timestamp;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map((log: any) => ({
        id: log.id,
        query: log.searchValue || 'N/A',
        timestamp: log.timestamp?.toMillis ? log.timestamp.toMillis() : log.timestamp,
      }));
    
    // Get 2 unused access codes
    const unusedAccessCodes = accessCodes
      .filter((code: any) => !code.used && !code.isUsed)
      .slice(0, 2)
      .map((code: any) => code.code || code.id);
    
    // Process average rewards data
    const categoryStats = averageRewards ? Object.entries(averageRewards)
      .filter(([key]) => key !== 'id')
      .map(([category, data]: [string, any]) => ({
        category,
        totalPostCount: data.totalPostCount || 0,
        totalRewards: data.totalRewards || 0,
        averageReward: data.totalPostCount > 0 
          ? Math.round((data.totalRewards / data.totalPostCount) * 100) / 100
          : 0,
      }))
      .sort((a, b) => a.category.localeCompare(b.category))
    : [];
    
    return {
      totalUsers,
      totalPosts: allPosts.length,
      lostPosts: lostPosts.length,
      foundPosts: foundPosts.length,
      postsLastWeek: postsLastWeek.length,
      postsWithReward: postsWithReward.length,
      postsWithoutReward: allPosts.length - postsWithReward.length,
      percentageWithReward: allPosts.length > 0 
        ? Math.round((postsWithReward.length / allPosts.length) * 100) 
        : 0,
      totalPartners: partners.length,
      totalPartnerLocations: partnerLocations.length,
      searchLogsLastWeek: searchLogsLastWeek.length,
      resolvedPosts: resolvedPosts.length,
      latestSearches,
      unusedAccessCodes,
      categoryStats,
      userGrowth: userGrowthData,
    };
  }

  @Get(':collection')
  async getCollection(@Param('collection') collection: string) {
    return this.firestoreService.getCollection(collection);
  }

  @Get(':collection/:id')
  async getDocument(
    @Param('collection') collection: string,
    @Param('id') id: string
  ) {
    return this.firestoreService.getDocument(collection, id);
  }

  @Get(':collection/query/:field')
  async queryDocuments(
    @Param('collection') collection: string,
    @Param('field') field: string,
    @Query('operator') operator: any,
    @Query('value') value: any
  ) {
    return this.firestoreService.queryDocuments(
      collection,
      field,
      operator || '==',
      value
    );
  }
}
