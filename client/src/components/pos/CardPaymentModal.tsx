import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface CardPaymentModalProps {
  open: boolean;
  amount: number;
  onClose: () => void;
  onSubmit: (cardDetails: { cardNumber: string; cardHolder: string; expiry: string; cvv: string }) => void;
}

export function CardPaymentModal({ open, amount, onClose, onSubmit }: CardPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // Only allow alphabets and spaces in card holder name
  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
    setCardHolder(value);
  };
  const [expiry, setExpiry] = useState("");

  // Mask expiry input to MM/YY format
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiry(value);
  };
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit({ cardNumber, cardHolder, expiry, cvv });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Enter Card Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              required
              maxLength={19}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Card Holder Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={cardHolder}
              onChange={handleCardHolderChange}
              required
              placeholder="Name on Card"
              pattern="[A-Za-z ]+"
              title="Only alphabets are allowed"
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Expiry</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={expiry}
                onChange={handleExpiryChange}
                required
                maxLength={5}
                placeholder="MM/YY"
                autoComplete="off"
                inputMode="numeric"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
                required
                maxLength={4}
                placeholder="CVV"
                min={0}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 border border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Pay QR ${amount.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
