"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  ArrowRight,
  Sparkles,
  Lock,
  Puzzle,
  Headphones,
  Heart,
} from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { useEffect, useMemo, useState } from "react"

type Review = {
  name: string
  badge: boolean
  members: string
  quote: string
  role: string
  avatar: string
  accent?: string
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const protectionFeatures = [
    {
      title: "Filters",
      description: "Keep any chat clean with our many automated filtering options.",
      image: "/images/features/Filters.png",
    },
    {
      title: "Fake Permissions",
      description: "Remove all dangerous Discord permissions that can be used for malicious reasons through API.",
      image: "/images/features/fakepermissions.png",
    },
    {
      title: "Anti-Nuke",
      description: "Easily prevent your server from malicious attacks and griefing, with a customizable threshold set by you.",
      image: "/images/features/Anti-Nuke.png",
    },
    {
      title: "Anti-Raid",
      description:
        "Protect against targeted bot raids on your server, with our mass join, avatar and account age anti-raid filters.",
      image: "/images/features/AntiRaid.png",
    },
  ] as const

  const integrations = [
    {
      name: "SoundCloud",
      icon: "/images/integrations/soundcloud.png",
      accent: "from-orange-500/15 via-orange-500/5 to-transparent",
      iconBox: "border-orange-500/30 bg-orange-500/10",
      highlight: ["Songs", "Feeds", "New Posts"] as const,
      copy: "Search Songs. Track Feeds. Notify any channel about New Posts.",
    },
    {
      name: "TikTok",
      icon: "/images/integrations/tiktok.png",
      accent: "from-fuchsia-500/15 via-cyan-500/5 to-transparent",
      iconBox: "border-fuchsia-500/30 bg-fuchsia-500/10",
      highlight: ["Profiles", "Feeds", "New Posts"] as const,
      copy: "Search Profiles. Track Feeds. Notify any channel about New Posts.",
    },
    {
      name: "Last.fm",
      icon: "/images/integrations/lastfm.png",
      accent: "from-red-500/15 via-red-500/5 to-transparent",
      iconBox: "border-red-500/30 bg-red-500/10",
      highlight: ["Scrobbles", "Charts", "Now Playing"] as const,
      copy: "Track Scrobbles. View Charts. Post Now Playing updates automatically.",
    },
    {
      name: "Spotify",
      icon: "/images/integrations/spotify.png",
      accent: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      iconBox: "border-emerald-500/30 bg-emerald-500/10",
      highlight: ["Playlists", "Search", "Alerts"] as const,
      copy: "Search tracks fast. Manage Playlists. Set Alerts for new releases.",
    },
  ] as const

  const marqueeItems = useMemo(() => [...integrations, ...integrations], [integrations])

  const renderHighlightedCopy = (text: string, highlights: readonly string[]) => {
    const tokenized = highlights.reduce((acc, h) => acc.replaceAll(h, `__${h}__`), text)
    const parts = tokenized.split("__")
    return parts.map((chunk, idx) =>
      idx % 2 === 1 ? (
        <span key={`${chunk}-${idx}`} className="text-primary/90">
          {chunk}
        </span>
      ) : (
        <span key={`${chunk}-${idx}`}>{chunk}</span>
      )
    )
  }

  const showcase = [
    {
      icon: Headphones,
      heading: "Personal channels with Voicemaster",
      subheading: "Temporary personalized voice channels for your community.",
      cardTitle: "Voicemaster Interface",
      cardCopy:
        "Powerful control for your personal voice channel, with an intuitive, built-in chat interface.",
      image: "/images/integrations/Interface.1.png",
      imageFit: "object-contain" as const,
    },
  ] as const

  const reviews: readonly Review[] = [
    {
      name: "Frxsty",
      badge: true,
      members: "frxsty_255",
      quote:
        "Setup was insanely quick. Filters, anti-raid, and permissions safety all worked out of the box — exactly what I needed.",
      role: "Server Admin",
      avatar: "/images/av/Frxsty.png",
    },
    {
      name: "Tom",
      badge: false,
      members: "Tom.2045",
      quote:
        "We have been using Omex for a while now after switching from Dyno. We had tens of thousands of logs that we thought we'd be sacrificing, when in reality the switch has done nothing but massively improve our community.",
      role: "Staff Lead",
      avatar: "/images/av/tom.png",
    },
  ] as const

  const heroReview = reviews[0]
  const rightStack = reviews.slice(1, 3)
  const restReviews = reviews.slice(3)

  return (
    <main className="min-h-screen">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Omex The Ultimate Discord
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Management Solution
              </span>
            </h1>
          </div>

          <p
            className={`mx-auto mt-4 max-w-2xl px-4 text-pretty text-base leading-relaxed text-muted-foreground transition-all delay-200 duration-1000 sm:mt-6 sm:text-lg lg:text-xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Meet the premier platform for modern Discord communities. Powerful moderation, intelligent automation, and premium
            features designed to elevate every server.
          </p>

          <div
            className={`mt-8 flex flex-col items-center justify-center gap-3 px-4 transition-all delay-500 duration-1000 sm:mt-10 sm:flex-row sm:gap-4 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <Button
              size="lg"
              className="group h-11 w-full rounded-full px-8 text-base transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 sm:h-12 sm:w-auto"
              asChild
            >
              <Link href="https://discord.com/api/oauth2/authorize" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-zinc-400" />
                <span>Invite Bot</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-11 w-full rounded-full bg-transparent px-8 text-base transition-all hover:scale-105 hover:bg-primary/5 sm:h-12 sm:w-auto"
              asChild
            >
              <Link href="https://discord.gg/omex" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Support Server</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Protection grid */}
      <section className="px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div
              className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-card/30 shadow-sm backdrop-blur transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "120ms" }}
            >
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Premium Moderation and Security</h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
              We provide you with the best tools, to keep your community clean and secure.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-2">
            {protectionFeatures.map((item, i) => {
              const isFakePermissions = item.title === "Fake Permissions"
              const textOnTop = i === 0 || i === 3
              const imageOnTop = i === 1

              return (
                <div
                  key={item.title}
                  className={`relative overflow-hidden rounded-[32px] border border-border/40 bg-card/40 shadow-lg backdrop-blur transition-all duration-700 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${200 + i * 120}ms` }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />

                  <div className="flex min-h-[420px] flex-col p-7 sm:min-h-[460px] sm:p-8">
                    {textOnTop ? (
                      <div>
                        <h3 className="text-xl font-semibold sm:text-2xl">{item.title}</h3>
                        <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {item.description}
                        </p>
                      </div>
                    ) : (
                      <div className={`flex ${imageOnTop ? "justify-center" : "justify-start"}`}>
                        <div
                          className={
                            isFakePermissions
                              ? "relative mt-1 h-[160px] w-[160px] sm:h-[180px] sm:w-[180px]"
                              : "relative h-[230px] w-full sm:h-[260px]"
                          }
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className={isFakePermissions ? "object-contain" : "object-cover"}
                            priority={i === 0}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex-1" />

                    {textOnTop ? (
                      <div className="flex justify-center">
                        <div className="relative h-[240px] w-full sm:h-[270px]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className={i === 0 ? "object-contain" : "object-cover"}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold sm:text-2xl">{item.title}</h3>
                        <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              className="group h-11 rounded-full border-border/50 bg-card/30 px-6 text-sm backdrop-blur transition-all hover:bg-card/40"
              asChild
            >
              <Link href="/commands" className="flex items-center gap-2">
                <span className="text-muted-foreground">100+ more commands</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Integrations (auto-moving marquee) */}
      <section className="px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div
              className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-card/30 shadow-sm backdrop-blur transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "120ms" }}
            >
              <Puzzle className="h-6 w-6 text-muted-foreground" />
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Integrations with your favorite Platforms
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
              Effortlessly track, view, search, play, notify updates and more from many platforms.
            </p>
          </div>

          <div className="relative mt-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

            <div className="omex-marquee">
              <div className="omex-marquee__track flex gap-6 pr-6">
                {marqueeItems.map((it, idx) => (
                  <div
                    key={`${it.name}-${idx}`}
                    className="relative h-[210px] w-[360px] shrink-0 overflow-hidden rounded-[28px] border border-border/40 bg-card/40 shadow-lg backdrop-blur"
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${it.accent}`} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    <div className="relative p-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border ${it.iconBox}`}
                        >
                          <Image src={it.icon} alt={`${it.name} icon`} width={28} height={28} className="object-contain" />
                        </div>
                        <div className="text-lg font-semibold">{it.name}</div>
                      </div>

                      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                        {renderHighlightedCopy(it.copy, it.highlight)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .omex-marquee {
            overflow: hidden;
          }
          .omex-marquee__track {
            width: max-content;
            animation: omexMarquee 22s linear infinite;
          }
          @keyframes omexMarquee {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .omex-marquee__track {
              animation: none;
              transform: none;
            }
          }
        `}</style>
      </section>

      {/* Voicemaster showcase */}
      <section className="px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-14 sm:space-y-20">
          {showcase.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={s.heading}>
                <div className="text-center">
                  <div
                    className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-card/30 shadow-sm backdrop-blur transition-all duration-700 ${
                      isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                    }`}
                    style={{ transitionDelay: `${120 + idx * 80}ms` }}
                  >
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{s.heading}</h2>
                  <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                    {s.subheading}
                  </p>
                </div>

                <div
                  className={`mx-auto mt-10 overflow-hidden rounded-[36px] border border-border/40 bg-card/30 shadow-lg backdrop-blur transition-all duration-700 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${220 + idx * 100}ms` }}
                >
                  <div className="grid grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
                    <div className="flex flex-col justify-center p-8 sm:p-10">
                      <div className="text-primary/90">{s.cardTitle}</div>
                      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {s.cardCopy}
                      </p>
                    </div>

                    <div className="relative p-6 sm:p-8">
                      <div className="relative h-[240px] w-full sm:h-[300px] lg:h-[340px]">
                        <Image
                          src={s.image}
                          alt={s.cardTitle}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className={s.imageFit}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div
              className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-card/30 shadow-sm backdrop-blur transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "120ms" }}
            >
              <Heart className="h-6 w-6 text-muted-foreground" />
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Loved and Trusted by our users</h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
              Real feedback from users using Omex every day.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {heroReview ? <ReviewCard review={heroReview} big isVisible={isVisible} delayMs={200} /> : null}

            <div className="grid gap-6">
              {rightStack.map((r, idx) => (
                <ReviewCard key={r.name} review={r} isVisible={isVisible} delayMs={260 + idx * 120} />
              ))}
            </div>
          </div>

          {restReviews.length > 0 ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {restReviews.map((r, idx) => (
                <ReviewCard key={r.name} review={r} isVisible={isVisible} delayMs={520 + idx * 120} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ✅ NEW: CTA section (like your screenshot) */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div
            className={`relative overflow-hidden rounded-[40px] border border-border/40 bg-card/30 shadow-lg backdrop-blur transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            {/* soft glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_55%)]" />

            {/* dotted corner accents */}
            <div className="pointer-events-none absolute -left-16 bottom-10 h-44 w-72 opacity-40 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:8px_8px]" />
            <div className="pointer-events-none absolute -right-16 top-10 h-44 w-72 opacity-40 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:8px_8px]" />

            <div className="relative flex flex-col items-center justify-center px-6 py-14 text-center sm:px-10 sm:py-16">
              <p className="text-sm text-muted-foreground sm:text-base">
                Enhance your community&apos;s experience.
              </p>
              <h3 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Get Omex in your server today.
              </h3>

              <div className="mt-8">
                <Button
                  className="h-10 rounded-full px-6 text-sm shadow-sm"
                  asChild
                >
                  <Link href="https://discord.com/api/oauth2/authorize">
                    Get started
                  </Link>
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
        </div>
      </section>
    </main>
  )
}

function ReviewCard({
  review,
  big = false,
  isVisible,
  delayMs,
}: {
  review: Review
  big?: boolean
  isVisible: boolean
  delayMs: number
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[32px] border border-border/40 bg-card/40 shadow-lg backdrop-blur transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
      <div className={`flex h-full flex-col p-7 sm:p-8 ${big ? "min-h-[440px]" : "min-h-[210px]"}`}>
        <ReviewHeader name={review.name} badge={review.badge} members={review.members} avatar={review.avatar} />
        <blockquote className={`mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base ${big ? "mt-6" : ""}`}>
          “{review.quote}”
        </blockquote>
        <div className="flex-1" />
        <ReviewFooter role={review.role} avatar={review.avatar} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </div>
  )
}

function ReviewHeader({
  name,
  members,
  avatar,
  badge,
}: {
  name: string
  members: string
  avatar: string
  badge: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/40 bg-card/40">
          <Image src={avatar} alt={`${name} avatar`} fill sizes="40px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold sm:text-base">{name}</div>
            {badge ? (
              <span className="inline-flex h-5 items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 text-[11px] text-emerald-200/90">
                ✓
              </span>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground">{members}</div>
        </div>
      </div>
    </div>
  )
}

function ReviewFooter({ role, avatar }: { role: string; avatar: string }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="text-xs text-muted-foreground">{role}</div>
      <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border/40 bg-card/40">
        <Image src={avatar} alt="" fill sizes="32px" className="object-cover opacity-90" />
      </div>
    </div>
  )
}
