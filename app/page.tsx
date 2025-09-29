import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import DashboardPage from "./dashboard/page";

export default async function Home() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }
  return (
    <>
      <DashboardPage />
    </>
  );
}
