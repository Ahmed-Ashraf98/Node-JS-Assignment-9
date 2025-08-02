/**
 * @param {string} code : The OTP Code
 * @param {number} codeDuration : OTP Duration
 * @param {string} name : The < To Name > user
 * @param {string} message : The message
 * @returns email template
 */
export const OTP_Template = (
  code,
  codeDuration,
  name,
  text
) => ` <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f4f6f9;">
      <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f9" style="padding:40px 0;">
        <tr><td align="center">
          <table width="500" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;padding:40px 30px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            <tr><td>
              <h2 style="color:#222;font-size:24px;">Email Verification</h2>
              <p style="color:#555;font-size:16px;">Hi ${name}, ${message}. It’s valid for ${codeDuration} minutes:</p>
              <div style="background:#f1f3f6;color:#111;font-size:28px;font-weight:bold;padding:15px 25px;border-radius:8px;letter-spacing:6px;display:inline-block;margin:20px 0;">
                ${code}
              </div>
              <p style="color:#888;font-size:14px;margin-top:30px;">If you didn’t request this, just ignore this email.</p>
              <p style="color:#ccc;font-size:12px;margin-top:20px;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
  </html>`;
