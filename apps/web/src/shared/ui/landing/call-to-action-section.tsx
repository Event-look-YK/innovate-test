import { Button } from '@innovate-test/ui/components/button'
import { Link } from '@tanstack/react-router'

export const CallToActionSection = () => {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                        Ready to move smarter?
                    </h2>
                    <p className="text-muted-foreground mt-4">
                        Join thousands of carriers and shippers already running their operations on Innovate Logistics.
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button
                            size="lg"
                            render={<Link to="/auth/sign-up" />}
                            nativeButton={false}>
                            <span>Start for free</span>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            render={<Link to="/auth/sign-in" />}
                            nativeButton={false}>
                            <span>Sign in</span>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
