import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BoxIcon, MapPinIcon, RouteIcon, SparklesIcon } from 'lucide-react'
import { StatsSection } from '@innovate-test/ui/components/stats'
import { FeaturesSection } from '@innovate-test/ui/components/features-9'
import { TextEffect } from '@innovate-test/ui/components/text-effect'
import { AnimatedGroup } from '@innovate-test/ui/components/animated-group'
import { Button } from '@innovate-test/ui/components/button'
import { HeroHeader } from '@/shared/ui/landing/hero-header'
import { CallToActionSection } from '@/shared/ui/landing/call-to-action-section'
import { FooterSection } from '@/shared/ui/landing/footer-section'

const transitionVariants = {
    item: {
        hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { type: 'spring' as const, bounce: 0.3, duration: 1.5 },
        },
    },
}

const STEPS = [
    {
        number: '01',
        icon: BoxIcon,
        title: 'Post a demand request',
        description: 'Shippers enter freight details. The platform instantly computes weight, volume, and matching criteria.',
    },
    {
        number: '02',
        icon: MapPinIcon,
        title: 'Match with carriers',
        description: 'Carriers and freelance drivers receive automatic match notifications. Accept and confirm in seconds.',
    },
    {
        number: '03',
        icon: RouteIcon,
        title: 'Track every delivery',
        description: 'Real-time GPS tracking, automated status updates, and a full audit trail from pickup to proof of delivery.',
    },
]

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground antialiased">
            <HeroHeader />

            {/* Hero */}
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                </div>

                <section>
                    <div className="relative pt-28 md:pt-40">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 -z-10"
                            style={{
                                background:
                                    'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.540 0.200 267 / 0.1) 0%, transparent 70%)',
                            }}
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto">
                                <AnimatedGroup variants={transitionVariants}>
                                    <a
                                        href="#features"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm flex items-center gap-1.5">
                                            <SparklesIcon className="size-3.5 text-primary" />
                                            New · AI route generation is live
                                        </span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />
                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </AnimatedGroup>

                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-bold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    Smarter freight. Faster deliveries.
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                                    Innovate Logistics connects carriers and shippers on a single platform — streamlining demand, fleet, routes, and tasks so your operation runs without friction.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: { staggerChildren: 0.05, delayChildren: 0.75 },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <Button
                                            size="lg"
                                            className="rounded-xl px-5 text-base"
                                            render={<Link to="/auth/sign-up" />}
                                            nativeButton={false}>
                                            <span className="text-nowrap">Start for free</span>
                                        </Button>
                                    </div>
                                    <Button
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5"
                                        render={<Link to="/auth/sign-in" />}
                                        nativeButton={false}>
                                        <span className="text-nowrap">Sign in</span>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <StatsSection />

                {/* Features bento (Tailark features-9) */}
                <FeaturesSection />

                {/* How it works */}
                <section id="how-it-works" className="bg-muted/30 px-6 py-24">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-14 flex flex-col items-center gap-3 text-center">
                            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
                                <RouteIcon className="size-3" />
                                Simple process
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">How it works</h2>
                            <p className="max-w-xl text-muted-foreground">
                                Get your first shipment coordinated in under 10 minutes. No onboarding call required.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {STEPS.map((step, idx) => (
                                <div key={step.number} className="relative flex flex-col gap-4">
                                    {idx < STEPS.length - 1 && (
                                        <div
                                            aria-hidden
                                            className="absolute top-6 left-16 hidden h-px w-full bg-linear-to-r from-border to-transparent md:block"
                                        />
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/8 font-black text-sm text-primary">
                                            {step.number}
                                        </div>
                                        <div className="h-px flex-1 bg-border md:hidden" />
                                    </div>
                                    <div>
                                        <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-background shadow-sm border border-border">
                                            <step.icon className="size-4 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-base font-bold">{step.title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <CallToActionSection />

                {/* Footer */}
                <FooterSection />
            </main>
        </div>
    )
}

export const Route = createFileRoute('/')({
    component: LandingPage,
})
