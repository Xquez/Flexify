'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

export default function UpgradePage() {
  const { toast } = useToast();

  const handleUpgradeClick = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Payment Successful',
      description: 'You have successfully upgraded to the Pro plan.',
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upgrade to Pro</CardTitle>
          <CardDescription>
            Unlock all features and get unlimited access to our support team.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <RadioGroup defaultValue="pro-monthly" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="pro-monthly" id="pro-monthly" className="peer sr-only" />
              <Label
                htmlFor="pro-monthly"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <h3 className="text-lg font-semibold">Pro Monthly</h3>
                <p className="text-2xl font-bold mt-2">$99/mo</p>
                <p className="text-sm text-muted-foreground mt-1">Billed every month</p>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="pro-yearly" id="pro-yearly" className="peer sr-only" />
              <Label
                htmlFor="pro-yearly"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                  Save 20%
                </div>
                <h3 className="text-lg font-semibold">Pro Yearly</h3>
                <p className="text-2xl font-bold mt-2">$950/yr</p>
                <p className="text-sm text-muted-foreground mt-1">Billed annually</p>
              </Label>
            </div>
          </RadioGroup>
          <form onSubmit={handleUpgradeClick}>
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Add a credit card to complete your purchase. This is a fake payment form.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name on card</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Card number</Label>
                  <div className="relative">
                    <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                    <CreditCard className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry-month">Expires</Label>
                    <Input id="expiry-month" placeholder="MM / YY" required />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="CVC" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">Confirm Payment and Upgrade</Button>
              </CardFooter>
            </Card>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
