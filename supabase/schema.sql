create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  display_name text not null,
  internal_id text,
  strengths text[] default '{}',
  needs text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  student_id uuid references students on delete cascade not null,
  meeting_type text not null,
  meeting_date date not null,
  meeting_time time not null,
  meeting_mode text not null,
  location_or_link text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists meeting_participants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  meeting_id uuid references meetings on delete cascade not null,
  name text not null,
  role text not null,
  email text,
  attendance text default 'present',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists agenda_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  meeting_type text not null,
  sections jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists minutes_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  sections jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists task_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  content jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists meeting_minutes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  meeting_id uuid references meetings on delete cascade not null unique,
  sections jsonb not null,
  summary text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  student_id uuid references students on delete set null,
  meeting_id uuid references meetings on delete set null,
  title text not null,
  description text,
  owner text not null,
  due_date date,
  priority text default 'normal',
  status text default 'to do',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  student_id uuid references students on delete cascade,
  meeting_id uuid references meetings on delete cascade,
  task_id uuid references tasks on delete cascade,
  file_name text not null,
  storage_path text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  table_name text not null,
  record_id uuid not null,
  action text not null,
  created_at timestamptz default now() not null
);

create table if not exists billing_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  stripe_customer_id text,
  is_active boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create or replace function update_timestamp() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function log_audit() returns trigger as $$
declare
  target_user uuid;
  target_id uuid;
begin
  target_user = coalesce(new.user_id, old.user_id);
  target_id = coalesce(new.id, old.id);
  insert into audit_logs (user_id, table_name, record_id, action)
  values (target_user, tg_table_name, target_id, tg_op);
  return coalesce(new, old);
end;
$$ language plpgsql;

create trigger update_students before update on students
for each row execute procedure update_timestamp();
create trigger update_meetings before update on meetings
for each row execute procedure update_timestamp();
create trigger update_meeting_participants before update on meeting_participants
for each row execute procedure update_timestamp();
create trigger update_agenda_templates before update on agenda_templates
for each row execute procedure update_timestamp();
create trigger update_minutes_templates before update on minutes_templates
for each row execute procedure update_timestamp();
create trigger update_task_templates before update on task_templates
for each row execute procedure update_timestamp();
create trigger update_meeting_minutes before update on meeting_minutes
for each row execute procedure update_timestamp();
create trigger update_tasks before update on tasks
for each row execute procedure update_timestamp();
create trigger update_attachments before update on attachments
for each row execute procedure update_timestamp();
create trigger update_billing_customers before update on billing_customers
for each row execute procedure update_timestamp();

create trigger audit_meetings after insert or update or delete on meetings
for each row execute procedure log_audit();
create trigger audit_tasks after insert or update or delete on tasks
for each row execute procedure log_audit();

alter table profiles enable row level security;
alter table students enable row level security;
alter table meetings enable row level security;
alter table meeting_participants enable row level security;
alter table agenda_templates enable row level security;
alter table minutes_templates enable row level security;
alter table task_templates enable row level security;
alter table meeting_minutes enable row level security;
alter table tasks enable row level security;
alter table attachments enable row level security;
alter table audit_logs enable row level security;
alter table billing_customers enable row level security;

create policy "Profiles are viewable by owner" on profiles
  for select using (id = auth.uid());
create policy "Profiles are updatable by owner" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Students are viewable by owner" on students
  for select using (user_id = auth.uid());
create policy "Students are insertable by owner" on students
  for insert with check (user_id = auth.uid());
create policy "Students are updatable by owner" on students
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Students are deletable by owner" on students
  for delete using (user_id = auth.uid());

create policy "Meetings are viewable by owner" on meetings
  for select using (user_id = auth.uid());
create policy "Meetings are insertable by owner" on meetings
  for insert with check (user_id = auth.uid());
create policy "Meetings are updatable by owner" on meetings
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Meetings are deletable by owner" on meetings
  for delete using (user_id = auth.uid());

create policy "Participants are viewable by owner" on meeting_participants
  for select using (user_id = auth.uid());
create policy "Participants are insertable by owner" on meeting_participants
  for insert with check (user_id = auth.uid());
create policy "Participants are updatable by owner" on meeting_participants
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Participants are deletable by owner" on meeting_participants
  for delete using (user_id = auth.uid());

create policy "Agenda templates by owner" on agenda_templates
  for select using (user_id = auth.uid());
create policy "Agenda templates insert" on agenda_templates
  for insert with check (user_id = auth.uid());
create policy "Agenda templates update" on agenda_templates
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Agenda templates delete" on agenda_templates
  for delete using (user_id = auth.uid());

create policy "Minutes templates by owner" on minutes_templates
  for select using (user_id = auth.uid());
create policy "Minutes templates insert" on minutes_templates
  for insert with check (user_id = auth.uid());
create policy "Minutes templates update" on minutes_templates
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Minutes templates delete" on minutes_templates
  for delete using (user_id = auth.uid());

create policy "Task templates by owner" on task_templates
  for select using (user_id = auth.uid());
create policy "Task templates insert" on task_templates
  for insert with check (user_id = auth.uid());
create policy "Task templates update" on task_templates
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Task templates delete" on task_templates
  for delete using (user_id = auth.uid());

create policy "Meeting minutes by owner" on meeting_minutes
  for select using (user_id = auth.uid());
create policy "Meeting minutes insert" on meeting_minutes
  for insert with check (user_id = auth.uid());
create policy "Meeting minutes update" on meeting_minutes
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Meeting minutes delete" on meeting_minutes
  for delete using (user_id = auth.uid());

create policy "Tasks by owner" on tasks
  for select using (user_id = auth.uid());
create policy "Tasks insert" on tasks
  for insert with check (user_id = auth.uid());
create policy "Tasks update" on tasks
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Tasks delete" on tasks
  for delete using (user_id = auth.uid());

create policy "Attachments by owner" on attachments
  for select using (user_id = auth.uid());
create policy "Attachments insert" on attachments
  for insert with check (user_id = auth.uid());
create policy "Attachments update" on attachments
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Attachments delete" on attachments
  for delete using (user_id = auth.uid());

create policy "Audit logs by owner" on audit_logs
  for select using (user_id = auth.uid());
create policy "Audit logs insert" on audit_logs
  for insert with check (user_id = auth.uid());

create policy "Billing customers by owner" on billing_customers
  for select using (user_id = auth.uid());
create policy "Billing customers insert" on billing_customers
  for insert with check (user_id = auth.uid());
create policy "Billing customers update" on billing_customers
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "Attachments bucket objects are private" on storage.objects
  for select using (bucket_id = 'attachments' and auth.uid() = owner);
create policy "Attachments bucket objects insert" on storage.objects
  for insert with check (bucket_id = 'attachments' and auth.uid() = owner);
create policy "Attachments bucket objects update" on storage.objects
  for update using (bucket_id = 'attachments' and auth.uid() = owner);
create policy "Attachments bucket objects delete" on storage.objects
  for delete using (bucket_id = 'attachments' and auth.uid() = owner);
