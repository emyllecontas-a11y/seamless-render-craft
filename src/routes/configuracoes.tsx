import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { USER, PROVA } from "@/lib/mock";
import { Bell, Moon, Sun, Download, Trash2, LogOut, CloudCheck } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — RevisaFlash" }] }),
  component: ConfigPage,
});

function ConfigPage() {
  const [tema, setTema] = useState<"escuro" | "claro" | "sistema">("escuro");
  const [notif, setNotif] = useState(true);
  const [som, setSom] = useState(false);
  const [sync, setSync] = useState(true);

  return (
    <AppShell breadcrumb="Configurações" title="Configurações">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav className="rf-card p-2 lg:sticky lg:top-20 lg:self-start">
          {[
            ["perfil", "Perfil"],
            ["aparencia", "Aparência"],
            ["notificacoes", "Notificações"],
            ["estudo", "Plano de estudos"],
            ["dados", "Dados e sincronização"],
            ["conta", "Conta"],
          ].map(([k, l], i) => (
            <a key={k} href={`#${k}`} className={["block rounded-md px-3 py-2 text-sm transition-colors", i === 0 ? "bg-primary/10 text-primary font-medium" : "text-foreground/65 hover:bg-white/5"].join(" ")}>{l}</a>
          ))}
        </nav>

        <div className="space-y-4">
          <Section id="perfil" title="Perfil" desc="Suas informações pessoais.">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-accent/15 font-display text-lg font-semibold text-accent">{USER.initials}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{USER.name}</div>
                <div className="text-xs text-foreground/45">{USER.email}</div>
              </div>
              <button className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium hover:bg-white/5">Alterar foto</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Nome completo" defaultValue={USER.name} />
              <Input label="E-mail" defaultValue={USER.email} />
            </div>
          </Section>

          <Section id="aparencia" title="Aparência" desc="Tema da interface.">
            <div className="grid grid-cols-3 gap-2">
              {([
                ["escuro", "Escuro", <Moon key="m" className="h-4 w-4" />],
                ["claro", "Claro", <Sun key="s" className="h-4 w-4" />],
                ["sistema", "Sistema", <span key="sys" className="text-xs font-bold">A</span>],
              ] as const).map(([k, l, i]) => (
                <button
                  key={k as string}
                  onClick={() => setTema(k as typeof tema)}
                  className={[
                    "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                    tema === k
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface-2 text-foreground/70 hover:bg-white/5",
                  ].join(" ")}
                >
                  {i} {l}
                </button>
              ))}
            </div>
          </Section>

          <Section id="notificacoes" title="Notificações" desc="Lembretes de revisões e metas.">
            <Toggle label="Lembrete diário de estudo" desc="Notificação às 7h30 com seu checklist" on={notif} onChange={setNotif} icon={<Bell className="h-4 w-4" />} />
            <Toggle label="Som ao acertar flashcard" desc="Feedback sonoro discreto" on={som} onChange={setSom} />
          </Section>

          <Section id="estudo" title="Plano de estudos" desc="Configurações da sua prova-alvo.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Prova-alvo" defaultValue={PROVA.nome} />
              <Input label="Data da prova" type="date" defaultValue="2026-09-13" />
              <Input label="Meta diária de cards" type="number" defaultValue="80" />
              <Input label="Meta semanal de horas" type="number" defaultValue="20" />
            </div>
          </Section>

          <Section id="dados" title="Dados e sincronização" desc="Sincronização offline e exportações.">
            <Toggle label="Sincronização automática" desc="Mantém os dados em todos os dispositivos" on={sync} onChange={setSync} icon={<CloudCheck className="h-4 w-4" />} />
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-medium hover:bg-white/5">
                <Download className="h-3.5 w-3.5" /> Exportar dados (JSON)
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/15">
                <Trash2 className="h-3.5 w-3.5" /> Limpar cache local
              </button>
            </div>
          </Section>

          <Section id="conta" title="Conta" desc="Encerrar sessão ou excluir conta.">
            <div className="flex flex-wrap gap-2">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm font-medium hover:bg-white/5">
                <LogOut className="h-4 w-4" /> Sair
              </Link>
              <button className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/15">
                <Trash2 className="h-4 w-4" /> Excluir conta
              </button>
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ id, title, desc, children }: { id: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rf-card p-5 scroll-mt-20">
      <header className="mb-4">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        <p className="text-xs text-foreground/45">{desc}</p>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Input({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-foreground/70">{label}</span>
      <input {...rest} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary" />
    </label>
  );
}

function Toggle({ label, desc, on, onChange, icon }: { label: string; desc?: string; on: boolean; onChange: (b: boolean) => void; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background/30 p-3">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">{icon}</div>}
        <div>
          <div className="text-sm font-medium">{label}</div>
          {desc && <div className="text-xs text-foreground/45">{desc}</div>}
        </div>
      </div>
      <button
        onClick={() => onChange(!on)}
        role="switch"
        aria-checked={on}
        className={["relative h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-primary" : "bg-white/10"].join(" ")}
      >
        <span className={["absolute top-0.5 grid h-4 w-4 place-items-center rounded-full bg-background shadow transition-all", on ? "left-[18px]" : "left-0.5"].join(" ")} />
      </button>
    </div>
  );
}
