// src/lib/email/templates/contact-emails.ts
// Contact form emails. Registered in src/lib/email/previews.ts — any new
// email here must add a preview fixture (see the email conventions rule).

import {
  renderEmail,
  heading,
  paragraph,
  primaryButton,
  detailTable,
  internalAlertHtml,
} from "@/lib/email/layout";

export interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}

export function buildContactConfirmationHtml(firstName: string): string {
  return renderEmail({
    preheader: "We've received your message and will get back to you shortly.",
    contentHtml: [
      heading(`Thanks for getting in touch, ${firstName}!`),
      paragraph(
        "We&rsquo;ve received your message and will get back to you shortly. In the meantime, feel free to explore our platform.",
      ),
      primaryButton("https://envrt.com", "Visit envrt.com"),
    ].join(""),
    footerNote: "You're receiving this because you contacted ENVRT via envrt.com/contact.",
  });
}

export function buildContactInternalHtml(data: ContactEmailData): string {
  return internalAlertHtml({
    title: "New contact form submission",
    rows: [
      ["Name", `${data.firstName} ${data.lastName}`],
      ["Email", data.email],
      ["Company", data.company],
      ["Interest", data.interest],
    ],
    bodyHtml: data.message
      ? detailTable([["Message", data.message]])
      : "",
  });
}

