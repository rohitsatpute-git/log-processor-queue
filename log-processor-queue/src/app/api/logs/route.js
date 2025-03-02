import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function authenticateRequest(req) {
  const supabase = createMiddlewareSupabaseClient({ req });
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    return { error: "Unauthorized", status: 401 };
  }

  return { user };
}
