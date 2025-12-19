"use client";

import { useState } from "react";
import { CreditCard, Trash2, Plus, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
}

interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentMethodsDialog({ open, onOpenChange }: PaymentMethodsDialogProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: "1", brand: "Visa", last4: "1234", expiry: "12/26" },
    { id: "2", brand: "MasterCard", last4: "5678", expiry: "03/27" },
  ]);

  const handleDelete = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id));
    toast({
      title: "Card removed",
      description: "The payment method has been removed from your account.",
    });
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const formData = new FormData(e.currentTarget);
      const newMethod: PaymentMethod = {
        id: Math.random().toString(36).substr(2, 9),
        brand: "Visa", // Mock brand
        last4: (formData.get("cardNumber") as string).slice(-4),
        expiry: formData.get("expiry") as string,
      };
      
      setMethods([...methods, newMethod]);
      setIsAdding(false);
      setIsLoading(false);
      toast({
        title: "Card added",
        description: "Your new payment method has been successfully added.",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Methods</DialogTitle>
          <DialogDescription>
            Manage your saved credit and debit cards.
          </DialogDescription>
        </DialogHeader>

        {!isAdding ? (
          <div className="space-y-4 py-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.brand} •••• {method.last4}
                    </p>
                    <p className="text-xs text-gray-500">Expires {method.expiry}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(method.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 text-gray-600 hover:text-blue-600 hover:border-blue-600"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAdd} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input id="cardHolder" name="cardHolder" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="0000 0000 0000 0000"
                maxLength={16}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input id="expiry" name="expiry" placeholder="MM/YY" maxLength={5} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" name="cvv" placeholder="000" maxLength={3} required />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Card"
                )}
              </Button>
            </div>
          </form>
        )}

        <DialogFooter>
          {!isAdding && (
            <Button variant="secondary" onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
