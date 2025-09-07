import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_BASE_URL = process.env.APP_BASE_URL ?? "http://localhost:8000/api/v1";

export const sendLoginMail = async (to: string, token: string) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject: "Login link",
    html: `<center>
            <h1>Please click here to login</h1>
            <a target="_blank" href="${APP_BASE_URL}/signin/verify?token=${token}">Click here</a>
        </center>`,
  });
};

