import { getClient } from "@/lib/Supabase/server";

export async function getUser() {
  const supabase = await getClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}
