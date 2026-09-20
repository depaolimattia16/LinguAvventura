-- Da eseguire una sola volta nel tuo progetto Supabase:
-- dashboard Supabase → il tuo progetto → SQL Editor → New query → incolla tutto → Run.

create table if not exists attempts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nickname text not null,
  topic text not null,
  correct boolean not null
);

-- Attiva le regole di sicurezza: senza questo passaggio nessuno può leggere
-- né scrivere nella tabella (nemmeno l'app), quindi è necessario.
alter table attempts enable row level security;

-- Chiunque abbia la chiave "anon" (cioè: l'app) può aggiungere risposte.
create policy "chiunque può inserire risposte"
  on attempts for insert
  to anon
  with check (true);

-- Chiunque abbia la chiave "anon" può leggere le statistiche.
-- Nota: questo significa che chiunque conosca l'indirizzo del sito e la
-- chiave anon (visibile nel codice del sito, non è un segreto) può vedere
-- i dati aggregati. Per una classe non è un problema, ma è bene saperlo:
-- non c'è una vera protezione ad accesso, solo l'assenza di un modo ovvio
-- per arrivarci senza volerlo.
create policy "chiunque può leggere le risposte"
  on attempts for select
  to anon
  using (true);


-- ============================================================
-- Contatore visite del sito (opzionale)
-- ============================================================

create table if not exists site_stats (
  id int primary key default 1,
  views bigint not null default 0
);
insert into site_stats (id, views) values (1, 0) on conflict (id) do nothing;

alter table site_stats enable row level security;

-- Chiunque può leggere il numero di visite.
create policy "chiunque può leggere il contatore visite"
  on site_stats for select
  to anon
  using (true);

-- L'incremento passa da questa funzione (non da una UPDATE diretta):
-- così nessuno con la chiave anon può manomettere il numero a piacere,
-- può solo farlo salire di uno alla volta.
create or replace function increment_site_views()
returns bigint
language plpgsql
security definer
as $$
declare
  new_views bigint;
begin
  update site_stats set views = views + 1 where id = 1 returning views into new_views;
  return new_views;
end;
$$;

grant execute on function increment_site_views() to anon;
