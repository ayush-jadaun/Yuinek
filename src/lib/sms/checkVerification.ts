import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = twilio(accountSid, authToken);

/**
 * Checks the verification code sent to the user
 * @param phone E.164 format (e.g., "+15555555555")
 * @param code The OTP code the user entered
 */
export async function checkVerification(phone: string, code: string) {
  try {
    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phone,
        code,
      });
    // status can be "approved" or "pending"
    return verificationCheck.status === "approved";
  } catch (error) {
    console.error("Verification check failed:", error);
    throw error;
  }
}
