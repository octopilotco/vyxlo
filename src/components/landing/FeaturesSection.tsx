import { Lightbulb, PenTool, Clock, BarChart3 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: Lightbulb,
    label: "Inspiration",
    title: "Ideas that fit your voice",
    description:
      "Every morning, Vyxlo surfaces fresh content ideas based on your niche, your style, and what's working right now. No more blank screen panic.",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: PenTool,
    label: "AI Writer",
    title: "Draft to publish in seconds",
    description:
      "Turn a rough idea into a polished tweet or thread. The AI writes like you — not like a robot — because it learns your tone.",
    span: "col-span-1",
  },
  {
    icon: Clock,
    label: "Scheduler",
    title: "Post when it matters",
    description:
      "Queue content for when your audience is most active. Set it up once, stay consistent forever. No more manual posting.",
    span: "col-span-1",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    title: "Know what's working",
    description:
      "Track impressions, engagement, and follower growth in one clean dashboard. See exactly which posts perform and why.",
    span: "col-span-1 md:col-span-2",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="border-t border-border section-padding">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
            How it works
          </p>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.label} delay={index * 0.08}>
              <div
                className={`group h-full rounded-2xl border border-border bg-card/50 p-7 transition-all duration-300 hover:border-muted-foreground/20 hover:bg-card ${feature.span}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                  {feature.label}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
