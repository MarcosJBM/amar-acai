import { prisma } from '@/config/database';
import type { Order, Prisma } from '@/generated/prisma';
import { HttpError } from '@/utils/http-error';

export class OrderRepository {
  async createOrder(
    userId: string,
    amount: number,
    weight: number,
  ): Promise<Order> {
    return prisma.order.create({
      data: {
        userId,
        amount,
        weight,
      },
    });
  }

  async updateOrder(
    id: string,
    userId: string,
    data: Prisma.OrderUpdateInput,
  ): Promise<Order> {
    // First check if order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new HttpError(404, 'Order not found');
    }

    if (order.userId !== userId) {
      throw new HttpError(
        403,
        'You do not have permission to update this order',
      );
    }

    return prisma.order.update({
      where: { id },
      data,
    });
  }

  async deleteOrder(id: string, userId: string): Promise<Order> {
    // First check if order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new HttpError(404, 'Order not found');
    }

    if (order.userId !== userId) {
      throw new HttpError(
        403,
        'You do not have permission to delete this order',
      );
    }

    return prisma.order.delete({
      where: { id },
    });
  }

  async findPaginated(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Order[]> {
    const skip = (page - 1) * limit;

    return prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countOrders(userId: string): Promise<number> {
    return prisma.order.count({
      where: { userId },
    });
  }
}

export const orderRepository = new OrderRepository();
