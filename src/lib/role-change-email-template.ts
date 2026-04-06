import { UserRole } from '../models/user.model';

interface RoleChangeEmailTemplateParams {
  recipientName?: string;
  previousRole: UserRole;
  nextRole: UserRole;
  supportName: string;
  supportEmail: string;
  websiteUrl: string;
}

export interface RoleChangeEmailTemplateResult {
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

function getRoleLabel(role: UserRole): string {
  if (role === 'admin') {
    return 'Admin';
  }

  if (role === 'organizer') {
    return 'Organizer';
  }

  return 'Attendee';
}

function getRoleDescription(role: UserRole): string {
  if (role === 'admin') {
    return 'You can now access the admin dashboard and manage platform governance features.';
  }

  if (role === 'organizer') {
    return 'You can now create events and manage organizer workflows in your dashboard.';
  }

  return 'Your account now uses the attendee experience for browsing events and managing RSVPs.';
}

export function renderRoleChangeEmailTemplate(
  params: RoleChangeEmailTemplateParams
): RoleChangeEmailTemplateResult {
  const greetingName = params.recipientName?.trim() || 'there';
  const previousRoleLabel = getRoleLabel(params.previousRole);
  const nextRoleLabel = getRoleLabel(params.nextRole);
  const roleDescription = getRoleDescription(params.nextRole);
  const subject = `Your EventForge role was updated to ${nextRoleLabel}`;

  const text = `Hi ${greetingName},

Your EventForge account role has been updated.

Previous role: ${previousRoleLabel}
New role: ${nextRoleLabel}

${roleDescription}

If you were not expecting this change or need help, contact ${params.supportName} at ${params.supportEmail}.

Dashboard: ${params.websiteUrl}

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
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.7;">Your EventForge account role has been updated by the platform team.</p>
          <p style="margin:0 0 8px;color:#0f172a;font-size:14px;"><strong>Previous role:</strong> ${escapeHtml(previousRoleLabel)}</p>
          <p style="margin:0 0 16px;color:#0f172a;font-size:14px;"><strong>New role:</strong> ${escapeHtml(nextRoleLabel)}</p>
          <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.7;">${escapeHtml(roleDescription)}</p>
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
