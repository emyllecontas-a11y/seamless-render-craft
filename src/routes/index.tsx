import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  USER, CHECKLIST_HOJE, REVISOES_HOJE, PROXIMAS_REVISOES, DISCIPLINAS,
  META_SEMANAL, diasAteProva, STREAK,
} from "@/lib/mock";
import { Check, Plus, Clock, ArrowUpRight, Flame, Target, BookOpen, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — RevisaFlash" },
      { name: "description", content: "Painel diário de revisões, checklist e progresso para o ENARE." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const dias = diasAteProva();
  const totalChecklist = CHECKLIST_HOJE.length;
  const feitos = CHECKLIST_HOJE.filter((c) => c.feito).length;
  const pendentes = REVISOES_HOJE.reduce((a, r) => a + r.cards, 0);

  return (
    <AppShell breadcrumb="Início" title={`Bom dia, ${USER.name.split(" ")[1]}.`}>
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-foreground/55">
        Você tem <span className="font-medium text-primary">{pendentes} revisões</span> programadas para hoje
        e <span className="font-medium text-accent">{dias} dias</span> até a prova.
      </p>

      {/* Bento */}
      <div className="grid grid-cols-12 gap-4">
        {/* Stat cards */}
        <StatCard icon={<Flame className="h-4 w-4" />} label="Streak" value={`${STREAK} dias`} tone="accent" />
        <StatCard icon={<Target className="h-4 w-4" />} label="Meta semanal" value={`${META_SEMANAL.feito}/${META_SEMANAL.total}`} hint="estudos esta semana" />
        <StatCard icon={<BookOpen className="h-4 w-4" />} label="Cards due hoje" value={pendentes} hint={`em ${REVISOES_HOJE.length} blocos`} />
        <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Erros ativos" value={62} hint="13 áreas" tone="accent" />

        {/* Checklist */}
        <section className="col-span-12 rf-card p-5 lg:col-span-5">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Checklist de hoje</h2>
              <p className="text-xs text-foreground/45">{feitos}/{totalChecklist} concluídos · ter, 26 jun</p>
            </div>
            <button className="grid h-7 w-7 place-items-center rounded-md border border-border text-foreground/60 hover:bg-white/5"><Plus className="h-3.5 w-3.5" /></button>
          </header>
          <ul className="space-y-2.5">
            {CHECKLIST_HOJE.map((c) => (
              <li key={c.id} className="group flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/3">
                <span className={[
                  "grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors",
                  c.feito ? "border-primary bg-primary" : "border-foreground/25 group-hover:border-primary/60",
                ].join(" ")}>
                  {c.feito && <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />}
                </span>
                <span className={["text-sm", c.feito ? "text-foreground/40 line-through decoration-foreground/20" : "text-foreground/90"].join(" ")}>
                  {c.titulo}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(feitos / totalChecklist) * 100}%` }} />
          </div>
        </section>

        {/* Revisões hoje */}
        <section className="col-span-12 rf-card p-5 lg:col-span-7">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Revisões de hoje</h2>
              <p className="text-xs text-foreground/45">Distribuídas pelo algoritmo FSRS</p>
            </div>
            <Link to="/flashcards" className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
              Estudar agora <ArrowUpRight className="h-3 w-3" />
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {REVISOES_HOJE.map((r) => (
              <li key={r.area} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 font-display text-xs font-semibold text-primary">
                  {r.area.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{r.area}</div>
                  <div className="truncate text-xs text-foreground/45">{r.topico}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-xs text-foreground/50"><Clock className="h-3 w-3" /> {r.hora}</div>
                  <div className="text-xs font-medium text-foreground">{r.cards} cards</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Disciplinas mini */}
        <section className="col-span-12 rf-card p-5 lg:col-span-7">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Progresso por disciplina</h2>
              <p className="text-xs text-foreground/45">Top 4 com base no plano de estudos</p>
            </div>
            <Link to="/conteudo" className="text-xs font-medium text-primary hover:underline">Ver todas</Link>
          </header>
          <ul className="space-y-3">
            {DISCIPLINAS.slice(0, 4).map((d) => (
              <li key={d.nome}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm">{d.nome}</span>
                  <span className="text-xs font-medium tabular-nums text-foreground/70">{d.progresso}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className={["h-full rounded-full transition-all", d.progresso >= 80 ? "bg-primary" : d.progresso >= 40 ? "bg-primary/70" : "bg-accent/70"].join(" ")} style={{ width: `${d.progresso}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Próximas */}
        <section className="col-span-12 rf-card p-5 lg:col-span-5">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Próximas revisões</h2>
            <Link to="/calendario" className="text-xs font-medium text-primary hover:underline">Ver agenda</Link>
          </header>
          <ul className="space-y-3">
            {PROXIMAS_REVISOES.map((p) => (
              <li key={p.area + p.topico} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3 rf-card-hover">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent/10 text-[10px] font-semibold text-accent">{p.area.slice(0,2).toUpperCase()}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.area}</div>
                  <div className="truncate text-[11px] text-foreground/45">{p.topico}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-medium text-foreground/80">{p.quando}</div>
                  <div className="text-foreground/40">{p.cards} cards</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value, hint, tone = "primary" }: { icon: React.ReactNode; label: string; value: React.ReactNode; hint?: string; tone?: "primary" | "accent" }) {
  return (
    <div className="col-span-6 rf-card p-4 sm:col-span-3 rf-card-hover">
      <div className={["mb-3 inline-flex h-7 w-7 items-center justify-center rounded-md", tone === "accent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"].join(" ")}>
        {icon}
      </div>
      <div className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-foreground/40">{hint}</div>}
    </div>
  );
}
