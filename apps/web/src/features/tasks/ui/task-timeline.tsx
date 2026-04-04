import { CheckIcon } from "lucide-react";

const steps = [
  { label: "Created", at: "Apr 1 08:00" },
  { label: "Assigned", at: "Apr 1 09:12" },
  { label: "In transit", at: "Apr 2 07:45" },
];

export const TaskTimeline = () => (
  <ol className="relative flex flex-col gap-4 border-l border-border ml-3 pl-6">
    {steps.map((s) => (
      <li key={s.label} className="relative">
        <span className="absolute -left-9 top-0 flex size-6 items-center justify-center rounded-full border border-border bg-background">
          <CheckIcon className="size-3 text-primary" />
        </span>
        <p className="text-sm font-medium">{s.label}</p>
        <p className="text-xs text-muted-foreground">{s.at}</p>
      </li>
    ))}
  </ol>
);
