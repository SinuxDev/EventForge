interface SuspensionStatusEmailTemplateParams {
  recipientName?: string;
  isSuspended: boolean;
  supportName: string;
  supportEmail: string;
  websiteUrl: string;
}

export interface SuspensionStatusEmailTemplateResult {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSubject(isSuspended: boolean): string {
  return isSuspended
    ? 'Your EventForge account has been suspended'
    : 'Your EventForge account has been reactivated';
}

function getBodyCopy(isSuspended: boolean): string {
  return isSuspended
    ? 'Your EventForge account has been suspended. While this is active, access to key account features may be limited.'
    : 'Your EventForge account has been reactivated. You can now sign in and continue using the platform again.';
}

export function renderSuspensionStatusEmailTemplate(
  params: SuspensionStatusEmailTemplateParams
): SuspensionStatusEmailTemplateResult {
  const greetingName = params.recipientName?.trim() || 'there';
  const subject = getSubject(params.isSuspended);
  const bodyCopy = getBodyCopy(params.isSuspended);

  const text = `Hi ${greetingName},

${bodyCopy}

If you were not expecting this change or need help, contact ${params.supportName} at ${params.supportEmail}.

EventForge: ${params.websiteUrl}

EventForge`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:22px 24px;border-bottom:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;">EventForge Account</p>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.35;color:#0f172a;">${escapeHtml(subject)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 12px;color:#334155;font-size:15px;line-height:1.7;">Hi ${escapeHtml(greetingName)},</p>
          <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.7;">${escapeHtml(bodyCopy)}</p>
          <a href="${params.websiteUrl}" style="display:inline-block;padding:11px 16px;border-radius:8px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">Open EventForge</a>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
          If you were not expecting this change or need help, contact ${escapeHtml(params.supportName)} at ${escapeHtml(params.supportEmail)}.
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject,
    text,
    html,
  };
}
