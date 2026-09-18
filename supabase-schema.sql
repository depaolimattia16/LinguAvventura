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
