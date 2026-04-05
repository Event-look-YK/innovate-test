import { cn } from '@innovate-test/ui/lib/utils'
import { TruckIcon } from 'lucide-react'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <img src="/favicon.svg" alt="Innovate Logistics" className="size-6" />
            <span className="text-sm font-bold">Innovate Logistics</span>
        </div>
    )
}

export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex size-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20', className)}>
            <TruckIcon className="size-3.5 text-primary" />
        </div>
    )
}
