import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Paperclip, Mic, Zap, Sparkles } from "lucide-react";

export const Route = createFileRoute("/flash-ia")({
  head: () => ({ meta: [{ title: "Flash IA — RevisaFlash" }] }),
  component: FlashIAPage,
});

const OPCOES = [
  { id: "resumo", label: "📄 Resumo" },
  { id: "flashcards", label: "🃏 Flashcards" },
  { id: "tabela", label: "📊 Tabela Mestra" },
  { id: "macetes", label: "🧠 Macetes" },
  { id: "simplificado", label: "🗣️ Explicação Simplificada" },
];

function FlashIAPage() {
  const [texto, setTexto] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>(["flashcards"]);

  return (
    <AppShell
      title={
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Flash IA
        </span>
      }
      breadcrumb="Flash IA"
    >
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-foreground/55">
        Transforme seus arquivos, textos ou áudios em materiais de estudo personalizados com IA.
      </p>

      {/* Área de entrada estilo chat */}
      <Card className="relative overflow-hidden border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
        <Textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole seu texto, faça upload de PDF ou grave um áudio aqui..."
          className="min-h-[140px] resize-y border-0 bg-transparent p-0 text-base leading-relaxed text-foreground placeholder:text-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-[180px]"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 border-border bg-background/60 text-xs text-foreground/70 hover:bg-background hover:text-foreground">
              <Paperclip className="h-3.5 w-3.5" />
              Anexar arquivo
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-border bg-background/60 text-xs text-foreground/70 hover:bg-background hover:text-foreground">
              <Mic className="h-3.5 w-3.5" />
              Gravar áudio
            </Button>
            <span className="hidden text-[10px] text-foreground/40 sm:inline">PDF ou TXT · até 20 MB</span>
          </div>
        </div>
      </Card>

      {/* Opções de geração */}
      <div className="mt-4 flex flex-wrap gap-2">
        <ToggleGroup
          type="multiple"
          value={selecionados}
          onValueChange={(v) => v.length && setSelecionados(v)}
          className="flex-wrap justify-start gap-2"
        >
          {OPCOES.map((op) => (
            <ToggleGroupItem
              key={op.id}
              value={op.id}
              className="rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground/70 transition-colors hover:bg-white/5 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {op.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Botão de ação */}
      <Button className="mt-5 h-11 w-full gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:bg-primary/90 sm:w-auto">
        <Zap className="h-4 w-4" />
        Gerar Materiais
      </Button>

      {/* Área de resultados */}
      <Card className="mt-6 flex min-h-[280px] flex-col items-center justify-center border border-dashed border-border bg-muted/20 p-8 text-center sm:min-h-[360px]">
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Zap className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-foreground/40">Os materiais gerados aparecerão aqui</p>
        <p className="mt-1 max-w-xs text-xs text-foreground/30">
          Escolha um ou mais formatos acima e envie seu conteúdo para começar.
        </p>
      </Card>
    </AppShell>
  );
}
