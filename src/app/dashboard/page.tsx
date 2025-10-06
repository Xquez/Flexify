import { getAdminDashboardInsights } from "@/ai/flows/admin-dashboard-insights";
import { attendanceData, revenueData } from "@/lib/data";
import Overview from "@/components/dashboard/overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | GymFlow",
  description: "Overview of your gym's performance.",
};

export default async function DashboardPage() {
  const insightsInput = {
    attendanceData: JSON.stringify(attendanceData),
    revenueData: JSON.stringify(revenueData),
  };

  let insights;
  try {
    insights = await getAdminDashboardInsights(insightsInput);
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    insights = {
      summary: "Could not load AI summary due to an error.",
      forecast: "Could not load AI forecast due to an error."
    }
  }

  return <Overview insights={insights} />;
}
