/**
 * Shared HTML email wrapper — SouthernVT brand.
 *
 * Inline styles only (email client compatibility).
 * Colors: cream #f7efe1, forest green #1f3b2f, gold #d8b15d, slate #334155.
 */
export function emailHtmlWrapper(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f2e8d6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f2e8d6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1f3b2f;border-radius:16px 16px 0 0;padding:24px 32px;">
              <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.2em;text-transform:uppercase;color:#d8b15d;">SouthernVT</p>
              <p style="margin:4px 0 0;font-size:13px;color:#eee5d6;letter-spacing:0.06em;">Southern Vermont's independent local guide</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:32px;border-left:1px solid #e8dfc8;border-right:1px solid #e8dfc8;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f7efe1;border-radius:0 0 16px 16px;border:1px solid #e8dfc8;border-top:none;padding:20px 32px;">
              <p style="margin:0;font-size:12px;color:#7a6a55;line-height:1.6;">
                SouthernVT &mdash; an independent guide to Southern Vermont.<br />
                Questions? Reply to this email and we'll be in touch.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Reusable inline-styled elements */

export function h1(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:24px;font-weight:normal;color:#1f3b2f;line-height:1.3;">${text}</h1>`;
}

export function p(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.7;">${text}</p>`;
}

export function eyebrow(text: string): string {
  return `<p style="margin:0 0 8px;font-size:10px;font-weight:bold;letter-spacing:0.2em;text-transform:uppercase;color:#1f3b2f;">${text}</p>`;
}

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid #e8dfc8;margin:24px 0;" />`;
}

export function calloutBox(content: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:16px 0;">
    <tr>
      <td style="background-color:#f7efe1;border-left:3px solid #d8b15d;border-radius:0 8px 8px 0;padding:16px 20px;">
        ${content}
      </td>
    </tr>
  </table>`;
}

export function primaryButton(label: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td style="background-color:#1f3b2f;border-radius:999px;padding:12px 28px;">
        <a href="${href}" style="color:#f7efe1;font-size:14px;font-weight:bold;text-decoration:none;letter-spacing:0.04em;">${label}</a>
      </td>
    </tr>
  </table>`;
}

export function metaRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;font-size:13px;color:#7a6a55;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:13px;color:#334155;vertical-align:top;">${value || "—"}</td>
  </tr>`;
}

export function metaTable(rows: Array<[string, string]>): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:16px 0;">
    ${rows.map(([label, value]) => metaRow(label, value)).join("\n")}
  </table>`;
}

export function sign(): string {
  return p("— The SouthernVT team");
}
