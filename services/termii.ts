// Termii OTP integration — swap mock with real API key via EXPO_PUBLIC_TERMII_KEY

export async function sendOtpSms(phone: string): Promise<boolean> {
  const apiKey = process.env.EXPO_PUBLIC_TERMII_KEY;
  if (!apiKey) {
    // Mock mode
    console.log('[termii mock] OTP sent to', phone);
    return true;
  }
  try {
    const res = await fetch('https://api.ng.termii.com/api/sms/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        message_type: 'NUMERIC',
        to: phone,
        from: 'RefillX',
        channel: 'dnd',
        pin_attempts: 3,
        pin_time_to_live: 5,
        pin_length: 4,
        pin_placeholder: '<pin>',
        message_text: 'Your RefillX code is <pin>. Valid for 5 minutes.',
        pin_type: 'NUMERIC',
      }),
    });
    const data = await res.json();
    return data.status === 'Message Sent';
  } catch {
    return false;
  }
}
