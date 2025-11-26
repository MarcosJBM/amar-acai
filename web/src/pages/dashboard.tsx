import { useEffect, useState } from 'react';
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
  calcularVendas,
  getDadosGraficoDiario,
  getDadosGraficoMensal,
  getDadosGraficoSemanal,
  getMockPedidos,
  type Pedido,
} from '@/lib/mock-data';

export function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [vendas, setVendas] = useState({
    vendasDia: 0,
    vendasSemana: 0,
    vendasMes: 0,
  });

  useEffect(() => {
    // Carregar pedidos do localStorage ou usar dados mockados
    const pedidosSalvos = localStorage.getItem('pedidos');
    const pedidosData = pedidosSalvos
      ? JSON.parse(pedidosSalvos)
      : getMockPedidos();
    setPedidos(pedidosData);
    setVendas(calcularVendas(pedidosData));

    // Salvar dados mockados se não existirem
    if (!pedidosSalvos) {
      localStorage.setItem('pedidos', JSON.stringify(pedidosData));
    }
  }, []);

  const dadosDiario = getDadosGraficoDiario(pedidos);
  const dadosSemanal = getDadosGraficoSemanal(pedidos);
  const dadosMensal = getDadosGraficoMensal(pedidos);

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

            {/* Cards de resumo */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader className="pb-3">
                  <CardDescription className="font-medium text-purple-700">
                    Vendas Hoje
                  </CardDescription>
                  <CardTitle className="text-4xl text-purple-900">
                    R$ {vendas.vendasDia.toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Atualizado agora
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader className="pb-3">
                  <CardDescription className="font-medium text-purple-700">
                    Vendas na Semana
                  </CardDescription>
                  <CardTitle className="text-4xl text-purple-900">
                    R$ {vendas.vendasSemana.toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Últimos 7 dias
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader className="pb-3">
                  <CardDescription className="font-medium text-purple-700">
                    Vendas no Mês
                  </CardDescription>
                  <CardTitle className="text-4xl text-purple-900">
                    R$ {vendas.vendasMes.toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Mês atual
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
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
                      vendas: {
                        label: 'Vendas',
                        color: '#8b5cf6',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosDiario}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="dia" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="vendas"
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
                      vendas: {
                        label: 'Vendas',
                        color: '#a78bfa',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosSemanal}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="semana" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="vendas"
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
                      vendas: {
                        label: 'Vendas',
                        color: '#7c3aed',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosMensal}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="mes" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="vendas"
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
