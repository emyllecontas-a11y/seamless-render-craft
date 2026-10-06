import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { SIMULADOS, statusLabel, type Simulado } from "@/lib/simulados";
import { Clock, ListChecks, Play, RotateCcw, Upload, FileText, CheckCircle2, Layers } from "lucide-react";

export const Route = createFileRoute("/simulados/")({
  head: () => ({
    meta: [
      { title: "Simulados — RevisaFlash" },
      { name: "description", content: "Resolva simulados no formato da prova, com eliminação de alternativas, painel de questões e gabarito comentado." },
      { property: "og:title", content: "Simulados — RevisaFlash" },
      { property: "og:description", content: "Simulados interativos com gabarito comentado para a sua residência." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SimuladosPage,
});

function SimuladosPage() {
  const concluidos = SIMULADOS.filter((s) => s.status === "concluido");
  const emAndamento = SIMULADOS.filter((s) => s.status === "em-andamento");

  return (
    <AppShell breadcrumb="Simulados" title="Simulados">
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Disponíveis" value={SIMULADOS.length} icon={<Layers className="h-3.5 w-3.5" />} />
        <Kpi label="Em andamento" value={emAndamento.length} icon={<Clock className="h-3.5 w-3.5" />} accent />
        <Kpi label="Concluídos" value={concluidos.length} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
        <Kpi label="Média geral" value="76%" icon={<ListChecks className="h-3.5 w-3.5" />} accent />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {SIMULADOS.map((s) => (
          <SimuladoCard key={s.id} s={s} />
        ))}

        {/* Área para futuros simulados (importação de PDF) */}
        <article className="grid place-items-center rounded-2xl border border-dashed border-border/80 bg-surface/25 p-8 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-display text-sm font-semibold">Adicionar novo simulado</h3>
          <p className="mt-1 max-w-xs text-xs text-foreground/45">
            Em breve você poderá enviar o PDF do caderno de questões e o RevisaFlash montará o simulado interativo com gabarito comentado.
          </p>
          <Button variant="outline" className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-foreground/70 hover:bg-surface">
            <FileText className="h-3.5 w-3.5" /> Enviar PDF
          </Button>
        </article>
      </div>
    </AppShell>
  );
}

function SimuladoCard({ s }: { s: Simulado }) {
  const pct = Math.round((s.progresso / s.questoes) * 100);
  const concluido = s.status === "concluido";
  const andamento = s.status === "em-andamento";

  return (
    <article className="rf-library-card flex flex-col p-6">
      <div className="flex flex-col-reverse items-start gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{s.area}</span>
            <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-foreground/50">{s.nivel}</span>
            <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-foreground/50">
              {s.banca} · {s.ano}
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{s.titulo}</h3>
          <p className="mt-1 text-xs text-foreground/50">{s.descricao}</p>
        </div>
        <span
          className={[
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            concluido ? "bg-primary/15 text-primary" : andamento ? "bg-accent/15 text-accent" : "bg-foreground/5 text-foreground/45",
          ].join(" ")}
        >
          {statusLabel[s.status]}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-foreground/55">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="h-3.5 w-3.5" /> {s.questoes} questões
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {s.minutos >= 60 ? `${Math.floor(s.minutos / 60)}h${s.minutos % 60 ? ` ${s.minutos % 60}min` : ""}` : `${s.minutos}min`}
        </span>
      </div>

      {(andamento || concluido) && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-foreground/45">
            <span>{concluido ? "Aproveitamento" : "Progresso"}</span>
            <span className="tabular-nums">
              {concluido && s.resultado
                ? `${s.resultado.acertos}/${s.questoes} · ${Math.round((s.resultado.acertos / s.questoes) * 100)}%`
                : `${s.progresso}/${s.questoes} · ${pct}%`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-foreground/5">
            <div
              className={["h-full rounded-full", concluido ? "bg-primary" : "bg-accent"].join(" ")}
              style={{
                width: `${concluido && s.resultado ? Math.round((s.resultado.acertos / s.questoes) * 100) : pct}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        <Link
          to="/simulados/$id"
          params={{ id: s.id }}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {concluido ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {concluido ? "Refazer simulado" : andamento ? "Continuar" : "Iniciar simulado"}
        </Link>
        {concluido && (
          <Link
            to="/simulados/$id"
            params={{ id: s.id }}
            search={{ view: "resultado" }}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-foreground/70 hover:bg-surface"
          >
            Ver resultado
          </Link>
        )}
      </div>
    </article>
  );
}

function Kpi({ label, value, icon, accent }: { label: string; value: string | number; icon: React.ReactNode; accent?: boolean }) {
  return (
    <div className="rf-card p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-foreground/40">
        {icon} {label}
      </div>
      <div className={["mt-1.5 font-display text-2xl font-semibold tabular-nums", accent ? "text-accent" : "text-foreground"].join(" ")}>{value}</div>
    </div>
  );
}
