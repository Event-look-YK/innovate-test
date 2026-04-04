import { zodResolver } from "@hookform/resolvers/zod";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { Field, FieldGroup, FieldLabel } from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import { Textarea } from "@innovate-test/ui/components/textarea";
import { cn } from "@innovate-test/ui/lib/utils";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { FreightOffer } from "@/shared/types/offer";

const counterSchema = z.object({
  price: z.coerce.number().positive(),
  message: z.string().optional(),
});

type CounterValues = z.infer<typeof counterSchema>;

type Props = {
  offer: FreightOffer;
};

export const OfferDetailRespondCard = ({ offer }: Props) => {
  const form = useForm<CounterValues>({
    resolver: zodResolver(counterSchema) as Resolver<CounterValues>,
    defaultValues: { price: offer.offeredPriceUah ?? 0, message: "" },
  });

  const onCounter = form.handleSubmit(() => {
    toast.success("Counter-offer sent (mock)");
  });

  return (
    <>
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        Route map placeholder
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Respond</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <button className={cn(buttonVariants())} type="button" onClick={() => toast.success("Accepted")}>
              Accept
            </button>
            <button
              className={cn(buttonVariants({ variant: "outline" }))}
              type="button"
              onClick={() => toast.success("Declined")}
            >
              Decline
            </button>
          </div>
          <form className="flex flex-col gap-4" onSubmit={onCounter}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="co-price">Proposed price (UAH)</FieldLabel>
                <Input id="co-price" type="number" {...form.register("price")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="co-msg">Message</FieldLabel>
                <Textarea id="co-msg" rows={2} {...form.register("message")} />
              </Field>
            </FieldGroup>
            <button className={cn(buttonVariants({ variant: "secondary" }))} type="submit">
              Counter-offer
            </button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
