import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  const { data, error } = await supabase.from("log_analytics").select("*");
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}
