import { apiSlice } from './apiSlice';

export interface SalesSummary {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
}

export interface DailyChartData {
  day: string;
  sales: number;
}

export interface WeeklyChartData {
  week: string;
  sales: number;
}

export interface MonthlyChartData {
  month: string;
  sales: number;
}

export interface SalesCharts {
  daily: DailyChartData[];
  weekly: WeeklyChartData[];
  monthly: MonthlyChartData[];
}

export const salesApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSalesSummary: builder.query<SalesSummary, void>({
      query: () => '/sales/summary',
      providesTags: ['Sales'],
    }),
    getSalesCharts: builder.query<SalesCharts, void>({
      query: () => '/sales/charts',
      providesTags: ['Sales'],
    }),
  }),
});

export const { useGetSalesSummaryQuery, useGetSalesChartsQuery } = salesApi;
