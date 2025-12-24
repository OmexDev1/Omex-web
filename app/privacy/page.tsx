import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Omex bot Privacy Policy",
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

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top header (kept as you liked it, with slightly nicer spacing) */}
        <header className="mb-10 space-y-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
            <p className="max-w-2xl text-muted-foreground">
              This Privacy Policy explains how Omex collects, uses, stores, and protects personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="rounded-md border border-border/50 bg-muted/20 px-3 py-1">
              <span className="font-medium text-foreground">Effective date:</span> 18 March 2025
            </span>
            <span className="rounded-md border border-border/50 bg-muted/20 px-3 py-1">
              <span className="font-medium text-foreground">Jurisdiction:</span> United Kingdom
            </span>
          </div>
        </header>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-xl">Policy details</CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            {/* Cleaner layout: each section is its own “panel”, with consistent spacing */}
            <div className="space-y-6">
              <Section id="introduction" title="1. Introduction">
                <p>
                  This Privacy Policy (“Policy”) explains how Omex (“we”, “us”, “our”) collects, uses, stores, and
                  discloses information about users (“you”, “Users”) when you access or use our services (the
                  “Service”).
                </p>
                <p>
                  By using the Service, you confirm that you have read and understood this Policy. If you believe any
                  part of this Policy is inaccurate, please contact us at{" "}
                  <a className="text-foreground underline underline-offset-4" href="mailto:contact@Omex.live">
                    contact@Omex.live
                  </a>
                  .
                </p>
              </Section>

              <Section id="information-we-collect" title="2. Information we collect">
                <p>We collect and process the following categories of data, where relevant to your use of the Service:</p>

                <Subheading>2.1 User identifiers</Subheading>
                <List>
                  <li>User IDs</li>
                  <li>Usernames</li>
                  <li>Nicknames</li>
                </List>

                <Subheading>2.2 Guild information</Subheading>
                <List>
                  <li>Guild (server) IDs</li>
                  <li>Guild names</li>
                </List>

                <Subheading>2.3 Communication data</Subheading>
                <List>
                  <li>Channel IDs</li>
                  <li>Role IDs</li>
                  <li>Message IDs</li>
                  <li>Message timestamps</li>
                </List>

                <Subheading>2.4 Command arguments</Subheading>
                <p>Information you provide as arguments when executing commands.</p>

                <Subheading>2.5 Historical data</Subheading>
                <List>
                  <li>Last deleted message content (maximum of 19 entries), retained for no more than 2 hours</li>
                  <li>Message edit history (maximum of 19 entries), retained for no more than 2 hours</li>
                </List>
              </Section>

              <Section id="purpose" title="3. Purpose of collection and processing">
                <p>We collect and process data only for legitimate operational purposes, including:</p>
                <List>
                  <li>Facilitating command execution and core functionality</li>
                  <li>Debugging and technical maintenance (e.g., command invocation data)</li>
                  <li>
                    Supporting features such as <code className="rounded bg-muted/30 px-1 py-0.5">namehistory</code>{" "}
                    (nickname/username changes) and{" "}
                    <code className="rounded bg-muted/30 px-1 py-0.5">gnames</code> (guild name changes)
                  </li>
                  <li>Data aggregation necessary for system operation</li>
                </List>
              </Section>

              <Section id="retention" title="4. Data retention">
                <p>
                  We retain data only for as long as needed to provide the Service and for the specific retention
                  periods described in this Policy (for example, limited historical data retained for up to 2 hours).
                </p>
              </Section>

              <Section id="third-party" title="5. Third-party disclosure">
                <List>
                  <li>We do not sell, trade, rent, or otherwise share your personal information with third parties.</li>
                  <li>We may disclose information where required by law, regulation, or to comply with legal process.</li>
                </List>
              </Section>

              <Section id="rights" title="6. Your rights (UK)">
                <p>
                  Depending on your circumstances, you may have rights under UK GDPR and the Data Protection Act 2018,
                  including the right to access and the right to erasure.
                </p>

                <Subheading>6.1 Right to erasure</Subheading>
                <p>
                  You may request deletion of your data by emailing{" "}
                  <a className="text-foreground underline underline-offset-4" href="mailto:contact@Omex.live">
                    contact@Omex.live
                  </a>
                  . Requests should:
                </p>
                <List>
                  <li>Specify the information you want deleted</li>
                  <li>Provide sufficient evidence of account ownership</li>
                  <li>Allow up to 14 days for processing</li>
                </List>

                <Subheading>6.2 Right to access</Subheading>
                <p>
                  You may request a copy of data we store about you by emailing{" "}
                  <a className="text-foreground underline underline-offset-4" href="mailto:contact@Omex.live">
                    contact@Omex.live
                  </a>
                  . We may respond within up to 7 days from receiving your request.
                </p>

                <Subheading>6.3 Self-service data management</Subheading>
                <List>
                  <li>
                    You may clear nickname and username change history via the{" "}
                    <code className="rounded bg-muted/30 px-1 py-0.5">namehistory</code> command (where available).
                  </li>
                  <li>
                    Guild administrators may clear guild name change history via the{" "}
                    <code className="rounded bg-muted/30 px-1 py-0.5">gnames</code> command (where available).
                  </li>
                </List>
              </Section>

              <Section id="security" title="7. Security">
                <p>
                  We use reasonable technical and organisational measures to help protect your data. However, no method
                  of transmission or storage is completely secure, and we cannot guarantee absolute security.
                </p>
              </Section>

              <Section id="amendments" title="8. Policy amendments">
                <List>
                  <li>We may update this Policy from time to time without prior notice.</li>
                  <li>Continued use of the Service after changes are published constitutes acceptance of the updates.</li>
                  <li>Breaches of our Terms of Service (including this Policy) may result in termination of access.</li>
                </List>
              </Section>

              <Section id="contact" title="9. Contact">
                <p>
                  If you have questions or concerns about this Policy, contact us at{" "}
                  <a className="text-foreground underline underline-offset-4" href="mailto:contact@Omex.live">
                    contact@Omex.live
                  </a>
                  .
                </p>

                <div className="mt-2 rounded-lg border border-border/40 bg-muted/20 p-4">
                  <p className="m-0">
                    Prefer Discord support? Join{" "}
                    <Link className="text-foreground underline underline-offset-4" href="https://discord.gg/Omex">
                      discord.gg/Omex
                    </Link>
                    .
                  </p>
                </div>
              </Section>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Last updated: <span className="text-foreground">18 March 2025</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
