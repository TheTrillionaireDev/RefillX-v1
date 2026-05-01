export const gasPrices: Record<string, number> = {
  '2kg':    2200,
  '3kg':    3500,
  '4kg':    5000,
  '6kg':    6800,
  '12.5kg': 13500,
  '25kg':   26000,
};

export const cylinderSizes = ['2kg', '4kg', '6kg', '12.5kg'] as const;
export type CylinderSize = (typeof cylinderSizes)[number];

export const deliveryFees = {
  express: 1500,
  scheduled: 800,
};

export const handlingFee = 500;
export const serviceCharge = 200;

export const swapPriceDiffs: Record<string, number> = {
  '6kg_to_12.5kg': 6700,
  '12.5kg_to_6kg': -6700,
  '12.5kg_to_12.5kg': 0,
  '12.5kg_to_25kg': 12500,
  '6kg_to_6kg': 0,
  '25kg_to_12.5kg': -12500,
  '25kg_to_25kg': 0,
};

export const mockAgent = {
  name: 'Emeka',
  rating: 4.9,
  photoUrl: null as null | string,
  phone: '+2348000000000',
  initial: 'E',
};

export const timeSlots = [
  { label: 'Morning slot', time: '8am – 12pm', value: 'morning' },
  { label: 'Afternoon slot', time: '12pm – 4pm', value: 'afternoon' },
  { label: 'Evening slot', time: '4pm – 8pm', value: 'evening' },
];
