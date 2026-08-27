import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SIMULADOS, gerarQuestoes, type Questao } from "@/lib/simulados";
import {
  ArrowLeft, ArrowRight, Bookmark, Check, Clock, Flag, Grid3X3, X,
  CheckCircle2, XCircle, MinusCircle, Eye, RotateCcw, Undo2, ChevronLeft,
} from "lucide-react";

export const Route = createFileRoute("/simulados/$id")({
  head: () => ({
    meta: [
      { title: "Resolver simulado — RevisaFlash" },
      { name: "description", content: "Resolva o simulado com cronômetro, eliminação de alternativas, painel de questões e gabarito comentado." },
      { property: "og:title", content: "Resolver simulado — RevisaFlash" },
      { property: "og:description", content: "Experiência completa de prova dentro do RevisaFlash." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SimuladoPlayer,
});

type Fase = "resolvendo" | "resultado" | "correcao";

function SimuladoPlayer() {
  const { id } = useParams({ from: "/simulados/$id" });
  const simulado = SIMULADOS.find((s) => s.id === id) ?? SIMULADOS[0];
  const questoes = useMemo(() => gerarQuestoes(simulado.questoes), [simulado.questoes]);

  const [idx, setIdx] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [eliminadas, setEliminadas] = useState<Record<number, string[]>>({});
  const [marcadas, setMarcadas] = useState<number[]>([]);
  const [painel, setPainel] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [fase, setFase] = useState<Fase>("resolvendo");

  const q = questoes[idx];
  const respondidas = Object.keys(respostas).length;
  const naoRespondidas = questoes.length - respondidas;

  const gabarito = (qq: Questao) => qq.alternativas.find((a) => a.correta)?.letra ?? "";
  const acertos = questoes.filter((qq) => respostas[qq.numero] && respostas[qq.numero] === gabarito(qq)).length;
  const erros = respondidas - acertos;
  const pct = Math.round((acertos / questoes.length) * 100);

  const toggleEliminada = (letra: string) => {
    setEliminadas((prev) => {
      const atual = prev[q.numero] ?? [];
      const nova = atual.includes(letra) ? atual.filter((l) => l !== letra) : [...atual, letra];
      return { ...prev, [q.numero]: nova };
    });
  };

  const responder = (letra: string) => setRespostas((p) => ({ ...p, [q.numero]: letra }));
  const toggleMarcar = () =>
    setMarcadas((p) => (p.includes(q.numero) ? p.filter((n) => n !== q.numero) : [...p, q.numero]));

  /* ---------------- Resultado ---------------- */
  if (fase === "resultado") {
    return (
      <AppShell breadcrumb="Simulados" title="Resultado do simulado">
        <div className="mb-4">
          <Link to="/simulados" className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground">
            <ChevronLeft className="h-3.5 w-3.5" /> Voltar para simulados
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rf-card flex flex-col items-center p-6 text-center">
            <Donut pct={pct} />
            <div className="mt-4 font-display text-2xl font-semibold tabular-nums">
              {acertos} / {questoes.length}
            </div>
            <p className="text-xs text-foreground/50">acertos · {pct}% de aproveitamento</p>
            <p className="mt-3 text-xs text-foreground/45">{simulado.titulo}</p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Acertos" value={acertos} tone="ok" />
              <Stat label="Erros" value={erros} tone="bad" />
              <Stat label="Não respondidas" value={naoRespondidas} />
              <Stat label="Tempo utilizado" value="1h 08min" />
            </div>

            <div className="rf-card p-5">
              <h3 className="mb-3 font-display text-sm font-semibold">Questões</h3>
              <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
                {questoes.map((qq, i) => {
                  const resp = respostas[qq.numero];
                  const certa = resp === gabarito(qq);
                  return (
                    <button
                      key={qq.id}
                      onClick={() => {
                        setIdx(i);
                        setFase("correcao");
                      }}
                      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface/40 px-3 py-2 text-left transition-colors hover:bg-surface"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-medium">Questão {qq.numero}</div>
                        <div className="truncate text-[11px] text-foreground/40">{qq.area}</div>
                      </div>
                      <span
                        className={[
                          "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          !resp ? "bg-white/5 text-foreground/45" : certa ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent",
                        ].join(" ")}
                      >
                        {!resp ? <MinusCircle className="h-3 w-3" /> : certa ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {!resp ? "Não respondida" : certa ? "Você acertou" : "Você errou"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  /* ---------------- Gabarito comentado ---------------- */
  if (fase === "correcao") {
    const resp = respostas[q.numero];
    const correta = gabarito(q);
    const acertou = resp === correta;
    return (
      <AppShell breadcrumb="Simulados" title={`Gabarito comentado — Questão ${q.numero}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button onClick={() => setFase("resultado")} className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground">
            <ChevronLeft className="h-3.5 w-3.5" /> Voltar ao resultado
          </button>
          <div className="flex items-center gap-2">
            <NavBtn disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>
              <ArrowLeft className="h-3.5 w-3.5" /> Anterior
            </NavBtn>
            <NavBtn disabled={idx === questoes.length - 1} onClick={() => setIdx((i) => Math.min(questoes.length - 1, i + 1))}>
              Próxima <ArrowRight className="h-3.5 w-3.5" />
            </NavBtn>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rf-card p-5 sm:p-6">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{q.area}</span>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              <span className="font-display font-semibold">{q.numero}.</span> {q.enunciado}
            </p>

            <div className="mt-5 space-y-2">
              {q.alternativas.map((a) => {
                const isCorreta = !!a.correta;
                const isSua = resp === a.letra;
                return (
                  <div
                    key={a.letra}
                    className={[
                      "rounded-xl border p-3",
                      isCorreta
                        ? "border-primary/50 bg-primary/10"
                        : isSua
                          ? "border-accent/50 bg-accent/10"
                          : "border-border bg-surface/40",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                          isCorreta ? "border-primary text-primary" : isSua ? "border-accent text-accent" : "border-border text-foreground/50",
                        ].join(" ")}
                      >
                        {a.letra}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs leading-relaxed text-foreground/80">{a.texto}</p>
                        <p className="mt-1 text-[11px] text-foreground/45">
                          <span className={isCorreta ? "font-semibold text-primary" : "font-semibold text-foreground/60"}>
                            {isCorreta ? "Correta" : "Incorreta"}
                          </span>{" "}
                          — {a.comentario ?? "Comentário disponível em breve."}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rf-card p-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground/50">Sua resposta</span>
                <span className="font-display text-sm font-semibold">{resp ?? "—"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-foreground/50">Resposta correta</span>
                <span className="font-display text-sm font-semibold text-primary">{correta}</span>
              </div>
              <div
                className={[
                  "mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold",
                  !resp ? "bg-white/5 text-foreground/50" : acertou ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent",
                ].join(" ")}
              >
                {!resp ? <MinusCircle className="h-3.5 w-3.5" /> : acertou ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {!resp ? "Não respondida" : acertou ? "Você acertou" : "Você errou"}
              </div>
            </div>

            <div className="rf-card p-5">
              <h4 className="mb-2 font-display text-sm font-semibold">Comentário</h4>
              <p className="text-xs leading-relaxed text-foreground/60">{q.comentario}</p>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  /* ---------------- Resolução ---------------- */
  const elimAtual = eliminadas[q.numero] ?? [];
  const selecionada = respostas[q.numero];
  const progresso = Math.round(((idx + 1) / questoes.length) * 100);

  return (
    <AppShell breadcrumb="Simulados">
      {/* Cabeçalho da prova */}
      <div className="rf-card mb-4 p-4 sm:p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <Link to="/simulados" className="inline-flex items-center gap-1.5 text-[11px] text-foreground/45 hover:text-foreground">
              <ChevronLeft className="h-3 w-3" /> Sair do simulado
            </Link>
            <h1 className="truncate font-display text-base font-semibold tracking-tight sm:text-lg">{simulado.titulo}</h1>
            <p className="text-[11px] text-foreground/45">
              Questão {idx + 1} de {questoes.length} · {respondidas} respondidas
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span className="font-display text-xs font-semibold tabular-nums text-foreground">01:12:40</span>
            </div>
            <button
              onClick={() => setPainel(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-foreground/70 hover:bg-surface"
            >
              <Grid3X3 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Questões</span>
            </button>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progresso}%` }} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rf-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{q.area}</span>
            <button
              onClick={toggleMarcar}
              className={[
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors",
                marcadas.includes(q.numero)
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-border bg-surface/60 text-foreground/60 hover:bg-surface",
              ].join(" ")}
            >
              <Bookmark className={["h-3.5 w-3.5", marcadas.includes(q.numero) ? "fill-current" : ""].join(" ")} />
              {marcadas.includes(q.numero) ? "Marcada para revisar" : "Marcar para revisar"}
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground/85">
            <span className="font-display font-semibold">{q.numero}.</span> {q.enunciado}
          </p>

          <p className="mt-5 text-[11px] text-foreground/40">
            Toque na alternativa para responder · use o <X className="inline h-3 w-3" /> para eliminar
          </p>

          <div className="mt-2 space-y-2">
            {q.alternativas.map((a) => {
              const eliminada = elimAtual.includes(a.letra);
              const ativa = selecionada === a.letra;
              return (
                <div
                  key={a.letra}
                  className={[
                    "group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border p-3 transition-colors",
                    ativa ? "border-primary bg-primary/10" : "border-border bg-surface/40 hover:bg-surface/70",
                    eliminada ? "opacity-45" : "",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => !eliminada && responder(a.letra)}
                    disabled={eliminada}
                    className="flex min-w-0 items-start gap-3 text-left"
                  >
                    <span
                      className={[
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-colors",
                        ativa ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground/55",
                      ].join(" ")}
                    >
                      {ativa ? <Check className="h-3.5 w-3.5" /> : a.letra}
                    </span>
                    <span className={["min-w-0 text-xs leading-relaxed text-foreground/80", eliminada ? "line-through decoration-accent/70" : ""].join(" ")}>
                      {a.texto}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEliminada(a.letra)}
                    aria-label={eliminada ? `Desfazer eliminação da alternativa ${a.letra}` : `Eliminar alternativa ${a.letra}`}
                    title={eliminada ? "Desfazer eliminação" : "Eliminar alternativa"}
                    className={[
                      "grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-colors",
                      eliminada
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-border text-foreground/35 hover:border-accent/40 hover:text-accent",
                    ].join(" ")}
                  >
                    {eliminada ? <Undo2 className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>

          {elimAtual.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-foreground/45">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">
                {elimAtual.length} eliminada{elimAtual.length > 1 ? "s" : ""}: {elimAtual.join(", ")}
              </span>
              <button onClick={() => setEliminadas((p) => ({ ...p, [q.numero]: [] }))} className="inline-flex items-center gap-1 hover:text-foreground">
                <RotateCcw className="h-3 w-3" /> desfazer todas
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-2">
            <NavBtn disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>
              <ArrowLeft className="h-3.5 w-3.5" /> Anterior
            </NavBtn>
            {idx === questoes.length - 1 ? (
              <button
                onClick={() => setConfirmar(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                <Flag className="h-3.5 w-3.5" /> Finalizar simulado
              </button>
            ) : (
              <button
                onClick={() => setIdx((i) => i + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Próxima <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Painel lateral (desktop) */}
        <aside className="hidden lg:block">
          <div className="rf-card sticky top-20 p-5">
            <PainelQuestoes
              total={questoes.length}
              atual={idx}
              respostas={respostas}
              marcadas={marcadas}
              onPick={(i) => setIdx(i)}
            />
            <button
              onClick={() => setConfirmar(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <Flag className="h-3.5 w-3.5" /> Finalizar simulado
            </button>
          </div>
        </aside>
      </div>

      {/* Painel mobile */}
      {painel && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setPainel(false)}>
          <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">Painel de questões</h3>
              <button onClick={() => setPainel(false)} className="grid h-7 w-7 place-items-center rounded-md text-foreground/50 hover:bg-white/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <PainelQuestoes
              total={questoes.length}
              atual={idx}
              respostas={respostas}
              marcadas={marcadas}
              onPick={(i) => {
                setIdx(i);
                setPainel(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Confirmação de finalização */}
      {confirmar && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display text-lg font-semibold tracking-tight">Finalizar simulado?</h3>
            <p className="mt-1 text-xs text-foreground/50">Depois de finalizar você verá o resultado e o gabarito comentado.</p>
            <div className="mt-4 space-y-2">
              <Linha label="Questões respondidas" value={respondidas} tone="ok" />
              <Linha label="Não respondidas" value={naoRespondidas} tone="bad" />
              <Linha label="Marcadas para revisão" value={marcadas.length} />
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmar(false)}
                className="flex-1 rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-foreground/70 hover:bg-white/5"
              >
                Voltar para o simulado
              </button>
              <button
                onClick={() => {
                  setConfirmar(false);
                  setFase("resultado");
                }}
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function PainelQuestoes({
  total, atual, respostas, marcadas, onPick,
}: {
  total: number;
  atual: number;
  respostas: Record<number, string>;
  marcadas: number[];
  onPick: (i: number) => void;
}) {
  return (
    <div>
      <h4 className="mb-3 font-display text-sm font-semibold">Painel de questões</h4>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-5">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const respondida = !!respostas[n];
          const marcada = marcadas.includes(n);
          const isAtual = i === atual;
          return (
            <button
              key={n}
              onClick={() => onPick(i)}
              className={[
                "relative grid aspect-square place-items-center rounded-lg border text-[11px] font-semibold tabular-nums transition-colors",
                isAtual
                  ? "border-primary bg-primary text-primary-foreground"
                  : respondida
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-surface/40 text-foreground/45 hover:bg-surface",
              ].join(" ")}
            >
              {n}
              {marcada && <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] text-foreground/45">
        <Legenda className="bg-primary" label="Atual" />
        <Legenda className="bg-primary/30" label="Respondida" />
        <Legenda className="bg-white/10" label="Não respondida" />
        <Legenda className="bg-accent" label="Para revisar" />
      </div>
    </div>
  );
}

function Legenda({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={["h-2 w-2 rounded-full", className].join(" ")} /> {label}
    </span>
  );
}

function NavBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-foreground/70 transition-colors hover:bg-surface disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function Linha({ label, value, tone }: { label: string; value: number; tone?: "ok" | "bad" }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface/40 px-3 py-2">
      <span className="text-xs text-foreground/55">{label}</span>
      <span className={["font-display text-sm font-semibold tabular-nums", tone === "ok" ? "text-primary" : tone === "bad" ? "text-accent" : ""].join(" ")}>
        {value}
      </span>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "ok" | "bad" }) {
  return (
    <div className="rf-card p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">{label}</div>
      <div className={["mt-1.5 font-display text-2xl font-semibold tabular-nums", tone === "ok" ? "text-primary" : tone === "bad" ? "text-accent" : "text-foreground"].join(" ")}>
        {value}
      </div>
    </div>
  );
}

function Donut({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-36 w-36 place-items-center">
      <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-white/5" />
        <circle
          cx="60" cy="60" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
          className="stroke-primary" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
        />
      </svg>
      <div className="absolute grid place-items-center">
        <span className="font-display text-3xl font-semibold tabular-nums">{pct}%</span>
        <span className="text-[10px] uppercase tracking-widest text-foreground/40">aproveit.</span>
      </div>
    </div>
  );
}

export { Eye };
