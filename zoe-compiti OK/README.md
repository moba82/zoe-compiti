# 🐴 Zoe Compiti

Planner dei compiti per Zoe, con sincronizzazione cloud.

## Setup Supabase — copia questo SQL nell'editor SQL di Supabase

```sql
create table tasks (
  id           bigserial primary key,
  day_index    int not null,
  subject_id   text,
  label        text not null,
  emoji        text,
  text         text not null,
  duration     int default 20,
  is_revision  boolean default false,
  done         boolean default false,
  created_at   timestamptz default now()
);

-- Permessi pubblici (lettura e scrittura senza login)
alter table tasks enable row level security;
create policy "allow all" on tasks for all using (true) with check (true);
```
