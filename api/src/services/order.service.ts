import { orderRepository } from '@/repositories/order.repository';

interface OrderResponse {
  id: string;
  amount: number;
  weight: number;
  date: string;
}

interface PaginatedOrdersResponse {
  orders: OrderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class OrderService {
  async createOrder(
    userId: string,
    amount: number,
    weight: number,
  ): Promise<OrderResponse> {
    const order = await orderRepository.createOrder(userId, amount, weight);

    return {
      id: order.id,
      amount: Number(order.amount),
      weight: order.weight,
      date: order.createdAt.toISOString(),
    };
  }

  async updateOrder(
    orderId: string,
    userId: string,
    data: { amount?: number; weight?: number },
  ): Promise<OrderResponse> {
    const order = await orderRepository.updateOrder(orderId, userId, data);

    return {
      id: order.id,
      amount: Number(order.amount),
      weight: order.weight,
      date: order.createdAt.toISOString(),
    };
  }

  async deleteOrder(orderId: string, userId: string): Promise<void> {
    await orderRepository.deleteOrder(orderId, userId);
  }

  async getOrders(
    userId: string,
    page: number = 1,
  ): Promise<PaginatedOrdersResponse> {
    const limit = 10;
    const orders = await orderRepository.findPaginated(userId, page, limit);
    const total = await orderRepository.countOrders(userId);

    return {
      orders: orders.map(order => ({
        id: order.id,
        amount: Number(order.amount),
        weight: order.weight,
        date: order.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const orderService = new OrderService();
