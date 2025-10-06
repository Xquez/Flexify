'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating admin dashboard insights.
 *
 * The flow takes in attendance and revenue data and uses an LLM to provide
 * summarized insights and forecasts. It exports the `getAdminDashboardInsights` function,
 * the `AdminDashboardInsightsInput` type, and the `AdminDashboardInsightsOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminDashboardInsightsInputSchema = z.object({
  attendanceData: z.string().describe('JSON string of member attendance data.'),
  revenueData: z.string().describe('JSON string of revenue data.'),
});

export type AdminDashboardInsightsInput = z.infer<typeof AdminDashboardInsightsInputSchema>;

const AdminDashboardInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of key trends in member attendance and revenue.'),
  forecast: z.string().describe('A forecast of future attendance based on current trends.'),
});

export type AdminDashboardInsightsOutput = z.infer<typeof AdminDashboardInsightsOutputSchema>;

export async function getAdminDashboardInsights(input: AdminDashboardInsightsInput): Promise<AdminDashboardInsightsOutput> {
  return adminDashboardInsightsFlow(input);
}

const adminDashboardInsightsPrompt = ai.definePrompt({
  name: 'adminDashboardInsightsPrompt',
  input: {schema: AdminDashboardInsightsInputSchema},
  output: {schema: AdminDashboardInsightsOutputSchema},
  prompt: `You are an AI assistant helping a gym admin understand trends in their business.

  Summarize the key trends in member attendance and revenue based on the provided data.
  Also, provide a forecast of future attendance based on current trends.

  Attendance Data: {{{attendanceData}}}
  Revenue Data: {{{revenueData}}}
  `,
});

const adminDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'adminDashboardInsightsFlow',
    inputSchema: AdminDashboardInsightsInputSchema,
    outputSchema: AdminDashboardInsightsOutputSchema,
  },
  async input => {
    const {output} = await adminDashboardInsightsPrompt(input);
    return output!;
  }
);
