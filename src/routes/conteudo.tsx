import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DISCIPLINAS } from "@/lib/mock";
import { Plus, Search, ChevronRight, FileText, Upload } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/conteudo")({
  head: () => ({ meta: [{ title: "Conteúdo — RevisaFlash" }] }),
  component: ConteudoPage,
});

function ConteudoPage() {
  const [filtro, setFiltro] = useState<"todas" | "em-andamento" | "concluido" | "iniciar">("todas");
  const lista = DISCIPLINAS.filter((d) => filtro === "todas" || d.status === filtro);

  return (
    <AppShell breadcrumb="Conteúdo" title="Disciplinas e materiais">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {([
            ["todas", "Todas"],
            ["em-andamento", "Em andamento"],
            ["concluido", "Concluídas"],
            ["iniciar", "Não iniciadas"],
          ] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFiltro(k)}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filtro === k
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-foreground/65 hover:bg-surface-2",
              ].join(" ")}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-foreground/40" />
            <input placeholder="Buscar disciplina…" className="w-44 bg-transparent text-xs outline-none placeholder:text-foreground/35" />
          </div>
          <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> Nova disciplina
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {lista.map((d) => (
          <article key={d.nome} className="rf-card rf-card-hover group flex items-center gap-4 p-4 sm:p-5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 font-display text-base font-semibold text-primary">
              {d.nome.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="truncate text-sm font-semibold sm:text-base">{d.nome}</h3>
                <StatusBadge status={d.status as "em-andamento" | "concluido" | "iniciar"} />
              </div>
              <div className="mt-0.5 text-xs text-foreground/45">
                {d.topicos} tópicos · {d.cards} cards
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div className={[
                    "h-full rounded-full transition-all",
                    d.progresso === 100 ? "bg-primary" : d.progresso === 0 ? "bg-foreground/15" : "bg-gradient-to-r from-primary to-primary/60",
                  ].join(" ")} style={{ width: `${d.progresso}%` }} />
                </div>
                <span className="text-xs font-medium tabular-nums text-foreground/70 w-10 text-right">{d.progresso}%</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </article>
        ))}
      </div>

      {/* Materiais drawer-like section */}
      <section className="mt-10">
        <header className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold">Materiais recentes</h2>
          <button className="text-xs font-medium text-primary hover:underline">Enviar arquivo</button>
        </header>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { n: "Resumo Periodontia 2024.pdf", t: "PDF · 2.1 MB", a: "Periodontia" },
            { n: "Mapa Cárie.png", t: "Imagem · 880 KB", a: "Cariologia" },
            { n: "Antibióticos.docx", t: "DOCX · 420 KB", a: "Farmacologia" },
          ].map((f) => (
            <div key={f.n} className="rf-card p-4 rf-card-hover">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-accent/10 text-accent">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{f.n}</div>
                  <div className="text-[11px] text-foreground/45">{f.t} · {f.a}</div>
                </div>
              </div>
            </div>
          ))}
          <button className="grid place-items-center gap-2 rounded-xl border border-dashed border-border bg-surface/30 p-6 text-xs text-foreground/50 transition-colors hover:border-primary/50 hover:text-primary">
            <Upload className="h-4 w-4" /> Arraste arquivos ou clique para enviar
          </button>
        </div>
      </section>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: "em-andamento" | "concluido" | "iniciar" }) {
  const map = {
    "em-andamento": { l: "Em andamento", c: "bg-primary/10 text-primary" },
    "concluido": { l: "Concluído", c: "bg-primary/15 text-primary" },
    "iniciar": { l: "Iniciar", c: "bg-accent/10 text-accent" },
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${map[status].c}`}>{map[status].l}</span>;
}
