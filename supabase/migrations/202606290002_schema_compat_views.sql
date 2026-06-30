-- v0.4.0 schema compatibility views
-- Non-breaking aliases for legacy/modern table name mismatches.

do $$
begin
  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'media_assets'
  ) and to_regclass('public.media') is null then
    execute 'create view public.media as select * from public.media_assets';
  end if;

  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'media'
  ) and to_regclass('public.media_assets') is null then
    execute 'create view public.media_assets as select * from public.media';
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'content_versions'
  ) and to_regclass('public.versions') is null then
    execute 'create view public.versions as select * from public.content_versions';
  end if;

  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'versions'
  ) and to_regclass('public.content_versions') is null then
    execute 'create view public.content_versions as select * from public.versions';
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'editorial_comments'
  ) and to_regclass('public.comments') is null then
    execute 'create view public.comments as select * from public.editorial_comments';
  end if;

  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'comments'
  ) and to_regclass('public.editorial_comments') is null then
    execute 'create view public.editorial_comments as select * from public.comments';
  end if;
end;
$$;
