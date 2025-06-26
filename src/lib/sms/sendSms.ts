export async function sendSms(phone: string, message: string) {
  // MOCK: Always "send" OTP 123456 for testing
  console.log(
    `[MOCK SMS] to ${phone}: 123456 (pretend sent, real message: "${message}")`
  );
  // In production, replace this with Twilio or another SMS provider!
}
