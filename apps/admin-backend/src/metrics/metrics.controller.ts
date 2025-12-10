import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FirestoreService } from '../firestore/firestore.service';

@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get('posts/stats')
  async getPostsStats() {
    const [allPosts, searchLogs, averageRewards] = await Promise.all([
      this.firestoreService.getCollection('Posts'),
      this.firestoreService.getCollection('SearchLogs'),
      this.firestoreService.getDocument('Dynamic', 'average_rewards'),
    ]);

    const postsWithReward = allPosts.filter(
      (post: any) => post.reward && post.reward.trim() !== '',
    );
    const lostPosts = allPosts.filter((post: any) => post.type === 'Lost');
    const foundPosts = allPosts.filter((post: any) => post.type === 'Found');
    const resolvedPosts = allPosts.filter(
      (post: any) => post.isResolved === true,
    );

    // Posts in the last 7 days
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const postsLastWeek = allPosts.filter(
      (post: any) => post.timestamp && post.timestamp >= oneWeekAgo,
    );

    // Search logs in the last 7 days
    const searchLogsLastWeek = searchLogs.filter((log: any) => {
      if (!log.timestamp) return false;
      const timestamp = log.timestamp?.toMillis
        ? log.timestamp.toMillis()
        : log.timestamp;
      return timestamp >= oneWeekAgo;
    });

    // Process average rewards data
    const categoryStats = averageRewards
      ? Object.entries(averageRewards)
          .filter(([key]) => key !== 'id')
          .map(([category, data]: [string, any]) => ({
            category,
            totalPostCount: data.totalPostCount || 0,
            totalRewards: data.totalRewards || 0,
            averageReward:
              data.totalPostCount > 0
                ? Math.round((data.totalRewards / data.totalPostCount) * 100) /
                  100
                : 0,
          }))
          .sort((a, b) => a.category.localeCompare(b.category))
      : [];

    return {
      totalPosts: allPosts.length,
      lostPosts: lostPosts.length,
      foundPosts: foundPosts.length,
      postsLastWeek: postsLastWeek.length,
      postsWithReward: postsWithReward.length,
      postsWithoutReward: allPosts.length - postsWithReward.length,
      percentageWithReward:
        allPosts.length > 0
          ? Math.round((postsWithReward.length / allPosts.length) * 100)
          : 0,
      searchLogsLastWeek: searchLogsLastWeek.length,
      resolvedPosts: resolvedPosts.length,
      categoryStats,
    };
  }

  @Get('user-metrics')
  async getUserMetrics(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const [partners, partnerLocations] = await Promise.all([
      this.firestoreService.getCollection('Partners'),
      this.firestoreService.getCollection('PartnerLocations'),
    ]);

    let userGrowth: { date: string; count: number }[] = [];
    let totalUsers = 0;

    if (year && month) {
      // Fetch data for specific month (this also returns total count)
      const result = await this.firestoreService.getUserGrowthForMonth(
        parseInt(year, 10),
        parseInt(month, 10),
      );
      userGrowth = result.dailyData;
      totalUsers = result.totalUsers;
    } else {
      // Just get total users count
      totalUsers = await this.firestoreService.getAuthenticatedUsersCount();
    }

    return {
      totalUsers,
      totalPartners: partners.length,
      totalPartnerLocations: partnerLocations.length,
      userGrowth,
    };
  }

  @Get('user-metrics/available-months')
  async getAvailableUserGrowthMonths() {
    const months = await this.firestoreService.getAvailableUserGrowthMonths();
    return { months };
  }

  @Get('latest-searches')
  async getLatestSearches() {
    const searchLogs = await this.firestoreService.getCollection('SearchLogs');

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const searchLogsLastWeek = searchLogs.filter((log: any) => {
      if (!log.timestamp) return false;
      const timestamp = log.timestamp?.toMillis
        ? log.timestamp.toMillis()
        : log.timestamp;
      return timestamp >= oneWeekAgo;
    });

    const latestSearches = searchLogs
      .filter((log: any) => log.timestamp)
      .sort((a: any, b: any) => {
        const aTime = a.timestamp?.toMillis
          ? a.timestamp.toMillis()
          : a.timestamp;
        const bTime = b.timestamp?.toMillis
          ? b.timestamp.toMillis()
          : b.timestamp;
        return bTime - aTime;
      })
      .slice(0, 10)
      .map((log: any) => ({
        id: log.id,
        query: log.searchValue || 'N/A',
        timestamp: log.timestamp?.toMillis
          ? log.timestamp.toMillis()
          : log.timestamp,
      }));

    return {
      latestSearches,
      searchLogsLastWeek: searchLogsLastWeek.length,
    };
  }

  @Get('access-codes')
  async getAccessCodes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const accessCodes =
      await this.firestoreService.getCollection('AccessCodes');

    // Sort by createdAt descending
    const sortedAccessCodes = accessCodes
      .sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis
          ? a.createdAt.toMillis()
          : a.createdAt || 0;
        const bTime = b.createdAt?.toMillis
          ? b.createdAt.toMillis()
          : b.createdAt || 0;
        return bTime - aTime;
      })
      .map((code: any) => ({
        id: code.id,
        code: code.code || code.id,
        used: code.used || code.isUsed || false,
        usedByEmail: code.usedByEmail || null,
        createdAt: code.createdAt?.toMillis
          ? code.createdAt.toMillis()
          : code.createdAt,
      }));

    const totalCount = sortedAccessCodes.length;
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedCodes = sortedAccessCodes.slice(startIndex, endIndex);

    return {
      accessCodes: paginatedCodes,
      totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalCount / limitNum),
    };
  }

  @Post('access-codes/create')
  async createAccessCodes(@Body() body: { count: number }, @Request() req) {
    const { count } = body;

    if (!count || count < 1 || count > 100) {
      throw new Error('Count must be between 1 and 100');
    }

    const createdBy = req.user?.email || 'admin';
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = this.generateAccessCode();
      await this.firestoreService.addDocument('AccessCodes', {
        code,
        isUsed: false,
        createdAt: new Date(),
        createdBy,
      });
      codes.push(code);
    }

    return {
      message: `Successfully created ${count} access code(s)`,
      codes,
    };
  }

  @Post('recalculate-average-rewards')
  async recalculateAverageRewards() {
    const allPosts = await this.firestoreService.getCollection('Posts');

    // Initialize counters for each category
    const rewardData: Record<
      string,
      { totalPostCount: number; totalRewards: number }
    > = {};

    // Process each post
    allPosts.forEach((post: any) => {
      const category = post.category;
      const reward = Number(post.reward) || 0;

      if (!category || typeof category !== 'string') {
        return;
      }

      // Initialize category if it doesn't exist
      if (!rewardData[category]) {
        rewardData[category] = { totalPostCount: 0, totalRewards: 0 };
      }

      // Increment counters
      rewardData[category].totalPostCount++;
      rewardData[category].totalRewards += reward;
    });

    // Update the average_rewards document in Firestore
    await this.firestoreService.updateDocument(
      'Dynamic',
      'average_rewards',
      rewardData,
    );

    return {
      message: 'Average rewards recalculated successfully',
      totalPosts: allPosts.length,
      categories: Object.keys(rewardData),
    };
  }

  private generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  @Get(':collection')
  async getCollection(@Param('collection') collection: string) {
    return this.firestoreService.getCollection(collection);
  }

  @Get(':collection/:id')
  async getDocument(
    @Param('collection') collection: string,
    @Param('id') id: string,
  ) {
    return this.firestoreService.getDocument(collection, id);
  }

  @Get(':collection/query/:field')
  async queryDocuments(
    @Param('collection') collection: string,
    @Param('field') field: string,
    @Query('operator') operator: any,
    @Query('value') value: any,
  ) {
    return this.firestoreService.queryDocuments(
      collection,
      field,
      operator || '==',
      value,
    );
  }
}
