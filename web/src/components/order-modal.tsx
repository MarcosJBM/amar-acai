import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Order } from '@/store/api/ordersApi';

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (order: Omit<Order, 'id'> | Order) => Promise<void>;
  order?: Order | null;
}

export function OrderModal({
  open,
  onOpenChange,
  onSave,
  order,
}: OrderModalProps) {
  const [amount, setAmount] = useState<string>(order?.amount.toString() || '');
  const [weight, setWeight] = useState<string>(order?.weight.toString() || '');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const newOrder = {
      ...(order && { id: order.id }),
      amount: Number.parseFloat(amount),
      weight: Number.parseFloat(weight),
      date: order?.date || new Date().toISOString(),
    };

    await onSave(newOrder);

    onOpenChange(false);

    setAmount('');
    setWeight('');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-purple-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-purple-900">
            {order ? 'Editar Pedido' : 'Novo Pedido'}
          </DialogTitle>

          <DialogDescription>
            {order
              ? 'Atualize as informações do pedido'
              : 'Informe os valores do novo pedido'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={event => void handleSubmit(event)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700">
                Valor (R$)
              </Label>

              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-gray-700">
                Peso (g)
              </Label>

              <Input
                id="weight"
                type="number"
                placeholder="0"
                value={weight}
                onChange={event => setWeight(event.target.value)}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-linear-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
            >
              {order ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
