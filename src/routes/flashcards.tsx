import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DECKS, FLASHCARD_DEMO } from "@/lib/mock";
import { Plus, RotateCw, ChevronLeft, Layers, Sparkles } from "lucide-react";

export const Route = createFileRoute("/flashcards")({
  head: () => ({ meta: [{ title: "Flashcards — RevisaFlash" }] }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const [modo, setModo] = useState<"decks" | "estudo">("decks");
  const [virado, setVirado] = useState(false);

  if (modo === "estudo") {
    return (
      <AppShell breadcrumb="Flashcards · Estudo">
        <button onClick={() => { setModo("decks"); setVirado(false); }} className="mb-6 inline-flex items-center gap-1 text-xs font-medium text-foreground/55 hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" /> Voltar aos decks
        </button>

        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-xs">
            <span className="font-medium text-primary uppercase tracking-widest">{FLASHCARD_DEMO.area}</span>
            <span className="text-foreground/50 tabular-nums">Card {FLASHCARD_DEMO.posicao} de {FLASHCARD_DEMO.total}</span>
          </div>
          <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(FLASHCARD_DEMO.posicao / FLASHCARD_DEMO.total) * 100}%` }} />
          </div>

          <button
            onClick={() => setVirado((v) => !v)}
            className="mt-6 grid min-h-[300px] w-full place-items-center rounded-2xl border border-border bg-surface p-10 text-center transition-all hover:border-primary/40 sm:min-h-[360px]"
            style={{ boxShadow: virado ? "var(--shadow-glow)" : undefined }}
          >
            {!virado ? (
              <div className="space-y-5">
                <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">Pergunta</div>
                <p className="text-balance font-display text-xl font-medium leading-snug sm:text-2xl">{FLASHCARD_DEMO.pergunta}</p>
                <p className="text-xs text-foreground/40">Clique para revelar a resposta</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">Resposta</div>
                <p className="text-balance text-lg font-medium text-primary leading-snug sm:text-xl">"Favo de mel" ou "bolhas de sabão"</p>
                <p className="max-w-md text-sm leading-relaxed text-foreground/65">{FLASHCARD_DEMO.resposta}</p>
              </div>
            )}
          </button>

          {virado && (
            <div className="mt-6 grid grid-cols-4 gap-2 rf-fade-in">
              <FsrsButton label="Errei" hint="10 min" tone="accent" />
              <FsrsButton label="Difícil" hint="2 dias" />
              <FsrsButton label="Bom" hint="4 dias" primary />
              <FsrsButton label="Fácil" hint="12 dias" />
            </div>
          )}

          {!virado && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-foreground/40">
              <RotateCw className="h-3 w-3" /> Espaço para virar · 1/2/3/4 para avaliar
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumb="Flashcards" title="Decks">
      <p className="-mt-4 mb-6 max-w-xl text-sm text-foreground/55">
        Algoritmo de repetição espaçada FSRS. Cards são apresentados no momento ideal para fixar o conteúdo.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Mini icon={<Layers className="h-4 w-4" />} l="Decks" v={DECKS.length} />
        <Mini icon={<Sparkles className="h-4 w-4" />} l="Cards totais" v={DECKS.reduce((a, d) => a + d.total, 0)} />
        <Mini l="Para revisar" v={DECKS.reduce((a, d) => a + d.due, 0)} tone="accent" />
        <Mini l="Novos" v={DECKS.reduce((a, d) => a + d.novos, 0)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {DECKS.map((d) => (
          <article key={d.id} className="rf-card rf-card-hover p-5">
            <header className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-display text-base font-semibold">{d.nome}</h3>
                <p className="mt-0.5 text-xs text-foreground/45">{d.desc}</p>
              </div>
              <button className="grid h-7 w-7 place-items-center rounded-md text-foreground/40 hover:bg-white/5 hover:text-foreground" aria-label="Mais">⋯</button>
            </header>

            <div className="grid grid-cols-3 gap-2 rounded-lg bg-background/40 p-3 text-center">
              <Pill l="Total" v={d.total} />
              <Pill l="Due" v={d.due} accent />
              <Pill l="Novos" v={d.novos} />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => { setModo("estudo"); setVirado(false); }}
                disabled={d.due === 0}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
              >
                {d.due > 0 ? `Estudar ${d.due} cards` : "Nada para hoje"}
              </button>
              <button className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-medium text-foreground/70 hover:bg-white/5">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

function FsrsButton({ label, hint, tone = "default", primary }: { label: string; hint: string; tone?: "default" | "accent"; primary?: boolean }) {
  return (
    <button className={[
      "flex flex-col items-center gap-0.5 rounded-xl border bg-background/60 px-2 py-3 transition-all hover:-translate-y-0.5",
      primary ? "border-primary/60 ring-1 ring-primary/30" : "border-border hover:border-primary/40",
    ].join(" ")}>
      <span className={["text-xs font-semibold", tone === "accent" ? "text-accent" : primary ? "text-primary" : "text-foreground/85"].join(" ")}>{label}</span>
      <span className="text-[10px] text-foreground/40">{hint}</span>
    </button>
  );
}

function Mini({ l, v, icon, tone }: { l: string; v: React.ReactNode; icon?: React.ReactNode; tone?: "accent" }) {
  return (
    <div className="rf-card p-4">
      {icon && <div className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">{icon}</div>}
      <div className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">{l}</div>
      <div className={["mt-1 font-display text-xl font-semibold tabular-nums", tone === "accent" ? "text-accent" : ""].join(" ")}>{v}</div>
    </div>
  );
}

function Pill({ l, v, accent }: { l: string; v: number; accent?: boolean }) {
  return (
    <div>
      <div className={["font-display text-sm font-semibold tabular-nums", accent ? "text-accent" : "text-foreground"].join(" ")}>{v}</div>
      <div className="text-[10px] uppercase tracking-widest text-foreground/40">{l}</div>
    </div>
  );
}
