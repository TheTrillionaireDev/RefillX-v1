import { mockAgent } from '@/constants/prices';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function generateOrderNumber() {
  return 'RFX' + Math.floor(10000 + Math.random() * 90000);
}

export const api = {
  async sendOtp(phone: string): Promise<{ success: boolean }> {
    await delay(1200);
    console.log('[mock] OTP sent to', phone);
    return { success: true };
  },

  async verifyOtp(phone: string, code: string): Promise<{ success: boolean; user?: { name: string; address: string } }> {
    await delay(1000);
    if (code === '0000') return { success: false };
    return {
      success: true,
      user: {
        name: 'Glory',
        address: 'Murtomo, zone 6, Line 4, Osun State, Nigeria',
      },
    };
  },

  async placeOrder(_order: object): Promise<{ success: boolean; orderNumber: string }> {
    await delay(1500);
    return { success: true, orderNumber: generateOrderNumber() };
  },

  async getAgent() {
    await delay(800);
    return mockAgent;
  },

  async getOrderStatus(_orderNumber: string) {
    await delay(500);
    return { status: 'confirmed' };
  },
};
