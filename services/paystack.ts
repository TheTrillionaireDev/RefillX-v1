// Paystack integration — set EXPO_PUBLIC_PAYSTACK_KEY in .env

export function getPaystackKey(): string {
  return process.env.EXPO_PUBLIC_PAYSTACK_KEY ?? 'pk_test_placeholder';
}

export async function initializePayment(params: {
  email: string;
  amount: number; // in kobo (naira × 100)
  phone: string;
}): Promise<{ authorizationUrl: string; reference: string } | null> {
  const key = getPaystackKey();
  if (key === 'pk_test_placeholder') {
    // Mock
    return {
      authorizationUrl: 'https://paystack.com/mock',
      reference: 'mock_ref_' + Date.now(),
    };
  }
  try {
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email || `${params.phone}@refillx.app`,
        amount: params.amount * 100,
        channels: ['card', 'bank_transfer'],
      }),
    });
    const data = await res.json();
    if (data.status) return data.data;
    return null;
  } catch {
    return null;
  }
}
