import { useEffect, useState } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import { DeleteDialog } from '@/components/delete-dialog';
import { PedidoModal } from '@/components/pedido-modal';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMockPedidos, type Pedido } from '@/lib/mock-data';

const ITEMS_PER_PAGE = 10;

export function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(
    null,
  );
  const [pedidoParaDeletar, setPedidoParaDeletar] = useState<string>('');

  useEffect(() => {
    const pedidosSalvos = localStorage.getItem('pedidos');
    const pedidosData = pedidosSalvos
      ? JSON.parse(pedidosSalvos)
      : getMockPedidos();
    setPedidos(pedidosData);

    if (!pedidosSalvos) {
      localStorage.setItem('pedidos', JSON.stringify(pedidosData));
    }
  }, []);

  const salvarPedidos = (novosPedidos: Pedido[]) => {
    setPedidos(novosPedidos);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
  };

  const handleNovoPedido = () => {
    setPedidoSelecionado(null);
    setModalOpen(true);
  };

  const handleEditarPedido = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  const handleSalvarPedido = (pedido: Omit<Pedido, 'id'> | Pedido) => {
    if ('id' in pedido && pedido.id) {
      // Editar pedido existente
      const novosPedidos = pedidos.map(p => (p.id === pedido.id ? pedido : p));
      salvarPedidos(novosPedidos);
    } else {
      // Criar novo pedido
      const novoPedido = {
        ...pedido,
        id: `PED-${String(pedidos.length + 1).padStart(4, '0')}`,
      };
      salvarPedidos([novoPedido, ...pedidos]);
    }
  };

  const handleDeletarPedido = (id: string) => {
    setPedidoParaDeletar(id);
    setDeleteDialogOpen(true);
  };

  const confirmarDelecao = () => {
    const novosPedidos = pedidos.filter(p => p.id !== pedidoParaDeletar);
    salvarPedidos(novosPedidos);
    setPedidoParaDeletar('');
  };

  // Paginação
  const totalPages = Math.ceil(pedidos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pedidosPaginados = pedidos.slice(startIndex, endIndex);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
                <p className="mt-1 text-gray-600">
                  Gerencie todos os pedidos realizados
                </p>
              </div>
              <Button
                onClick={handleNovoPedido}
                className="bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg hover:from-purple-700 hover:to-purple-600"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novo Pedido
              </Button>
            </div>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900">
                  Lista de Pedidos
                </CardTitle>
                <CardDescription>
                  Total de {pedidos.length} pedidos registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-purple-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50 hover:bg-purple-50">
                        <TableHead className="font-semibold text-purple-900">
                          ID
                        </TableHead>
                        <TableHead className="font-semibold text-purple-900">
                          Valor
                        </TableHead>
                        <TableHead className="font-semibold text-purple-900">
                          Peso
                        </TableHead>
                        <TableHead className="font-semibold text-purple-900">
                          Data
                        </TableHead>
                        <TableHead className="text-right font-semibold text-purple-900">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidosPaginados.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="py-8 text-center text-gray-500"
                          >
                            Nenhum pedido encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        pedidosPaginados.map(pedido => (
                          <TableRow
                            key={pedido.id}
                            className="hover:bg-purple-50/50"
                          >
                            <TableCell className="font-medium text-purple-700">
                              {pedido.id}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              R$ {pedido.valor.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {pedido.peso}g
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {new Date(pedido.data).toLocaleDateString(
                                'pt-BR',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                },
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditarPedido(pedido)}
                                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                                >
                                  <svg
                                    className="mr-1 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeletarPedido(pedido.id)}
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <svg
                                    className="mr-1 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Excluir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Mostrando {startIndex + 1} a{' '}
                      {Math.min(endIndex, pedidos.length)} de {pedidos.length}{' '}
                      pedidos
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Anterior
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map(page => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                            }
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(p => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                      >
                        Próximo
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <PedidoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSalvarPedido}
        pedido={pedidoSelecionado}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmarDelecao}
        pedidoId={pedidoParaDeletar}
      />
    </AuthGuard>
  );
}
