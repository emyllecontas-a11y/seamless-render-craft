import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HEATMAP, DESEMPENHO_METRICAS, GRANDES_AREAS } from "@/lib/mock";

export const Route = createFileRoute("/desempenho")({
  head: () => ({ meta: [{ title: "Desempenho — RevisaFlash" }] }),
  component: DesempenhoPage,
});

function DesempenhoPage() {
  const m = DESEMPENHO_METRICAS;
  const topAreas = [...GRANDES_AREAS].sort((a, b) => b.erros - a.erros).slice(0, 5);

  return (
    <AppShell breadcrumb="Desempenho" title="Sua evolução">
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Big label="Acertos gerais" value={`${m.acertosGerais}%`} delta="+4 pp" positive />
        <Big label="Cards revisados" value={m.cardsRevisados.toLocaleString("pt-BR")} delta="+312 sem" positive />
        <Big label="Horas de estudo" value={`${m.horasEstudo}h`} delta="+11h sem" positive />
        <Big label="Questões resolvidas" value={m.questoesResolvidas.toLocaleString("pt-BR")} delta="+92 sem" positive />
      </div>

      <section className="rf-card p-5 mb-6">
        <header className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Consistência — 12 semanas</h2>
            <p className="text-xs text-foreground/45">Cada quadrado representa um dia de estudo.</p>
          </div>
          <Legend />
        </header>

        <div className="flex gap-1.5">
          {HEATMAP.map((week, wi) => (
            <div key={wi} className="flex flex-1 flex-col gap-1.5">
              {week.map((v, di) => (
                <div key={di} className={["aspect-square rounded-[3px]", heatClass(v)].join(" ")} title={`Semana ${wi + 1} · ${["—","leve","médio","forte","intenso"][v]}`} />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-foreground/40">
          <span>Abr</span><span>Mai</span><span>Jun</span>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rf-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Áreas que mais erram</h2>
          <ul className="space-y-3">
            {topAreas.map((a) => {
              const pct = Math.round((a.erros / a.total) * 100);
              return (
                <li key={a.nome}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm"><span>{a.icon}</span>{a.nome}</span>
                    <span className="text-xs font-medium tabular-nums text-foreground/65">{a.erros} <span className="text-foreground/35">/ {a.total}</span></span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className={["h-full rounded-full", pct >= 15 ? "bg-accent" : "bg-primary/70"].join(" ")} style={{ width: `${Math.min(pct * 4, 100)}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rf-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Evolução de acertos</h2>
          <Sparkline values={[58, 61, 60, 64, 66, 69, 71, 73, 75, 74, 77, 78]} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-display text-xl font-semibold tabular-nums text-primary">+20pp</div>
              <div className="text-[10px] uppercase tracking-widest text-foreground/40">vs 12 sem</div>
            </div>
            <div>
              <div className="font-display text-xl font-semibold tabular-nums">78%</div>
              <div className="text-[10px] uppercase tracking-widest text-foreground/40">média atual</div>
            </div>
            <div>
              <div className="font-display text-xl font-semibold tabular-nums">85%</div>
              <div className="text-[10px] uppercase tracking-widest text-foreground/40">pico</div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function heatClass(v: number) {
  return ["bg-white/5", "bg-primary/20", "bg-primary/45", "bg-primary/70", "bg-primary"][v];
}

function Legend() {
  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/40">
      <span>Menos</span>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((v) => <span key={v} className={["h-2.5 w-2.5 rounded-[2px]", heatClass(v)].join(" ")} />)}
      </div>
      <span>Mais</span>
    </div>
  );
}

function Big({ label, value, delta, positive }: { label: string; value: string; delta?: string; positive?: boolean }) {
  return (
    <div className="rf-card p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">{label}</div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <div className="font-display text-2xl font-semibold tabular-nums">{value}</div>
        {delta && <span className={["text-[11px] font-medium", positive ? "text-primary" : "text-accent"].join(" ")}>{delta}</span>}
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;
  const area = `${d} L 100,100 L 0,100 Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-32 w-full">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={d} fill="none" stroke="#14B8A6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
