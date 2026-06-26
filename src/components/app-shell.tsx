import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, BookOpen, Calendar, AlertTriangle, Layers, BarChart3, Settings,
  Search, Flame, LogOut, ChevronRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { USER, STREAK, PROVA, diasAteProva, ROTAS } from "@/lib/mock";

const ICONS = { home: Home, book: BookOpen, calendar: Calendar, alert: AlertTriangle, layers: Layers, chart: BarChart3, settings: Settings } as const;

function NavItem({ to, label, iconKey, active }: { to: string; label: string; iconKey: keyof typeof ICONS; active: boolean }) {
  const Icon = ICONS[iconKey];
  return (
    <Link
      to={to}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-foreground/60 hover:bg-white/5 hover:text-foreground",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
    </Link>
  );
}

export function AppShell({ children, title, breadcrumb }: { children: ReactNode; title?: string; breadcrumb?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dias = diasAteProva();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <span className="font-display text-sm font-bold">R</span>
          </div>
          <div>
            <div className="font-display text-base font-semibold tracking-tight">RevisaFlash</div>
            <div className="text-[10px] uppercase tracking-widest text-foreground/40">{PROVA.nome}</div>
          </div>
        </div>

        <div className="px-3">
          <button className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface/40 px-3 py-2 text-left text-xs text-foreground/50 transition-colors hover:bg-surface/70">
            <Search className="h-3.5 w-3.5" />
            <span>Buscar disciplina, tópico…</span>
            <kbd className="ml-auto rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-foreground/40">⌘K</kbd>
          </button>
        </div>

        <nav className="mt-5 flex-1 space-y-0.5 px-3">
          <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/30">Principal</div>
          {ROTAS.map((r) => (
            <NavItem
              key={r.to}
              to={r.to}
              label={r.label}
              iconKey={r.icon as keyof typeof ICONS}
              active={pathname === r.to}
            />
          ))}
        </nav>

        <div className="m-3 rounded-xl border border-border bg-surface/60 p-3">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-foreground/40">
            <Flame className="h-3 w-3 text-accent" /> Streak
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-display text-2xl font-semibold tabular-nums">{STREAK}</span>
            <span className="text-xs text-foreground/50">dias seguidos</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: "72%" }} />
          </div>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 font-display text-xs font-semibold text-accent">{USER.initials}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium">{USER.name}</div>
              <div className="truncate text-[10px] text-foreground/40">{USER.plan}</div>
            </div>
            <Link to="/login" className="grid h-7 w-7 place-items-center rounded-md text-foreground/40 hover:bg-white/5 hover:text-foreground" aria-label="Sair">
              <LogOut className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[248px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <span className="font-display text-xs font-bold">R</span>
              </div>
              <span className="font-display text-sm font-semibold">RevisaFlash</span>
            </Link>
            <div className="hidden items-center gap-2 text-xs lg:flex">
              <span className="text-foreground/40">RevisaFlash</span>
              {breadcrumb && (
                <>
                  <ChevronRight className="h-3 w-3 text-foreground/30" />
                  <span className="text-foreground/70">{breadcrumb}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 sm:flex">
              <span className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">Prova</span>
              <span className="text-xs font-medium text-foreground">13 set 2026</span>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">{dias}d</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary rf-pulse" />
              <span className="text-xs font-medium text-primary">{STREAK}d</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="rf-fade-in mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {title && (
            <div className="mb-6 flex flex-col gap-1">
              {breadcrumb && <span className="text-[11px] font-medium uppercase tracking-widest text-foreground/40">{breadcrumb}</span>}
              <h1 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <BottomNav pathname={pathname} />
    </div>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  const items = ROTAS.slice(0, 5);
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-2xl border border-white/10 bg-surface/85 px-2 py-2 backdrop-blur-xl shadow-elevated">
        {items.map((r) => {
          const Icon = ICONS[r.icon as keyof typeof ICONS];
          const active = pathname === r.to;
          return (
            <Link
              key={r.to}
              to={r.to}
              className={[
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors",
                active ? "text-primary" : "text-foreground/45",
              ].join(" ")}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="text-[10px] font-medium">{r.label}</span>
              <span className={["h-0.5 w-4 rounded-full transition-colors", active ? "bg-primary" : "bg-transparent"].join(" ")} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
