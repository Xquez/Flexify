import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import type { AdminDashboardInsightsOutput } from "@/ai/flows/admin-dashboard-insights";

export default function AiInsights({ insights }: { insights: AdminDashboardInsightsOutput }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <BrainCircuit className="h-8 w-8 text-primary" />
        <div>
          <CardTitle>AI-Powered Insights</CardTitle>
          <CardDescription>
            Your AI assistant's analysis of gym performance.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div>
          <h4 className="font-semibold font-headline mb-1">Trends Summary</h4>
          <p className="text-muted-foreground">{insights.summary}</p>
        </div>
        <div>
          <h4 className="font-semibold font-headline mb-1">Attendance Forecast</h4>
          <p className="text-muted-foreground">{insights.forecast}</p>
        </div>
      </CardContent>
    </Card>
  );
}
