# RefillX

> Gas delivered to your door — Lagos, Nigeria

## Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Data | TanStack Query |
| Fonts | DM Sans (Google Fonts) |
| Auth SMS | Termii API (mocked) |
| Payments | Paystack (mocked) |
| Push | Expo Notifications / FCM |

## Running the app

```bash
cd refillx
npm install
npx expo start
```

Scan the QR code with Expo Go (Android/iOS) or run on a simulator.

## Environment Variables

Create a `.env` file in the `refillx/` directory:

```env
EXPO_PUBLIC_TERMII_KEY=your_termii_api_key
EXPO_PUBLIC_PAYSTACK_KEY=pk_live_your_paystack_key
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

Without these keys the app runs in **mock mode** — OTPs always verify, payments are simulated, and no real SMS is sent.

---

## Integration Setup

### 1. Termii (OTP SMS)

1. Sign up at [termii.com](https://termii.com)
2. Go to **Settings → API Keys** and copy your key
3. Set `EXPO_PUBLIC_TERMII_KEY=<your_key>` in `.env`
4. The SDK call lives in `services/termii.ts` — swap the mock when ready

### 2. Paystack (Payments)

1. Sign up at [paystack.com](https://paystack.com)
2. Go to **Settings → API Keys** and copy your **Public Key**
3. Set `EXPO_PUBLIC_PAYSTACK_KEY=pk_live_...` in `.env`
4. For card/transfer flows, initialise via `services/paystack.ts`
5. Use `react-native-paystack-webview` or Paystack's mobile SDK for the in-app checkout sheet

### 3. Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → **Enable APIs**:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
3. Create an **API Key** under Credentials
4. Set `EXPO_PUBLIC_GOOGLE_MAPS_KEY=<your_key>` in `.env`
5. In `app.json`, add to the android/ios sections:

```json
"android": {
  "config": {
    "googleMaps": { "apiKey": "YOUR_KEY" }
  }
},
"ios": {
  "config": {
    "googleMapsApiKey": "YOUR_KEY"
  }
}
```

---

## App Structure

```
app/
  index.tsx               — redirects to auth or main
  _layout.tsx             — root layout, fonts, providers
  (auth)/
    phone.tsx             — phone number entry
    otp.tsx               — 4-digit OTP verification
  (main)/
    _layout.tsx           — bottom tab navigation
    index.tsx             — home screen
    refill.tsx            — Step 1: cylinder selection
    refill-step2.tsx      — Step 2: pickup details & time
    refill-step3.tsx      — Step 3: confirm & payment
    swap.tsx              — swap type selection
    swap-details.tsx      — swap details & confirm
    confirmation.tsx      — order placed screen
    tracking.tsx          — live order tracking
    profile.tsx           — user profile & settings
constants/
  theme.ts                — colors, spacing, typography
  prices.ts               — gas prices, fees, mock data
store/
  authStore.ts            — auth state (Zustand)
  orderStore.ts           — order drafts & active order
services/
  api.ts                  — mock API (swap for real backend)
  termii.ts               — OTP SMS integration
  paystack.ts             — payment integration
```

## Mock OTP

In dev/mock mode, **any 4-digit code except `0000`** will verify successfully. Code `0000` simulates a wrong code.

## Prices (mock)

| Size | Price |
|---|---|
| 2kg | ₦2,200 |
| 4kg | ₦5,000 |
| 6kg | ₦6,800 |
| 12.5kg | ₦13,500 |
| 25kg | ₦26,000 |

Delivery: ₦1,500 (express) · ₦800 (scheduled)  
Handling: ₦500 flat
