import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, X, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const DEFAULT_CONTEXTS = [
  { label: "My Brand Voice", value: "" },
  { label: "Target Audience", value: "" },
  { label: "Topics", value: "" },
];

interface ContextItem {
  id?: string;
  label: string;
  value: string;
  isNew?: boolean;
}

const ContextPage = () => {
  const { user } = useAuth();
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) loadContexts();
  }, [user]);

  const loadContexts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_contexts")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setContexts(data.map((d) => ({ id: d.id, label: d.label, value: d.value })));
      } else {
        // seed with defaults for new users
        setContexts(DEFAULT_CONTEXTS.map((c) => ({ ...c, isNew: true })));
      }

      // load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user!.id)
        .single();

      if (profile) {
        setDisplayName(profile.full_name || "");
        setXHandle(profile.email || "");
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load context", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveContexts = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Upsert all contexts
      for (const ctx of contexts) {
        if (ctx.id) {
          // update
          await supabase
            .from("user_contexts")
            .update({ label: ctx.label, value: ctx.value })
            .eq("id", ctx.id);
        } else {
          // insert
          const { data } = await supabase
            .from("user_contexts")
            .insert({ user_id: user.id, label: ctx.label, value: ctx.value })
            .select()
            .single();
          if (data) ctx.id = data.id;
          ctx.isNew = false;
        }
      }
      setContexts([...contexts]);
      toast({ title: "Context saved!", description: "Your AI will now use this to personalize your content." });
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to save context", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteContext = async (index: number) => {
    const ctx = contexts[index];
    if (ctx.id) {
      await supabase.from("user_contexts").delete().eq("id", ctx.id);
    }
    setContexts(contexts.filter((_, i) => i !== index));
  };

  const addContext = () => {
    setContexts([...contexts, { label: "New Context", value: "", isNew: true }]);
  };

  const updateLabel = (index: number, label: string) => {
    const updated = [...contexts];
    updated[index] = { ...updated[index], label };
    setContexts(updated);
  };

  const updateValue = (index: number, value: string) => {
    const updated = [...contexts];
    updated[index] = { ...updated[index], value };
    setContexts(updated);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await supabase
        .from("profiles")
        .update({ full_name: displayName })
        .eq("id", user.id);
      toast({ title: "Profile saved!" });
    } catch (e) {
      toast({ title: "Failed to save profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Context
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            This context is sent to the AI every time you generate or rewrite content.
          </p>
        </div>
        <Button
          size="sm"
          onClick={saveContexts}
          disabled={saving}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {saving ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Save className="mr-1 h-3 w-3" />}
          Save Context
        </Button>
      </div>

      <div className="space-y-4">
        {contexts.map((ctx, i) => (
          <div key={ctx.id || i} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <input
                value={ctx.label}
                onChange={(e) => updateLabel(i, e.target.value)}
                className="text-sm font-medium text-foreground bg-transparent border-none outline-none focus:ring-0 w-full"
              />
              <button
                onClick={() => deleteContext(i)}
                className="text-muted-foreground hover:text-destructive transition-colors ml-2 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={ctx.value}
              onChange={(e) => updateValue(i, e.target.value)}
              placeholder={`Describe your ${ctx.label.toLowerCase()}...`}
              className="w-full min-h-[80px] bg-secondary rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none border border-border"
            />
          </div>
        ))}
      </div>

      <Button variant="outline" className="mt-4 rounded-full text-sm" onClick={addContext}>
        <Plus className="mr-1 h-4 w-4" /> Add Context
      </Button>

      <div className="mt-8 glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Display Name</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 bg-secondary border-border"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input value={user?.email || ""} disabled className="mt-1 bg-secondary border-border opacity-60" />
          </div>
          <Button
            size="sm"
            onClick={saveProfile}
            disabled={savingProfile}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {savingProfile ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContextPage;
