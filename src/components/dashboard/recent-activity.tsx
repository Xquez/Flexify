import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { members } from "@/lib/data";

export default function RecentActivity() {
  const recentMembers = members.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Signups</CardTitle>
        <CardDescription>
          {recentMembers.length} new members joined this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recentMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
            <div className="ml-auto font-medium">
              +${member.membershipPlan === "Premium" ? "99.00" : member.membershipPlan === "VIP" ? "199.00" : "49.00"}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
