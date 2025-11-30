import { apiSlice } from './apiSlice';

export interface Order {
  id: string;
  amount: number;
  weight: number;
  date: string;
}

export interface PaginatedOrders {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateOrderRequest {
  amount: number;
  weight: number;
}

export interface UpdateOrderRequest {
  amount?: number;
  weight?: number;
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query<PaginatedOrders, number>({
      query: (page = 1) => `/orders?page=${page}`,
      providesTags: result =>
        result
          ? [
              ...result.orders.map(({ id }) => ({
                type: 'Order' as const,
                id,
              })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: data => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, 'Sales'],
    }),
    updateOrder: builder.mutation<
      Order,
      { id: string; data: UpdateOrderRequest }
    >({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'Sales',
      ],
    }),
    deleteOrder: builder.mutation<void, string>({
      query: id => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'Sales',
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
