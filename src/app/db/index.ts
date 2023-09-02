import { createClient } from "@supabase/supabase-js";

import { Database } from "./types";

const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,
  {
    auth: { persistSession: false },
  },
);

export { supabaseClient };
