-- Create RPC to inspect table structure
create or replace function public.get_table_structure(table_name text)
returns json
language sql
stable
as $$
  select coalesce(
    json_agg(json_build_object(
      'column_name', c.column_name,
      'data_type', c.data_type,
      'is_nullable', c.is_nullable,
      'column_default', c.column_default
    ) order by c.ordinal_position),
    '[]'::json
  )
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = table_name;
$$;

-- Permissions: allow anon/authenticated to execute (optional; remove if you don't want public access)
grant execute on function public.get_table_structure(text) to anon, authenticated;
