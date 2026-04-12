import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://bpqhfnhcxlilgcouiesx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcWhmbmhjeGxpbGdjb3VpZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjU2ODgsImV4cCI6MjA5MDU0MTY4OH0.b2btdj43VbTFc3_euFLt0HmRCylyw_t3r-t6uZIYt3I'
)
