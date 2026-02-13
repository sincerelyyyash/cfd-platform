import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL ?? process.env.WEB_APP_URL ?? "http://localhost:3000";

const FROM_EMAIL = "AXIS <noreply@mail.sincerelyyyash.com>";

const buildLoginEmail = (loginUrl: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in to AXIS</title>
</head>
<body style="margin:0;padding:0;background-color:#08080a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08080a;padding:40px 0;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#111114;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px 40px;text-align:center;border-bottom:1px solid #1e1e22;">
              <span style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:2px;">✱ AXIS</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 16px 40px;">
              <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.3;">
                Sign in to your account
              </h1>
              <p style="margin:0 0 28px 0;font-size:15px;color:#a1a1aa;line-height:1.6;">
                Click the button below to securely sign in to AXIS. This link will expire in 10 minutes.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:4px 0 32px 0;">
                    <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#B19EEF;color:#08080a;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.3px;">
                      Sign in to AXIS
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px 0;font-size:13px;color:#71717a;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 8px 0;font-size:12px;color:#B19EEF;word-break:break-all;line-height:1.5;">
                ${loginUrl}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="border-top:1px solid #1e1e22;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:12px;color:#52525b;line-height:1.5;">
                If you didn't request this email, you can safely ignore it.
              </p>
              <p style="margin:0;font-size:11px;color:#3f3f46;line-height:1.5;">
                &copy; ${new Date().getFullYear()} AXIS Protocol. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendLoginMail = async (to: string, token: string) => {
  const loginUrl = `${FRONTEND_URL}/signin?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Sign in to AXIS",
    html: buildLoginEmail(loginUrl),
  });
};

