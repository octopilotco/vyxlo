import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Sparkles, Calendar, BookOpen, BarChart3, PenTool, Users, MessageCircle, Settings } from "lucide-react";

const navItems = [
  { icon: Calendar, label: "My Post Queue" },
  { icon: Sparkles, label: "Inspiration", active: true },
  { icon: BookOpen, label: "Library" },
  { icon: BarChart3, label: "Analytics" },
  { icon: PenTool, label: "Content Studio" },
  { icon: Users, label: "Social Hub" },
  { icon: MessageCircle, label: "Engage" },
  { icon: Settings, label: "Context" },
];

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-background">
        <div className="flex items-center gap-2 px-6 py-5 text-xl font-bold text-foreground">
          <span className="text-2xl">🔥</span>
          <span>Vyxlo</span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* AI Usage */}
        <div className="border-t border-border px-4 py-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>AI Usage</span>
            <span>12/50</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary">
            <div className="h-full w-[24%] rounded-full bg-primary" />
          </div>
        </div>

        {/* User */}
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="truncate text-sm text-foreground">{user?.email}</div>
            <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-2xl font-bold text-foreground">Welcome to Vyxlo 🔥</h1>
        <p className="mt-2 text-muted-foreground">Your dashboard is ready. Full features coming soon.</p>
      </main>
    </div>
  );
};

export default Dashboard;
