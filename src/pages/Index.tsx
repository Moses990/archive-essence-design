import { useState } from "react";
import { Sidebar } from "@/components/vault/Sidebar";
import { TopBar } from "@/components/vault/TopBar";
import { CommandPalette } from "@/components/vault/CommandPalette";
import Dashboard from "@/components/vault/views/Dashboard";
import Projects from "@/components/vault/views/Projects";
import CadCenter from "@/components/vault/views/CadCenter";
import HistoryView from "@/components/vault/views/HistoryView";
import AiCenter from "@/components/vault/views/AiCenter";
import Settings from "@/components/vault/views/Settings";
import ProjectDetail from "@/components/vault/views/ProjectDetail";
import type { ViewKey } from "@/components/vault/types";
import { defaultFilter, type ProjectsFilter } from "@/components/vault/data/projects";

const Index = () => {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [projectsFilter, setProjectsFilter] = useState<ProjectsFilter>(defaultFilter);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-background text-foreground">
      <Sidebar active={view} onNavigate={setView} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar view={view} onOpenPalette={() => setPaletteOpen(true)} onNavigate={setView} />
        <main className="flex-1 overflow-y-auto scroll-thin animate-fade-in" key={view}>
          {view === "dashboard" && <Dashboard onNavigate={setView} />}
          {view === "projects" && <Projects onNavigate={setView} filter={projectsFilter} setFilter={setProjectsFilter} />}
          {view === "cad" && <CadCenter />}
          {view === "history" && <HistoryView />}
          {view === "ai" && <AiCenter />}
          {view === "settings" && <Settings />}
          {view === "project-detail" && <ProjectDetail />}
        </main>
      </div>
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onNavigate={setView}
        filter={projectsFilter}
        setFilter={setProjectsFilter}
      />
    </div>
  );
};

export default Index;
