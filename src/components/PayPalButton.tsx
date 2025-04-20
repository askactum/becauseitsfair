// Add a type declaration for window.paypal
declare global {
  interface Window {
    paypal?: any;
  }
}

import { useEffect, useRef } from 'react';

interface PayPalButtonProps {
  amount: string;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
  disabled?: boolean;
}

export default function PayPalButton({ amount, onSuccess, onError, disabled }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.paypal || !paypalRef.current || disabled) return;
    paypalRef.current.innerHTML = '';
    window.paypal.Buttons({
      style: {
        color: 'black',
        shape: 'rect',
        label: 'donate',
        height: 45,
      },
      createOrder: (_: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: amount } }],
        });
      },
      onApprove: async (_: any, actions: any) => {
        const details = await actions.order.capture();
        onSuccess(details);
      },
      onError: (err: any) => {
        if (onError) onError(err);
      },
      fundingSource: window.paypal.FUNDING.PAYPAL,
      disableMaxWidth: true,
    }).render(paypalRef.current);
  }, [amount, onSuccess, onError, disabled]);

  return <div ref={paypalRef} style={{ width: '100%' }} />;
}
