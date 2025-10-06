'use client';

import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Metadata } from "next";

// export const metadata: Metadata = {
//     title: "Settings | GymFlow",
//     description: "Manage your account and application settings.",
// };

export default function SettingsPage() {
  // const { theme, setTheme } = useTheme();
  const { theme, systemTheme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account and application settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Toggle to switch between light and dark themes.
              </p>
            </div>
            <Switch
              id="dark-mode"
              // checked={theme === 'dark'}
              checked={currentTheme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Basic information about your company.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Company Name</span>
            <span>GymFlow Inc.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Established</span>
            <span>2024</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
