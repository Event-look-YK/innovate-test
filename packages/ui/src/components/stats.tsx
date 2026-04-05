const STATS = [
    { value: '2,400+', label: 'Carriers onboarded' },
    { value: '18,000+', label: 'Trucks tracked' },
    { value: '98.2%', label: 'On-time delivery' },
    { value: '340K+', label: 'Routes optimised' },
]

export const StatsSection = () => {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-12 divide-y *:text-center md:grid-cols-4 md:gap-2 md:divide-x md:divide-y-0">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="space-y-2">
                            <div className="text-5xl font-bold">{stat.value}</div>
                            <p className="text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
