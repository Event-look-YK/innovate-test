import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      123
      <Button>123</Button>
    </div>
  );
}
