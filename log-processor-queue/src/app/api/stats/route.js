
import { NextResponse } from "next/server";
import supabase from "../../../lib/supabase";

export const GET = async (req) => {
  const { data, error } = await supabase.from("log_stats").select("*");
  console.log("data", data)
  if (error) return NextResponse.json({ error: error.message });

  return NextResponse.json(data);
}