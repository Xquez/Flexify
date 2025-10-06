import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Mail, Phone, MapPin } from 'lucide-react';
  import type { Metadata } from "next";
  
  export const metadata: Metadata = {
    title: "Support | GymFlow",
    description: "Get support and contact information.",
  };
  
  export default function SupportPage() {
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Support & Contact</CardTitle>
            <CardDescription>
              We're here to help. Reach out to us through any of the channels below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-muted-foreground">For general inquiries and support.</p>
                <a href="mailto:support@gymflow.com" className="text-primary hover:underline">
                  support@gymflow.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Phone</h3>
                <p className="text-muted-foreground">Available from 9 AM to 5 PM, Mon-Fri.</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Office Location</h3>
                <p className="text-muted-foreground">Come visit us at our headquarters.</p>
                <p>123 Fitness Ave, Workout City, ST 98765</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  