export interface Pedido {
  id: string;
  valor: number;
  peso: number;
  data: string;
}

// Função para gerar dados mockados de pedidos
export function getMockPedidos(): Pedido[] {
  const pedidos: Pedido[] = [];
  const hoje = new Date();

  // Gerar pedidos dos últimos 30 dias
  for (let i = 0; i < 45; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - Math.floor(Math.random() * 30));

    pedidos.push({
      id: `PED-${String(i + 1).padStart(4, '0')}`,
      valor: Math.floor(Math.random() * 50) + 10, // R$ 10 a R$ 60
      peso: Math.floor(Math.random() * 800) + 200, // 200g a 1000g
      data: data.toISOString(),
    });
  }

  return pedidos.sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );
}

// Função para calcular vendas por período
export function calcularVendas(pedidos: Pedido[]) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());

  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const vendasDia = pedidos
    .filter(p => {
      const dataPedido = new Date(p.data);
      dataPedido.setHours(0, 0, 0, 0);
      return dataPedido.getTime() === hoje.getTime();
    })
    .reduce((sum, p) => sum + p.valor, 0);

  const vendasSemana = pedidos
    .filter(p => {
      const dataPedido = new Date(p.data);
      return dataPedido >= inicioSemana;
    })
    .reduce((sum, p) => sum + p.valor, 0);

  const vendasMes = pedidos
    .filter(p => {
      const dataPedido = new Date(p.data);
      return dataPedido >= inicioMes;
    })
    .reduce((sum, p) => sum + p.valor, 0);

  return { vendasDia, vendasSemana, vendasMes };
}

// Função para obter dados para gráfico diário (últimos 7 dias)
export function getDadosGraficoDiario(pedidos: Pedido[]) {
  const dados = [];
  const hoje = new Date();

  for (let i = 6; i >= 0; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    data.setHours(0, 0, 0, 0);

    const vendas = pedidos
      .filter(p => {
        const dataPedido = new Date(p.data);
        dataPedido.setHours(0, 0, 0, 0);
        return dataPedido.getTime() === data.getTime();
      })
      .reduce((sum, p) => sum + p.valor, 0);

    dados.push({
      dia: data.toLocaleDateString('pt-BR', { weekday: 'short' }),
      vendas,
    });
  }

  return dados;
}

// Função para obter dados para gráfico semanal (últimas 4 semanas)
export function getDadosGraficoSemanal(pedidos: Pedido[]) {
  const dados = [];
  const hoje = new Date();

  for (let i = 3; i >= 0; i--) {
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - i * 7 - hoje.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);

    const vendas = pedidos
      .filter(p => {
        const dataPedido = new Date(p.data);
        return dataPedido >= inicioSemana && dataPedido <= fimSemana;
      })
      .reduce((sum, p) => sum + p.valor, 0);

    dados.push({
      semana: `Sem ${4 - i}`,
      vendas,
    });
  }

  return dados;
}

// Função para obter dados para gráfico mensal (últimos 6 meses)
export function getDadosGraficoMensal(pedidos: Pedido[]) {
  const dados = [];
  const hoje = new Date();

  for (let i = 5; i >= 0; i--) {
    const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 0);

    const vendas = pedidos
      .filter(p => {
        const dataPedido = new Date(p.data);
        return dataPedido >= mes && dataPedido <= proximoMes;
      })
      .reduce((sum, p) => sum + p.valor, 0);

    dados.push({
      mes: mes.toLocaleDateString('pt-BR', { month: 'short' }),
      vendas,
    });
  }

  return dados;
}
