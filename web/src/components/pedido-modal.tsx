import type React from 'react';
import { useEffect, useState } from 'react';

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
import type { Pedido } from '@/libs/mock-data';

interface PedidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pedido: Omit<Pedido, 'id'> | Pedido) => void;
  pedido?: Pedido | null;
}

export function PedidoModal({
  open,
  onOpenChange,
  onSave,
  pedido,
}: PedidoModalProps) {
  const [valor, setValor] = useState('');
  const [peso, setPeso] = useState('');

  useEffect(() => {
    if (pedido) {
      setValor(pedido.valor.toString());
      setPeso(pedido.peso.toString());
    } else {
      setValor('');
      setPeso('');
    }
  }, [pedido, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoPedido = {
      ...(pedido && { id: pedido.id }),
      valor: Number.parseFloat(valor),
      peso: Number.parseFloat(peso),
      data: pedido?.data || new Date().toISOString(),
    };

    onSave(novoPedido as Pedido);
    onOpenChange(false);
    setValor('');
    setPeso('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-purple-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-purple-900">
            {pedido ? 'Editar Pedido' : 'Novo Pedido'}
          </DialogTitle>
          <DialogDescription>
            {pedido
              ? 'Atualize as informações do pedido'
              : 'Preencha os dados do novo pedido'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-gray-700">
                Valor (R$)
              </Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={valor}
                onChange={e => setValor(e.target.value)}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso" className="text-gray-700">
                Peso (g)
              </Label>
              <Input
                id="peso"
                type="number"
                placeholder="0"
                value={peso}
                onChange={e => setPeso(e.target.value)}
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
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
            >
              {pedido ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
