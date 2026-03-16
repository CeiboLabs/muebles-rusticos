-- ============================================================
-- Supabase Storage: gallery bucket
-- ============================================================

-- Create the bucket (run in Supabase SQL editor or via CLI)
insert into storage.buckets (id, name, public)
  values ('gallery', 'gallery', true)
  on conflict (id) do nothing;

-- Public read
create policy "Public read gallery"
  on storage.objects for select
  using (bucket_id = 'gallery');

-- Authenticated upload
create policy "Authenticated upload gallery"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- Authenticated delete
create policy "Authenticated delete gallery"
  on storage.objects for delete
  using (bucket_id = 'gallery' and auth.role() = 'authenticated');
