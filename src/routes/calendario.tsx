import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ESTUDO_MES, REVISOES_HOJE } from "@/lib/mock";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export const Route = createFileRoute("/calendario")({
  head: () => ({ meta: [{ title: "Calendário — RevisaFlash" }] }),
  component: CalendarioPage,
});

function CalendarioPage() {
  // Junho 2026: 30 dias, começa segunda (1 = seg)
  const ano = 2026, mes = 5; // junho (0-index)
  const primeiroDia = new Date(ano, mes, 1).getDay(); // 0..6 dom..sab
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const hoje = 26;
  const cells: (number | null)[] = [];
  for (let i = 0; i < primeiroDia; i++) cells.push(null);
  for (let d = 1; d <= diasNoMes; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <AppShell breadcrumb="Calendário" title="Agenda de estudos">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rf-card p-5 lg:col-span-2">
          <header className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-semibold">Junho 2026</h2>
              <div className="flex items-center gap-1">
                <button className="grid h-7 w-7 place-items-center rounded-md border border-border hover:bg-white/5"><ChevronLeft className="h-3.5 w-3.5" /></button>
                <button className="grid h-7 w-7 place-items-center rounded-md border border-border hover:bg-white/5"><ChevronRight className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Registrar estudo
            </button>
          </header>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {["DOM","SEG","TER","QUA","QUI","SEX","SAB"].map((d) => (
              <div key={d} className="bg-surface px-2 py-2 text-center text-[10px] font-medium tracking-widest text-foreground/40">{d}</div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={i} className="bg-surface/40 aspect-square sm:aspect-auto sm:h-20" />;
              const e = ESTUDO_MES[d];
              const isHoje = d === hoje;
              return (
                <div key={i} className={[
                  "relative bg-surface p-2 transition-colors hover:bg-surface-2 aspect-square sm:aspect-auto sm:h-20",
                  isHoje ? "ring-1 ring-inset ring-primary" : "",
                ].join(" ")}>
                  <span className={["text-xs font-medium tabular-nums", isHoje ? "text-primary" : "text-foreground/80"].join(" ")}>{d}</span>
                  {e && (
                    <div className="absolute bottom-1.5 left-2 flex gap-1">
                      {e.teorico && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      {e.pratico && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-foreground/50">
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Teórico</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Prático</span>
            <span className="ml-auto">Hoje destacado em verde-azulado</span>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rf-card p-5">
            <h3 className="mb-1 font-display text-sm font-semibold">Hoje, 26 de junho</h3>
            <p className="mb-4 text-xs text-foreground/45">3 blocos programados · 75 cards</p>
            <ul className="space-y-3">
              {REVISOES_HOJE.map((r) => (
                <li key={r.area} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 rf-card-hover">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-[10px] font-semibold text-primary">{r.area.slice(0,2).toUpperCase()}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.area}</div>
                    <div className="truncate text-[11px] text-foreground/45">{r.hora} · {r.cards} cards</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rf-card p-5">
            <h3 className="mb-3 font-display text-sm font-semibold">Resumo do mês</h3>
            <dl className="grid grid-cols-2 gap-3 text-center">
              <Stat label="Dias estudados" value="18" />
              <Stat label="Horas totais" value="42h" />
              <Stat label="Questões" value="412" />
              <Stat label="Acertos" value="81%" />
            </dl>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/40 p-3">
      <div className="font-display text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-foreground/40">{label}</div>
    </div>
  );
}
