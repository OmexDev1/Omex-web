import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Pages Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Pages</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/commands"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Commands
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Status
                </Link>
              </li>
              <li>
                <Link href="/updates" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Updates
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Bot Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Bot</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://discord.com/oauth2/authorize?client_id=1413649582340182158&permissions=8&integration_type=0&scope=bot"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Invite
                </Link>
              </li>
              <li>
                <Link
                  href="/commands"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.gg/MYGrrhU6Jb"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Support Server
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            Copyright © {new Date().getFullYear()} Omex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
