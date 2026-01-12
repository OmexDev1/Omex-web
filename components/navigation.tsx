"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, BookOpen, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const DOCS_URL = "https://documents.omex.live/"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/f4582f925dc83d4707037e6de7e05fba.webp"
            alt="Omex Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg"
          />

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight sm:text-base">Omex</span>
            <span className="text-xs text-muted-foreground sm:text-sm">Premium Discord bot</span>
          </div>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <div className="flex items-center gap-1 rounded-full border border-border/40 bg-card/50 px-3 py-1.5 shadow-sm backdrop-blur">
            <Link
              href="/commands"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              Commands
            </Link>

            <Link
              href="/status"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              Status
            </Link>

            <Link
              href="/faq"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              FAQ
            </Link>


            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              Docs
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        </div>


        <Button disabled className="hidden cursor-not-allowed opacity-50 md:flex" title="Coming Soon">
          Dashboard
          <span className="ml-2 text-xs">(Soon)</span>
        </Button>


        <Button variant="ghost" size="icon" className="md:hidden" asChild aria-label="Open documentation">
          <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
            <BookOpen className="h-5 w-5" />
          </a>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {isOpen && (
        <>

          <div
            className="fixed inset-0 z-40 animate-in fade-in bg-background/80 backdrop-blur-sm duration-300 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 rounded-2xl border border-border/40 bg-card/95 p-6 shadow-2xl backdrop-blur duration-300 md:hidden">
            <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                className="transition-transform hover:rotate-90"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="ghost"
                size="lg"
                className="w-full justify-start rounded-xl text-base transition-all hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <Link href="/commands" onClick={() => setIsOpen(false)}>
                  Commands
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full justify-start rounded-xl text-base transition-all hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <Link href="/status" onClick={() => setIsOpen(false)}>
                  Status
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full justify-start rounded-xl text-base transition-all hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <Link href="/faq" onClick={() => setIsOpen(false)}>
                  FAQ
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="w-full justify-start rounded-xl text-base transition-all hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <a
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Docs
                  <ExternalLink className="ml-auto h-4 w-4 opacity-70" />
                </a>
              </Button>

              <div className="my-2 border-t border-border/40" />

              <Button
                size="lg"
                className="w-full rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                asChild
              >
                <Link href="https://discord.gg/omex" onClick={() => setIsOpen(false)}>
                  Join Discord
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
