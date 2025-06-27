import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = twilio(accountSid, authToken);

export async function sendVerification(phone: string) {
  if (!phone || !phone.startsWith("+")) {
    throw new Error("Phone number is missing or not in E.164 format");
  }
  if (!verifyServiceSid.startsWith("VA")) {
    throw new Error("Verify Service SID must start with 'VA'");
  }
  console.log(
    `Sending verification to ${phone} using service ${verifyServiceSid}`
  );

  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        channel: "sms",
        to: phone,
      });
    console.log("Twilio Verify success:", verification.sid);
    return verification.sid;
  } catch (error) {
    console.error("Twilio error:", error);
    throw error;
  }
}
