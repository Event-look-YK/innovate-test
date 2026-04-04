import { Label } from "@innovate-test/ui/components/label";
import { Switch } from "@innovate-test/ui/components/switch";

const notificationLabels = [
  "Task assignments",
  "Route updates",
  "Offer received",
  "Messages",
  "Emergency alerts",
];

export const SettingsNotificationsTab = () => (
  <div className="flex flex-col gap-4">
    {notificationLabels.map((label) => (
      <div key={label} className="flex items-center justify-between gap-4">
        <Label htmlFor={label}>{label}</Label>
        <Switch defaultChecked id={label} />
      </div>
    ))}
  </div>
);
