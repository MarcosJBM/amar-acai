import { format, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

import { salesRepository } from '@/repositories/sales.repository';

interface SalesSummary {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
}

interface DailySalesChart {
  day: string;
  sales: number;
}

interface WeeklySalesChart {
  week: string;
  sales: number;
}

interface MonthlySalesChart {
  month: string;
  sales: number;
}

interface SalesCharts {
  daily: DailySalesChart[];
  weekly: WeeklySalesChart[];
  monthly: MonthlySalesChart[];
}

export class SalesService {
  async getSummary(userId: string): Promise<SalesSummary> {
    const now = new Date();

    // Daily sales: from start of today to now
    const dailySales = await salesRepository.getOrdersInDateRange(
      userId,
      startOfDay(now),
      now,
    );

    // Weekly sales: from start of week (Sunday) to now
    const weeklySales = await salesRepository.getOrdersInDateRange(
      userId,
      startOfWeek(now),
      now,
    );

    // Monthly sales: from start of month to now
    const monthlySales = await salesRepository.getOrdersInDateRange(
      userId,
      startOfMonth(now),
      now,
    );

    return {
      dailySales,
      weeklySales,
      monthlySales,
    };
  }

  async getCharts(userId: string): Promise<SalesCharts> {
    // Daily chart: Last 7 days
    const dailyData = await salesRepository.getOrdersByDay(userId, 7);
    const daily = dailyData.map(d => ({
      day: format(d.date, 'EEE').toLowerCase(), // "mon", "tue", "wed", ...
      sales: d.total,
    }));

    // Weekly chart: Last 4 weeks
    const weeklyData = await salesRepository.getOrdersByWeek(userId, 4);
    const weekly = weeklyData
      .map((w, i) => ({
        week: `Week ${i + 1}`,
        sales: w.total,
      }))
      .reverse(); // Most recent week should be last

    // Monthly chart: Last 6 months
    const monthlyData = await salesRepository.getOrdersByMonth(userId, 6);
    const monthly = monthlyData.map(m => ({
      month: format(m.monthStart, 'MMM').toLowerCase(), // "jan", "feb", ...
      sales: m.total,
    }));

    return {
      daily,
      weekly,
      monthly,
    };
  }
}

export const salesService = new SalesService();
