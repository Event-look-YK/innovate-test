import { Logo } from '@innovate-test/ui/components/logo'
import { Link } from '@tanstack/react-router'

const NAV_LINKS = [
    { title: 'Features', href: '#features' },
    { title: 'How it works', href: '#how-it-works' },
]

const ROUTE_LINKS = [
    { title: 'Sign in', to: '/auth/sign-in' as const },
    { title: 'Sign up', to: '/auth/sign-up' as const },
]

export const FooterSection = () => {
    return (
        <footer className="border-t py-16 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto w-fit">
                    <Logo />
                </div>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.title}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            {link.title}
                        </a>
                    ))}
                    {ROUTE_LINKS.map((link) => (
                        <Link
                            key={link.title}
                            to={link.to}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            {link.title}
                        </Link>
                    ))}
                </div>

                <span className="text-muted-foreground block text-center text-sm">
                    © {new Date().getFullYear()} Innovate Logistics. All rights reserved.
                </span>
            </div>
        </footer>
    )
}
