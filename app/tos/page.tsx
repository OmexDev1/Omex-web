import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Omex bot Terms of Service",
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-border/40 bg-muted/10 p-6 sm:p-7">
      <h2 className="m-0 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">{children}</div>
    </section>
  )
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="ml-5 list-disc space-y-2 text-muted-foreground">{children}</ul>
}

function Subheading({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-2 text-base font-semibold text-foreground sm:text-lg">{children}</h3>
}

export default function TOSPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header (matches the Privacy page style) */}
        <header className="mb-10 space-y-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
            <p className="max-w-2xl text-muted-foreground">
              These Terms of Service (“Agreement”) govern your access to and use of Omex’s services, including the Omex
              Discord bot and any related websites or features.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border/50 bg-muted/20 px-3 py-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Effective date:</span> 19 August 2025
            </span>
            <span className="rounded-md border border-border/50 bg-muted/20 px-3 py-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Jurisdiction:</span> United Kingdom
            </span>

            <div className="grow" />

            {/* “Button instead of 4. Omex” — I’m treating this as a prominent CTA button */}
            <Button asChild className="rounded-full">
              <Link href="https://discord.gg/Omex" target="_blank" rel="noreferrer">
                Omex Support
              </Link>
            </Button>
          </div>
        </header>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-xl">Agreement details</CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              <Section id="acceptance" title="1. Acceptance of Terms">
                <p>
                  By accessing or using Omex’s services (“Services”), including adding the Omex bot (“Bot”) to a Discord
                  server, you (“User”) acknowledge that you have read, understood, and agree to be bound by these Terms
                  of Service (“Agreement”). If you do not agree to these terms, you must discontinue use immediately.
                </p>
              </Section>

              <Section id="definitions" title="2. Definitions">
                <List>
                  <li>
                    <strong>“Omex,” “we,” “us,” “our”</strong> refers to Omex and its operators.
                  </li>
                  <li>
                    <strong>“Services”</strong> means all products, features, applications, websites, or other services
                    operated by Omex.
                  </li>
                  <li>
                    <strong>“User,” “you,” “your”</strong> refers to any individual or entity using our Services.
                  </li>
                </List>
              </Section>

              <Section id="compliance" title="3. Compliance with Laws and Discord Policies">
                <List>
                  <li>
                    You must comply with all applicable local, national, and international laws and regulations when
                    using the Services.
                  </li>
                  <li>
                    Use of the Services is also subject to Discord’s Terms of Service and Community Guidelines. Any
                    violation of those policies constitutes a violation of this Agreement.
                  </li>
                  <li>
                    You should report violations of applicable laws or Discord policies to us via email at{" "}
                    <a className="text-foreground underline underline-offset-4" href="mailto:contact@Omex.live">
                      contact@Omex.live
                    </a>
                    .
                  </li>
                </List>
              </Section>

              <Section id="website-activities" title="4. Prohibited Website Activities">
                <p>You are prohibited from engaging in the following activities in relation to any Omex website:</p>
                <List>
                  <li>Attempting to exploit, hack, damage, disrupt, or gain unauthorised access to our systems</li>
                  <li>Using the website for unlawful, fraudulent, or malicious purposes</li>
                  <li>Scraping, collecting, or harvesting information for unauthorised purposes</li>
                  <li>Framing or mirroring any portion of the website without prior written authorisation</li>
                  <li>
                    Copying, reproducing, distributing, or claiming ownership of content, design elements, or
                    proprietary information
                  </li>
                </List>
              </Section>

              <Section id="bot-activities" title="5. Prohibited Bot Activities and Enforcement">
                <Subheading>5.1 Prohibited activities</Subheading>
                <p>You are prohibited from, including but not limited to:</p>
                <List>
                  <li>Violating Discord’s Terms of Service or Community Guidelines</li>
                  <li>Reproducing, duplicating, copying, selling, or reselling any portion of the Bot’s functionality</li>
                  <li>Facilitating or encouraging others to reproduce Omex services or features</li>
                  <li>Exploiting bugs, glitches, or vulnerabilities</li>
                  <li>Operating a server previously terminated for policy violations</li>
                  <li>Organising or encouraging harassment, raids, or targeted attacks against Omex or its staff</li>
                </List>

                <Subheading>5.2 Enforcement rights</Subheading>
                <p>We may, at our sole discretion:</p>
                <List>
                  <li>Terminate or restrict access to the Services (temporarily or permanently), with or without notice</li>
                  <li>Remove, disable, or restrict availability of content or features</li>
                  <li>Investigate suspected violations and cooperate with law enforcement where required</li>
                  <li>Pursue remedies available at law or in equity</li>
                </List>

                <Subheading>5.3 No waiver</Subheading>
                <p>
                  Failure to enforce a right or provision of this Agreement does not constitute a waiver of that right
                  or provision.
                </p>
              </Section>

              <Section id="refunds" title="6. Refunds and Account Restrictions">
                <p>
                  Where a refund is provided under any circumstances, we reserve the right to restrict or suspend access
                  to the Services at our discretion, including applying account limitations where necessary to prevent
                  abuse.
                </p>
              </Section>

              <Section id="license" title="7. Licence and Subscription Terms">
                <Subheading>7.1 Purchase of licence</Subheading>
                <p>
                  If you purchase a subscription or make a one-time payment for the Services, you are granted a
                  non-exclusive, revocable, non-transferable licence to access and use the Services in accordance with
                  this Agreement.
                </p>

                <Subheading>7.2 Agreement to terms</Subheading>
                <p>
                  Purchase or use of the Services constitutes your explicit agreement to be bound by this Agreement as a
                  condition of access and use.
                </p>
              </Section>

              <Section id="transfers" title="8. Transfers">
                <List>
                  <li>
                    Each subscription may include one (1) free transfer of the Bot to a different Discord server (where
                    offered). Additional transfers may require a new subscription.
                  </li>
                  <li>Any additional transfers or overrides are subject to our sole discretion.</li>
                  <li>
                    We are not liable for loss resulting from deletion or termination of a Discord server by Discord or
                    any third party.
                  </li>
                  <li>Completed transfers are final and cannot be undone.</li>
                </List>
              </Section>

              <Section id="third-parties" title="9. Third-Party Relationships and Disclaimer">
                <List>
                  <li>
                    We are not affiliated with, and do not control, Discord servers or communities that use our Services.
                  </li>
                  <li>
                    Users are responsible for the conduct, content, and actions within their servers. We disclaim
                    liability for third-party actions to the maximum extent permitted by law.
                  </li>
                </List>
              </Section>

              <Section id="availability" title="10. Service Availability and Termination">
                <List>
                  <li>We do not guarantee uninterrupted, continuous, or secure access to the Services.</li>
                  <li>
                    We may refuse service, terminate accounts, or restrict access where conduct violates law, threatens
                    integrity of the Services, or conflicts with our business interests.
                  </li>
                  <li>
                    Provisions that should survive termination will do so (including ownership, disclaimers, indemnity,
                    and limitation of liability).
                  </li>
                </List>
              </Section>

              <Section id="indemnity" title="11. Indemnification">
                <p>
                  You agree to defend, indemnify, and hold harmless Omex and its operators from and against claims,
                  liabilities, damages, losses, and expenses (including reasonable legal fees) arising from your use of
                  the Services or your violation of this Agreement.
                </p>
              </Section>

              <Section id="liability" title="12. Limitation of Liability">
                <p className="font-medium text-foreground">
                  To the maximum extent permitted by law, Omex will not be liable for any indirect, incidental, special,
                  consequential, or punitive damages, including loss of profits, data, use, goodwill, or other
                  intangible losses, resulting from your access to or use of (or inability to access or use) the
                  Services.
                </p>
              </Section>

              <Section id="amendments" title="13. Amendments to Agreement">
                <List>
                  <li>We may modify, amend, or update this Agreement at any time at our sole discretion.</li>
                  <li>Your continued use after amendments are posted constitutes acceptance of the updated terms.</li>
                  <li>Violation of amended terms may result in immediate termination of access to the Services.</li>
                </List>
              </Section>

              <Section id="misc" title="14. Miscellaneous">
                <List>
                  <li>
                    If any provision of this Agreement is held invalid or unenforceable, the remainder remains in full
                    force and effect.
                  </li>
                  <li>
                    This Agreement constitutes the entire agreement between you and Omex regarding the Services and
                    supersedes prior agreements or understandings.
                  </li>
                </List>
              </Section>

              <div className="pt-2 space-y-3">
                <div className="rounded-xl border border-border/40 bg-muted/15 p-5">
                  <p className="m-0 text-sm text-muted-foreground">
                    Questions about these Terms? Email{" "}
                    <a className="text-foreground underline underline-offset-4" href="mailto:contact@Omex.live">
                      contact@Omex.live
                    </a>{" "}
                    or contact us via{" "}
                    <Link className="text-foreground underline underline-offset-4" href="https://discord.gg/Omex">
                      discord.gg/Omex
                    </Link>
                    .
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Last updated: <span className="text-foreground">19 August 2025</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
