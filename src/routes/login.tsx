import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Lock, Github } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — RevisaFlash" },
      { name: "description", content: "Acesse sua conta no RevisaFlash." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("mariana@revisaflash.app");
  const [senha, setSenha] = useState("");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden border-r border-border bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(800px 400px at 20% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%), radial-gradient(600px 300px at 90% 100%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%)",
          }}
        />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-base font-bold">R</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">RevisaFlash</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary">ENARE 2026 · Odontologia</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-balance">
            Revise como quem faz curativo: <span className="text-primary">no tempo certo</span>,
            <br /> com a técnica certa.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-foreground/55">
            Plano de estudos, flashcards com algoritmo FSRS, banco de erros por grande área e
            relatórios de desempenho — todos sincronizados offline.
          </p>
          <ul className="grid max-w-md grid-cols-3 gap-3 pt-2">
            {[
              { n: "12", l: "dias de streak" },
              { n: "2.4k", l: "cards revisados" },
              { n: "78%", l: "acertos médios" },
            ].map((s) => (
              <li key={s.l} className="rounded-xl border border-border bg-background/40 p-3">
                <div className="font-display text-xl font-semibold text-primary tabular-nums">{s.n}</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/45">{s.l}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-[11px] text-foreground/40">© 2026 RevisaFlash · Protótipo visual</div>
      </aside>

      {/* Form */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm space-y-8 rf-fade-in">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-base font-bold">R</span>
            </div>
            <span className="font-display text-lg font-semibold">RevisaFlash</span>
          </div>

          <header className="space-y-1.5">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Bem-vinda de volta</h2>
            <p className="text-sm text-foreground/55">Entre para continuar de onde parou.</p>
          </header>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-foreground/70">E-mail</span>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 transition-colors focus-within:border-primary">
                <Mail className="h-4 w-4 text-foreground/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-foreground/30"
                  placeholder="seu@email.com"
                />
              </div>
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground/70">Senha</span>
                <a href="#" className="text-xs text-primary hover:underline">Esqueci minha senha</a>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 transition-colors focus-within:border-primary">
                <Lock className="h-4 w-4 text-foreground/40" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-foreground/30"
                  placeholder="••••••••"
                />
              </div>
            </label>

            <Link
              to="/"
              className="group flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99]"
            >
              Entrar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </form>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-foreground/35">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-2">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden><path fill="#EA4335" d="M12 11v3.9h5.5c-.24 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 4.6 14.6 3.5 12 3.5 6.9 3.5 2.8 7.6 2.8 12.7S6.9 21.9 12 21.9c6.9 0 9.2-4.8 9.2-7.3 0-.5-.1-.9-.1-1.3H12z"/></svg>
              Continuar com Google
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface-2">
              <Github className="h-4 w-4" /> Continuar com GitHub
            </button>
          </div>

          <p className="text-center text-xs text-foreground/45">
            Não tem conta? <a href="#" className="font-medium text-primary hover:underline">Criar conta</a>
          </p>
        </div>
      </section>
    </div>
  );
}
