import { MapPin, Activity, CheckCircle2, TruckIcon } from 'lucide-react'
import DottedMap from 'dotted-map'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@innovate-test/ui/components/chart'

export const FeaturesSection = () => {
    return (
        <section id="features" className="px-4 py-16 md:py-32">
            <div className="mx-auto grid max-w-5xl border md:grid-cols-2">
                <div>
                    <div className="p-6 sm:p-12">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <MapPin className="size-4" />
                            Live fleet tracking
                        </span>

                        <p className="mt-8 text-2xl font-semibold">
                            Monitor every truck in real time. Know exactly where your fleet is at all times.
                        </p>
                    </div>

                    <div aria-hidden className="relative">
                        <div className="absolute inset-0 z-10 m-auto size-fit">
                            <div className="rounded-(--radius) bg-background z-1 dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
                                <TruckIcon className="size-3.5 text-primary" />
                                Truck #TRK-4821 · En route to Lviv
                            </div>
                            <div className="rounded-(--radius) bg-background flex flex-row gap-2 justify-center text-[10px] absolute inset-2 mx-auto border px-3 font-medium shadow-md shadow-zinc-950/5 dark:bg-zinc-900">
                            <TruckIcon className="size-3 text-primary" />
                            Truck #TRK-4821 · En route to Lviv
                            </div>
                        </div>

                        <div className="relative overflow-hidden">
                            <div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%" />
                            <FleetMap />
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden border-t bg-zinc-50 p-6 sm:p-12 md:border-0 md:border-l dark:bg-transparent">
                    <div className="relative z-10">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="size-4" />
                            Carrier matching
                        </span>

                        <p className="my-8 text-2xl font-semibold">
                            AI-powered matching connects your loads with the best available carriers instantly.
                        </p>
                    </div>
                    <div aria-hidden className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="flex size-5 rounded-full border bg-primary/10 items-center justify-center">
                                    <TruckIcon className="size-2.5 text-primary" />
                                </span>
                                <span className="text-muted-foreground text-xs">Today, 09:41</span>
                            </div>
                            <div className="rounded-(--radius) bg-background mt-1.5 w-3/5 border p-3 text-xs">
                                New load request: 12t from Lviv → Odesa. Looking for available carrier.
                            </div>
                        </div>

                        <div>
                            <div className="rounded-(--radius) mb-1 ml-auto w-3/5 bg-primary p-3 text-xs text-primary-foreground">
                                Match found! Carrier Ivan T. (⭐ 4.9) — 23 km away. ETA pickup: 35 min.
                            </div>
                            <span className="text-muted-foreground block text-right text-xs">Now</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-full border-y p-12">
                    <p className="text-center text-4xl font-semibold lg:text-7xl">98.2% On-time delivery</p>
                </div>

                <div className="relative col-span-full">
                    <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Activity className="size-4" />
                            Delivery analytics
                        </span>
                    </div>
                    <DeliveryChart />
                </div>
            </div>
        </section>
    )
}

const map = new DottedMap({ height: 55, grid: 'diagonal' })
const points = map.getPoints()

const FleetMap = () => {
    const viewBox = '0 0 120 60'
    return (
        <svg
            viewBox={viewBox}
            style={{ background: 'var(--color-background)' }}>
            {points.map((point, index) => (
                <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={0.15}
                    fill="currentColor"
                />
            ))}
        </svg>
    )
}

const chartConfig = {
    completed: {
        label: 'Completed',
        color: 'var(--color-primary)',
    },
    ontime: {
        label: 'On-time',
        color: '#22c55e',
    },
} satisfies ChartConfig

const chartData = [
    { month: 'Aug', completed: 210, ontime: 198 },
    { month: 'Sep', completed: 245, ontime: 230 },
    { month: 'Oct', completed: 280, ontime: 264 },
    { month: 'Nov', completed: 310, ontime: 295 },
    { month: 'Dec', completed: 260, ontime: 248 },
    { month: 'Jan', completed: 340, ontime: 328 },
]

const DeliveryChart = () => {
    return (
        <ChartContainer
            className="h-120 aspect-auto md:h-96"
            config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ left: 0, right: 0 }}>
                <defs>
                    <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-completed)" stopOpacity={0.8} />
                        <stop offset="55%" stopColor="var(--color-completed)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillOntime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-ontime)" stopOpacity={0.8} />
                        <stop offset="55%" stopColor="var(--color-ontime)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <ChartTooltip
                    active
                    cursor={false}
                    content={<ChartTooltipContent className="dark:bg-muted" />}
                />
                <Area
                    strokeWidth={2}
                    dataKey="ontime"
                    type="stepBefore"
                    fill="url(#fillOntime)"
                    fillOpacity={0.1}
                    stroke="var(--color-ontime)"
                    stackId="a"
                />
                <Area
                    strokeWidth={2}
                    dataKey="completed"
                    type="stepBefore"
                    fill="url(#fillCompleted)"
                    fillOpacity={0.1}
                    stroke="var(--color-completed)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    )
}
