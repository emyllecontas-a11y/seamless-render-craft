import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { GRANDES_AREAS } from "@/lib/mock";
import { Plus, X, AlertTriangle, Filter } from "lucide-react";

export const Route = createFileRoute("/erros")({
  head: () => ({ meta: [{ title: "Banco de erros — RevisaFlash" }] }),
  component: ErrosPage,
});

function ErrosPage() {
  const [open, setOpen] = useState(false);
  const total = GRANDES_AREAS.reduce((a, g) => a + g.erros, 0);
  const ordenadas = [...GRANDES_AREAS].sort((a, b) => b.erros - a.erros);

  return (
    <AppShell breadcrumb="Erros" title="Banco de erros por grande área">
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Total ativos" value={total} accent />
        <Kpi label="Áreas com erro" value={GRANDES_AREAS.filter((g) => g.erros > 0).length} />
        <Kpi label="Críticos" value={GRANDES_AREAS.filter((g) => g.erros >= 10).length} accent />
        <Kpi label="Resolvidos no mês" value={48} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-xs text-foreground/55">
          <Filter className="h-3.5 w-3.5" /> Ordenado por incidência
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Registrar erro
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ordenadas.map((g) => {
          const pct = Math.round((g.erros / g.total) * 100);
          const critico = g.erros >= 10;
          return (
            <article key={g.nome} className="rf-card rf-card-hover p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-background/60 text-lg">{g.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold">{g.nome}</h3>
                    <p className="text-[11px] text-foreground/45">{g.total} questões registradas</p>
                  </div>
                </div>
                {critico && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    <AlertTriangle className="h-3 w-3" /> Crítico
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl font-semibold tabular-nums text-foreground">{g.erros}</span>
                <span className="text-xs text-foreground/50">{pct}% de erro</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                <div className={["h-full rounded-full", critico ? "bg-accent" : "bg-primary/70"].join(" ")} style={{ width: `${Math.min(pct * 2, 100)}%` }} />
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm rf-fade-in" role="dialog">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated">
            <header className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="font-display text-base font-semibold">Registrar novo erro</h3>
                <p className="text-xs text-foreground/45">Será adicionado ao banco e gerará flashcard automaticamente.</p>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-white/5 hover:bg-white/10" aria-label="Fechar"><X className="h-4 w-4" /></button>
            </header>
            <div className="space-y-3 p-5">
              <Field label="Grande área">
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                  {GRANDES_AREAS.map((g) => <option key={g.nome}>{g.nome}</option>)}
                </select>
              </Field>
              <Field label="Questão / enunciado">
                <textarea rows={3} placeholder="Cole o enunciado…" className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </Field>
              <Field label="Resposta correta">
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </Field>
              <Field label="Tipo de erro">
                <div className="flex flex-wrap gap-2">
                  {["Conceito", "Interpretação", "Atenção", "Memória"].map((t) => (
                    <button key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:border-primary hover:text-primary">{t}</button>
                  ))}
                </div>
              </Field>
            </div>
            <footer className="flex items-center justify-end gap-2 border-t border-border bg-background/30 p-4">
              <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground/65 hover:bg-white/5">Cancelar</button>
              <button onClick={() => setOpen(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Salvar erro</button>
            </footer>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Kpi({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rf-card p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">{label}</div>
      <div className={["mt-1 font-display text-2xl font-semibold tabular-nums", accent ? "text-accent" : "text-foreground"].join(" ")}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-foreground/70">{label}</span>
      {children}
    </label>
  );
}
