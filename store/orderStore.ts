import { create } from 'zustand';

export type OrderStatus = 'confirmed' | 'agent_assigned' | 'en_route' | 'arrived' | 'delivered';
export type DeliveryMode = 'now' | 'schedule';
export type PaymentMethod = 'cash' | 'card' | 'bank' | 'bank_transfer';
export type SwapType = 'swap' | 'new';

interface RefillOrder {
  type: 'refill';
  cylinderSize: string;
  cylinderCount: number;
  cylinderCondition: string;
  customSize: string;
  deliveryMode: DeliveryMode;
  scheduledDate: string;
  scheduledSlot: string;
  address: string;
  gasPrice: number;
  deliveryFee: number;
  handlingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  orderNumber: string;
  status: OrderStatus;
}

interface SwapOrder {
  type: 'swap';
  swapType: SwapType;
  currentSize: string;
  newSize: string;
  priceDiff: number;
  cylinderCount: number;
  address: string;
  paymentMethod: PaymentMethod;
  orderNumber: string;
  status: OrderStatus;
}

type ActiveOrder = RefillOrder | SwapOrder | null;

interface OrderState {
  activeOrder: ActiveOrder;
  refillDraft: Partial<RefillOrder>;
  swapDraft: Partial<SwapOrder>;
  setRefillDraft: (data: Partial<RefillOrder>) => void;
  setSwapDraft: (data: Partial<SwapOrder>) => void;
  placeOrder: (order: ActiveOrder) => void;
  updateStatus: (status: OrderStatus) => void;
  clearOrder: () => void;
  clearDrafts: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  activeOrder: null,
  refillDraft: {},
  swapDraft: {},
  setRefillDraft: (data) =>
    set((state) => ({ refillDraft: { ...state.refillDraft, ...data } })),
  setSwapDraft: (data) =>
    set((state) => ({ swapDraft: { ...state.swapDraft, ...data } })),
  placeOrder: (order) => set({ activeOrder: order }),
  updateStatus: (status) =>
    set((state) => ({
      activeOrder: state.activeOrder ? { ...state.activeOrder, status } : null,
    })),
  clearOrder: () => set({ activeOrder: null }),
  clearDrafts: () => set({ refillDraft: {}, swapDraft: {} }),
}));
