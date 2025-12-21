import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL ?? process.env.WEB_APP_URL ?? "http://localhost:3000";

export const sendLoginMail = async (to: string, token: string) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject: "Login to PrimeTrade",
    html: `<center>
            <h1>Please click here to login your PrimeTrade Account</h1>
            <a target="_blank" href="${FRONTEND_URL}/signin?token=${token}">Click here</a>
        </center>`,
  });
};

