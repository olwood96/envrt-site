interface FeaturedDpp {
  brandName: string;
  productName: string;
  href: string;
}

interface ContactSuccessConfirmationProps {
  firstName: string;
  email: string;
  /**
   * Optional list of curated DPPs to surface under "While you wait".
   * If omitted, a single link to the full collective is shown instead.
   */
  featuredDpps?: FeaturedDpp[];
}

/**
 * Replaces the old checkmark-and-thank-you success state on the contact
 * form. The page now echoes the user's input, gives them something
 * useful to do while they wait for our reply, and offers a fallback
 * email address if they need to correct anything.
 *
 * No response-time promise. No icon. No celebratory framing.
 */
export function ContactSuccessConfirmation({
  firstName,
  email,
  featuredDpps,
}: ContactSuccessConfirmationProps) {
  const greeting = firstName
    ? `Your demo request is in, ${firstName}.`
    : "Your demo request is in.";

  return (
    <div className="text-left">
      {/* Personalised confirmation in body type */}
      <p className="text-base leading-relaxed text-envrt-charcoal">
        {greeting} We&apos;ll email you at{" "}
        <span className="font-medium text-envrt-charcoal">{email}</span>.
      </p>

      {/* While you wait — curated DPPs or a fallback to the collective */}
      <div className="mt-10 border-t border-envrt-charcoal/10 pt-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-envrt-muted">
          While you wait
        </h2>

        {featuredDpps && featuredDpps.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {featuredDpps.map((dpp) => (
              <li key={dpp.href}>
                <a
                  href={dpp.href}
                  className="group flex items-baseline justify-between gap-4 text-sm text-envrt-charcoal hover:text-envrt-teal"
                >
                  <span>
                    <span className="font-medium">{dpp.brandName}</span>
                    <span className="px-1.5 text-envrt-muted">·</span>
                    <span className="text-envrt-charcoal/80">{dpp.productName}</span>
                  </span>
                  <span className="text-envrt-muted transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-envrt-charcoal/80">
            Explore live Digital Product Passports from other fashion brands using ENVRT.{" "}
            <a
              href="/collective"
              className="font-medium text-envrt-teal hover:underline"
            >
              See the collective →
            </a>
          </p>
        )}
      </div>

      {/* Fallback contact route */}
      <p className="mt-8 text-xs text-envrt-muted">
        Got the wrong details? Email us at{" "}
        <a
          href="mailto:info@envrt.com"
          className="text-envrt-teal hover:underline"
        >
          info@envrt.com
        </a>
        .
      </p>
    </div>
  );
}
