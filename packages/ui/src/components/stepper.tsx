import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@innovate-test/ui/lib/utils";

export type StepperStep = {
  title: string;
  description?: string;
};

type StepperProps = {
  steps: StepperStep[];
  activeIndex: number;
  className?: string;
};

const StepCircle = ({
  children,
  state,
}: {
  children: ReactNode;
  state: "complete" | "current" | "upcoming";
}) => (
  <span
    className={cn(
      "flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
      state === "complete" && "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25",
      state === "current" &&
        "border-primary bg-primary/12 text-primary shadow-[0_0_0_4px] shadow-primary/15 ring-2 ring-primary/25 ring-offset-2 ring-offset-background",
      state === "upcoming" && "border-border bg-muted/60 text-muted-foreground",
    )}
  >
    {children}
  </span>
);

export const Stepper = ({ steps, activeIndex, className }: StepperProps) => (
  <nav aria-label="Steps" className={cn("w-full", className)}>
    <ol className="flex w-full items-start">
      {steps.map((step, index) => {
        const state =
          index < activeIndex ? "complete" : index === activeIndex ? "current" : "upcoming";
        return (
          <li
            key={step.title}
            className={cn("flex items-start", index === 0 ? "shrink-0" : "min-w-0 flex-1")}
            {...(index === activeIndex ? { "aria-current": "step" as const } : {})}
          >
            {index > 0 ? (
              <div
                aria-hidden
                className={cn(
                  "mt-5 h-0.5 min-w-4 flex-1 rounded-full transition-colors",
                  index <= activeIndex ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
            <div className="flex w-19 shrink-0 flex-col items-center gap-1.5 sm:w-26">
              <StepCircle state={state}>
                {state === "complete" ? <CheckIcon className="size-[18px]" strokeWidth={2.5} /> : index + 1}
              </StepCircle>
              <span
                className={cn(
                  "text-center text-[11px] font-semibold leading-tight sm:text-xs",
                  index === activeIndex ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
              {step.description ? (
                <span className="hidden text-center text-[10px] leading-snug text-muted-foreground sm:line-clamp-2 sm:block">
                  {step.description}
                </span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  </nav>
);
