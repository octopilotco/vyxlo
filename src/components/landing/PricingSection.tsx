import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const plans = [
  {
    name: "Pro",
    price: "$39",
    description: "For creators getting serious about 𝕏 growth.",
    cta: "Start for free",
    highlight: false,
    features: [
      "AI Content Writer",
      "Daily Inspiration Feed",
      "Post Scheduler",
      "Basic Analytics",
      "Chrome Extension",
      "Email Support",
    ],
  },
  {
    name: "Advanced",
    price: "$29",
    originalPrice: "$49",
    description: "Everything in Pro, plus automation and deep analytics.",
    cta: "Start for free",
    highlight: true,
    badge: "Early adopter pricing",
    features: [
      "Everything in Pro",
      "Advanced Analytics",
      "Algorithm Simulator",
      "Content Library",
      "Auto-Retweet & Auto-Plug",
      "Auto-Delete old posts",
      "Priority Support",
    ],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="border-t border-border section-padding">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
            Pricing
          </p>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Simple plans. No surprises.
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <ScrollReveal key={plan.name} delay={plan.highlight ? 0.1 : 0}>
              <div
                className={`relative h-full rounded-2xl border p-8 transition-colors ${
                  plan.highlight
                    ? "border-primary/30 bg-card glow-orange"
                    : "border-border bg-card/50"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    {plan.badge}
                  </span>
                )}

                <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                  {plan.originalPrice && (
                    <span className="ml-1 text-sm text-muted-foreground line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <Button
                  asChild
                  className={`mt-6 w-full rounded-full py-5 text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  <Link to="/auth">
                    {plan.cta}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>

                <ul className="mt-7 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
