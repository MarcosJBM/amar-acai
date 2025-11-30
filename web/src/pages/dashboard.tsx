import { Calendar, ChartNoAxesColumnIncreasing, Clock } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { AuthGuard } from '@/components/auth-guard';
import { Sidebar } from '@/components/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  useGetSalesChartsQuery,
  useGetSalesSummaryQuery,
} from '@/store/api/salesApi';

export function DashboardPage() {
  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useGetSalesSummaryQuery();
  const {
    data: charts,
    isLoading: isChartsLoading,
    error: chartsError,
  } = useGetSalesChartsQuery();

  const isLoading = isSummaryLoading || isChartsLoading;
  const error = summaryError || chartsError;

  const displaySummary = summary ?? {
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0,
  };
  const displayCharts = charts ?? {
    daily: [],
    weekly: [],
    monthly: [],
  };

  if (error) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">Erro</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-red-600">
                {'data' in error &&
                typeof error.data === 'object' &&
                error.data &&
                'message' in error.data
                  ? String(error.data.message)
                  : 'Não foi possível carregar os gráficos, por favor, tente novamente.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">Visão geral das suas vendas</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-purple-200 bg-linear-to-br from-purple-50 to-white">
                <CardHeader className="pb-3">
                  <CardDescription className="font-medium text-purple-700">
                    Vendas Hoje
                  </CardDescription>

                  <CardTitle className="text-4xl text-purple-900">
                    {isLoading
                      ? 'Loading...'
                      : `R$ ${displaySummary.dailySales.toFixed(2)}`}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Clock />
                    Atualizado agora
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-linear-to-br from-purple-50 to-white">
                <CardHeader className="pb-3">
                  <CardDescription className="font-medium text-purple-700">
                    Vendas na Semana
                  </CardDescription>

                  <CardTitle className="text-4xl text-purple-900">
                    {isLoading
                      ? 'Loading...'
                      : `R$ ${displaySummary.weeklySales.toFixed(2)}`}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Calendar />
                    Últimos 7 dias
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-linear-to-br from-purple-50 to-white">
                <CardHeader className="pb-3">
                  <CardDescription className="font-medium text-purple-700">
                    Vendas no Mês
                  </CardDescription>

                  <CardTitle className="text-4xl text-purple-900">
                    {isLoading
                      ? 'Loading...'
                      : `R$ ${displaySummary.monthlySales.toFixed(2)}`}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <ChartNoAxesColumnIncreasing size={20} />
                    Mês atual
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-900">
                    Vendas Diárias
                  </CardTitle>

                  <CardDescription>Últimos 7 dias</CardDescription>
                </CardHeader>

                <CardContent>
                  <ChartContainer
                    config={{
                      sales: {
                        label: 'Vendas',
                        color: '#8b5cf6',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={displayCharts.daily}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        <XAxis dataKey="day" stroke="#6b7280" />

                        <YAxis stroke="#6b7280" />

                        <ChartTooltip content={<ChartTooltipContent />} />

                        <Bar
                          dataKey="sales"
                          fill="#8b5cf6"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-900">
                    Vendas Semanais
                  </CardTitle>

                  <CardDescription>Últimas 4 semanas</CardDescription>
                </CardHeader>

                <CardContent>
                  <ChartContainer
                    config={{
                      sales: {
                        label: 'Vendas',
                        color: '#a78bfa',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={displayCharts.weekly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        <XAxis dataKey="week" stroke="#6b7280" />

                        <YAxis stroke="#6b7280" />

                        <ChartTooltip content={<ChartTooltipContent />} />

                        <Bar
                          dataKey="sales"
                          fill="#a78bfa"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-purple-200 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-purple-900">
                    Vendas Mensais
                  </CardTitle>

                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>

                <CardContent>
                  <ChartContainer
                    config={{
                      sales: {
                        label: 'Vendas',
                        color: '#7c3aed',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={displayCharts.monthly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        <XAxis dataKey="month" stroke="#6b7280" />

                        <YAxis stroke="#6b7280" />

                        <ChartTooltip content={<ChartTooltipContent />} />

                        <Bar
                          dataKey="sales"
                          fill="#7c3aed"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
