export const billingEnabled = process.env.ENABLE_BILLING === "true";

export const freeTierLimits = {
  maxStudents: 1,
  maxMeetingsPerMonth: 3,
  maxExportsPerMonth: 3
};

export async function isPaidUser(supabase: { from: (table: string) => any }, userId: string) {
  const { data } = await supabase.from("billing_customers").select("is_active").eq("user_id", userId).single();
  return data?.is_active === true;
}
