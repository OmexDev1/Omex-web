import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-10 space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Refund Policy</h1>
            <p className="max-w-2xl text-muted-foreground">
              This Refund Policy explains the circumstances under which refunds may or may not be issued for Omex
              services.
            </p>

            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Last updated:</span> 14 August 2024
            </p>
          </header>

          <div className="space-y-8">
            {/* Overview */}
            <section className="rounded-xl border border-border/40 bg-muted/10 p-6">
              <h2 className="text-2xl font-semibold mb-3">1. Overview</h2>
              <p className="text-muted-foreground leading-7">
                When we refer to “Omex”, “we”, “us”, or “our”, we are referring to the Omex project and its operators.
                The term “Services” refers to any paid or premium features provided through the Omex Discord bot.
              </p>
            </section>

            {/* Refund Eligibility */}
            <section className="rounded-xl border border-border/40 bg-muted/10 p-6">
              <h2 className="text-2xl font-semibold mb-3">2. Refund Eligibility</h2>
              <p className="text-muted-foreground mb-4">
                Refunds may be considered only if none of the conditions listed in Section 3 apply and the request is
                submitted within the allowed timeframe.
              </p>

              <p className="text-muted-foreground">
                Refund requests must be made within <strong className="text-foreground">24 hours</strong> of purchase.
              </p>
            </section>

            {/* Non-Refundable Circumstances */}
            <section className="rounded-xl border border-border/40 bg-muted/10 p-6">
              <h2 className="text-2xl font-semibold mb-3">3. Non-Refundable Circumstances</h2>
              <p className="text-muted-foreground mb-4">
                No refunds will be issued if any of the following conditions apply:
              </p>

              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>You attempt to bypass a ban or blacklist using alternate accounts</li>
                <li>You engage in disrespectful, abusive, or harassing behaviour toward Omex, its developers, or moderators</li>
                <li>You purchase premium for a server that already has premium access</li>
                <li>The server has executed any Omex commands after the premium purchase</li>
                <li>More than 24 hours have passed since the purchase was completed</li>
                <li>We determine or are notified of malicious intent related to the refund request</li>
                <li>You provide forged, false, or misleading payment information</li>
                <li>You are a current or former blacklisted user of Omex</li>
                <li>You violate Omex rules or Discord server rules after purchase</li>
              </ul>
            </section>

            {/* Enforcement */}
            <section className="rounded-xl border border-border/40 bg-muted/10 p-6">
              <h2 className="text-2xl font-semibold mb-3">4. Enforcement & Discretion</h2>
              <p className="text-muted-foreground leading-7">
                Omex reserves the right to deny refund requests at its sole discretion. Abuse of the refund system may
                result in permanent suspension or blacklist from all Omex services.
              </p>
            </section>

            {/* Contact */}
            <section className="rounded-xl border border-border/40 bg-muted/10 p-6">
              <h2 className="text-2xl font-semibold mb-3">5. Contact</h2>
              <p className="text-muted-foreground leading-7">
                If you have questions regarding this Refund Policy or wish to submit a refund request, please contact us
                through our official Omex support server or via email.
              </p>

              <p className="mt-3 text-muted-foreground">
                <strong className="text-foreground">Support Email:</strong>{" "}
                <a
                  href="mailto:support@omex.live"
                  className="underline underline-offset-4 text-foreground"
                >
                  support@omex.bot
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
