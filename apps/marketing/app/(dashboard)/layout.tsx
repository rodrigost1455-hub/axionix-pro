import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SidebarNav } from "./components/SidebarNav";
import { getMonthlyUsage } from "@/lib/auth";
import { getPlan } from "@axionix/core";
import type { Plan } from "@axionix/core";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const usage = await getMonthlyUsage(user.id);
  const planConfig = getPlan(user.plan as Plan);

  return (
    <div className="min-h-screen bg-[#060611] flex">
      <SidebarNav
        user={{
          name: user.name ?? user.email,
          email: user.email,
          plan: user.plan,
        }}
        usage={{
          text: usage.textCount,
          textLimit: planConfig.limits.textGenerations,
          image: usage.imageCount,
          imageLimit: planConfig.limits.imageGenerations,
        }}
      />
      <main className="flex-1 min-h-screen pl-64">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
