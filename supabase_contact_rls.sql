-- Allow anonymous users to INSERT into contact_messages (public contact form)
-- This only grants INSERT permission, NOT select/update/delete
CREATE POLICY "Allow anonymous insert on contact_messages"
ON public.contact_messages
FOR INSERT
TO anon
WITH CHECK (true);
