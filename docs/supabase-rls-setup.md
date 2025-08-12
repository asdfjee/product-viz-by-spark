# Supabase RLS setup for user_projects (email/password auth)

Run the following SQL in the Supabase SQL editor.

1) Ensure the `user_id` column is UUID and references `auth.users(id)`

```sql
ALTER TABLE public.user_projects
  ALTER COLUMN user_id TYPE uuid USING NULLIF(user_id, '')::uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'user_projects'
      AND constraint_name = 'user_projects_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_projects
      ADD CONSTRAINT user_projects_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;
```

2) Enable RLS

```sql
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
```

3) Policies

```sql
CREATE POLICY "select_own_projects"
ON public.user_projects
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "insert_own_projects"
ON public.user_projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "update_own_projects"
ON public.user_projects
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "delete_own_projects"
ON public.user_projects
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

4) Auto-set user_id on insert when NULL

```sql
CREATE OR REPLACE FUNCTION public.set_user_id_from_auth()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_user_id_before_insert ON public.user_projects;
CREATE TRIGGER set_user_id_before_insert
BEFORE INSERT ON public.user_projects
FOR EACH ROW
EXECUTE FUNCTION public.set_user_id_from_auth();
```

Notes
- After this, unauthenticated (anon) users cannot select/insert rows.
- Ensure your Supabase project auth settings permit email/password sign-up/sign-in.
- If you require email confirmations, users must verify their email before they can sign in.
- In Supabase → Authentication → URL configuration, set Site URL to your app origin
- Optional: Add <your-origin>/auth/callback to Redirect URLs
- The app sets emailRedirectTo to /auth/callback during sign-up and handles the redirect