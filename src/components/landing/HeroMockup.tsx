import vyxloLogo from "@/assets/vyxlo-logo.png";
import { Button } from "@/components/ui/button";
import { BarChart3, BookOpen, Lightbulb, PenTool, Send, Sparkles } from "lucide-react";

const sidebarItems = [
  { icon: PenTool, label: "Content Studio" },
  { icon: Lightbulb, label: "Inspiration", active: true },
  { icon: BookOpen, label: "Library" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Send, label: "Post Queue" },
  { icon: Sparkles, label: "AI Chat" },
];

const HeroMockup = () => {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Glow behind mockup */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/[0.06] blur-[60px]" />

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/30">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
          <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
          <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
          <div className="mx-auto rounded-md bg-muted/60 px-12 py-1 text-[10px] text-muted-foreground/50">
            app.vyxlo.com
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-44 border-r border-border/60 bg-background/50 p-3 md:block">
            <div className="flex items-center gap-2 px-2 pb-4">
              <img src={vyxloLogo} alt="Vyxlo" className="h-6 w-6 rounded" />
              <span className="text-sm font-semibold text-foreground">Vyxlo</span>
            </div>
            <div className="space-y-0.5">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                    item.active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Inspiration</h2>
              <div className="flex gap-1.5 text-xs text-muted-foreground">
                {["All", "Trending", "Viral", "Niche"].map((tab, i) => (
                  <span
                    key={tab}
                    className={`rounded-full px-3 py-1 ${
                      i === 0 ? "bg-primary/10 font-medium text-primary" : "hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Content ideas tailored to your voice and niche
            </p>

            {/* Tweet cards */}
            <div className="mt-4 space-y-2.5">
              {[
                {
                  name: "Tibo",
                  handle: "@tibo_maker",
                  text: "Stop overthinking your content strategy. The best creators post daily and iterate. Volume beats perfection every time.",
                  tag: "Growth",
                },
                {
                  name: "Alex",
                  handle: "@alexgarcia",
                  text: "I spent 6 months building an audience before I had a product. Best decision I ever made.",
                  tag: "Strategy",
                },
              ].map((tweet) => (
                <div
                  key={tweet.handle}
                  className="rounded-xl border border-border/60 bg-background/40 p-3.5 transition-colors hover:border-muted-foreground/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted" />
                    <span className="text-sm font-medium text-foreground">{tweet.name}</span>
                    <span className="text-xs text-muted-foreground">{tweet.handle}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {tweet.text}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                      {tweet.tag}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 rounded-full px-3 text-[11px] text-primary hover:bg-primary/10"
                    >
                      Use this
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroMockup;
