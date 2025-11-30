import { prisma } from '@/config/database';

export class SalesRepository {
  async getOrdersInDateRange(userId: string, startDate: Date, endDate: Date) {
    const result = await prisma.order.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount?.toNumber() || 0;
  }

  async getOrdersByDay(
    userId: string,
    days: number,
  ): Promise<Array<{ date: Date; total: number }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        amount: true,
      },
    });

    // Group by day
    const groupedByDay = new Map<string, number>();

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      groupedByDay.set(dateKey, 0);
    }

    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const current = groupedByDay.get(dateKey) || 0;
      groupedByDay.set(dateKey, current + order.amount.toNumber());
    });

    return Array.from(groupedByDay.entries()).map(([dateStr, total]) => ({
      date: new Date(dateStr),
      total,
    }));
  }

  async getOrdersByWeek(
    userId: string,
    weeks: number,
  ): Promise<Array<{ weekStart: Date; total: number }>> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - weeks * 7);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        amount: true,
      },
    });

    // Group by week
    const groupedByWeek = new Map<string, number>();

    // Initialize weeks
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (weeks - i) * 7);
      // Get Sunday of that week
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekKey = weekStart.toISOString().split('T')[0];
      groupedByWeek.set(weekKey, 0);
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const weekStart = new Date(orderDate);
      weekStart.setDate(orderDate.getDate() - orderDate.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekKey = weekStart.toISOString().split('T')[0];

      if (groupedByWeek.has(weekKey)) {
        const current = groupedByWeek.get(weekKey) || 0;
        groupedByWeek.set(weekKey, current + order.amount.toNumber());
      }
    });

    return Array.from(groupedByWeek.entries()).map(([weekStr, total]) => ({
      weekStart: new Date(weekStr),
      total,
    }));
  }

  async getOrdersByMonth(
    userId: string,
    months: number,
  ): Promise<Array<{ monthStart: Date; total: number }>> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        amount: true,
      },
    });

    // Group by month
    const groupedByMonth = new Map<string, number>();

    // Initialize months
    for (let i = 0; i < months; i++) {
      const monthStart = new Date(now);
      monthStart.setMonth(now.getMonth() - (months - i - 1));
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthKey = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;
      groupedByMonth.set(monthKey, 0);
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;

      if (groupedByMonth.has(monthKey)) {
        const current = groupedByMonth.get(monthKey) || 0;
        groupedByMonth.set(monthKey, current + order.amount.toNumber());
      }
    });

    return Array.from(groupedByMonth.entries()).map(([monthStr, total]) => ({
      monthStart: new Date(monthStr + '-01'),
      total,
    }));
  }
}

export const salesRepository = new SalesRepository();
