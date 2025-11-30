import {
  ChevronLeft,
  ChevronRight,
  Plus,
  SquarePen,
  Trash,
} from 'lucide-react';
import { useState } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import { DeleteDialog } from '@/components/delete-dialog';
import { OrderModal } from '@/components/order-modal';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  type Order,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from '@/store/api/ordersApi';

export function OrdersPage() {
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string>('');

  const { data, isLoading, error } = useGetOrdersQuery(currentPage);

  const [createOrder] = useCreateOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  function handleNewOrder() {
    setSelectedOrder(null);
    setModalOpen(true);
  }

  function handleEditOrder(order: Order) {
    setSelectedOrder(order);
    setModalOpen(true);
  }

  async function handleSaveOrder(order: Omit<Order, 'id'> | Order) {
    try {
      if ('id' in order && order.id) {
        await updateOrder({
          id: order.id,
          data: { amount: order.amount, weight: order.weight },
        }).unwrap();

        toast({
          title: 'Pedido atualizado',
          description: 'Pedido atualizado com sucesso.',
        });
      } else {
        await createOrder({
          amount: order.amount,
          weight: order.weight,
        }).unwrap();

        toast({
          title: 'Pedido criado',
          description: 'Pedido criado com sucesso.',
        });

        setCurrentPage(1);
      }

      setModalOpen(false);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description:
          'Não foi possível criar o pedido, por favor, tente novamente.',
      });
    }
  }

  function handleDeleteOrder(id: string) {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      await deleteOrder(orderToDelete).unwrap();

      toast({
        title: 'Pedido deletado',
        description: 'O pedido foi deletado com sucesso.',
      });

      setDeleteDialogOpen(false);
      setOrderToDelete('');

      if (orders.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description:
          'Não foi possível deletar o pedido, por favor, tente novamente.',
      });
    }
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">
                  {'data' in error &&
                  typeof error.data === 'object' &&
                  error.data &&
                  'message' in error.data
                    ? String(error.data.message)
                    : 'Não foi possível buscar a lista de pedidos, por favor, tente novamente.'}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
                <p className="mt-1 text-gray-600">
                  Gerencie todos os pedidos realizados
                </p>
              </div>

              <Button
                onClick={handleNewOrder}
                className="bg-purple-600 text-white shadow-lg hover:bg-purple-700"
              >
                <Plus />
                Novo Pedido
              </Button>
            </div>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900">
                  Lista de pedidos
                </CardTitle>

                <CardDescription>
                  {pagination?.total ?? 0} pedidos registrados
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="overflow-hidden rounded-lg border border-purple-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50 hover:bg-purple-50">
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
                      {isLoading ? (
                        Array.from({ length: 10 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>

                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>

                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>

                            <TableCell className="text-right">
                              <Skeleton className="ml-auto h-8 w-32" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : orders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="py-8 text-center text-gray-500"
                          >
                            Nenhum pedido encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map(order => (
                          <TableRow
                            key={order.id}
                            className="hover:bg-purple-50/50"
                          >
                            <TableCell className="text-gray-900">
                              R$ {order.amount.toFixed(2)}
                            </TableCell>

                            <TableCell className="text-gray-900">
                              {order.weight}g
                            </TableCell>

                            <TableCell className="text-gray-900">
                              {new Date(order.date).toLocaleDateString(
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
                                  onClick={() => handleEditOrder(order)}
                                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                                >
                                  <SquarePen />
                                  Editar
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <Trash />
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

                {!isLoading && totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Mostrando{' '}
                      {(currentPage - 1) * (pagination?.limit ?? 10) + 1} a{' '}
                      {Math.min(
                        currentPage * (pagination?.limit ?? 10),
                        pagination?.total ?? 0,
                      )}{' '}
                      pedidos de {pagination?.total ?? 0}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="cursor-pointer border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                      >
                        <ChevronLeft />
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
                        className="cursor-pointer border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                      >
                        Próximo
                        <ChevronRight />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <OrderModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveOrder}
        order={selectedOrder}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </AuthGuard>
  );
}
