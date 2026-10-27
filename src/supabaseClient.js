import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftdrawdkxlrectoypmfs.supabase.co"; // Reemplaza por tu URL
const supabaseAnonKey = "sb_publishable_VmJfwnBUmNQF95qO2IZPzw_mxcdXGjq"; // Reemplaza por tu Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
