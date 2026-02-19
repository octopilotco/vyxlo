import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Bold, Italic, List, Link, Image, Smile, Send, RotateCcw, Save, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const tones = ["Professional", "Casual", "Witty", "Inspirational", "Educational"];
const FREE_LIMIT = 10;

// Get the edge function URL
const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`;

const ContentStudioPage = () => {
  const { user, session } = useAuth();
  const [content, setContent] = useState("");
  const [activeTone, setActiveTone] = useState("Professional");
  const [showRewrite, setShowRewrite] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [topic, setTopic] = useState("");
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("12:00");
  const abortRef = useRef<AbortController | null>(null);

  const streamFromEdge = async (
    mode: "generate" | "rewrite",
    onChunk: (chunk: string) => void
  ) => {
    abortRef.current = new AbortController();

    const resp = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ mode, content, tone: activeTone, topic }),
      signal: abortRef.current.signal,
    });

    if (!resp.ok) {
      const json = await resp.json().catch(() => ({ error: "Unknown error" }));
      if (resp.status === 402) {
        setShowLimitModal(true);
        return false;
      }
      if (resp.status === 429) {
        toast({ title: "Rate limit hit", description: json.error, variant: "destructive" });
        return false;
      }
      toast({ title: "AI error", description: json.error || "Generation failed", variant: "destructive" });
      return false;
    }

    const reader = resp.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;

    while (!done) {
      const { done: streamDone, value } = await reader.read();
      if (streamDone) break;
      buffer += decoder.decode(value, { stream: true });

      let newline: number;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { done = true; break; }
        try {
          const parsed = JSON.parse(jsonStr);
          const chunk = parsed.choices?.[0]?.delta?.content;
          if (chunk) onChunk(chunk);
        } catch { /* partial */ }
      }
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!topic) { setShowTopicInput(true); return; }
    setShowTopicInput(false);
    setIsGenerating(true);
    setContent("");

    try {
      await streamFromEdge("generate", (chunk) => {
        setContent((prev) => prev + chunk);
      });
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        toast({ title: "Generation failed", variant: "destructive" });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewrite = async () => {
    if (!content.trim()) {
      toast({ title: "Nothing to rewrite", description: "Type something first", variant: "destructive" });
      return;
    }
    setIsRewriting(true);
    const original = content;

    try {
      let result = "";
      await streamFromEdge("rewrite", (chunk) => {
        result += chunk;
        setContent(result);
      });
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setContent(original);
        toast({ title: "Rewrite failed", variant: "destructive" });
      }
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!content.trim()) {
      toast({ title: "Nothing to save", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user!.id,
        content,
        status: "draft",
        tone: activeTone,
      });
      if (error) throw error;
      toast({ title: "Draft saved!", description: "Find it in your Post Queue." });
    } catch (e) {
      toast({ title: "Failed to save draft", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!content.trim()) {
      toast({ title: "Nothing to schedule", variant: "destructive" });
      return;
    }
    setShowScheduleModal(true);
  };

  const confirmSchedule = async () => {
    if (!scheduleDate) {
      toast({ title: "Pick a date first", variant: "destructive" });
      return;
    }
    const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();
    setIsSaving(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user!.id,
        content,
        status: "scheduled",
        tone: activeTone,
        scheduled_for: scheduledFor,
      });
      if (error) throw error;
      setShowScheduleModal(false);
      toast({ title: "Post scheduled!", description: `Queued for ${scheduleDate} at ${scheduleTime}` });
      setContent("");
    } catch (e) {
      toast({ title: "Failed to schedule post", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const charCount = content.length;
  const isOverLimit = charCount > 280;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Content Studio</h1>
        <p className="text-sm text-muted-foreground mt-1">Write, rewrite, and perfect your posts with AI</p>
      </div>

      {/* Tone selector */}
      <div className="mb-4">
        <span className="text-xs text-muted-foreground mb-2 block">Tone / Style</span>
        <div className="flex gap-2 flex-wrap">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => setActiveTone(tone)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                activeTone === tone
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      {/* Topic input */}
      {showTopicInput && (
        <div className="mb-4 glass-card rounded-xl p-4 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">What's the topic?</label>
            <input
              autoFocus
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="e.g. Why consistency beats motivation"
              className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring border border-border"
            />
          </div>
          <Button size="sm" onClick={handleGenerate} className="rounded-full bg-primary text-primary-foreground">
            Generate
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowTopicInput(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Editor */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-border px-4 py-2">
          <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Bold className="h-4 w-4" /></button>
          <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Italic className="h-4 w-4" /></button>
          <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><List className="h-4 w-4" /></button>
          <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Link className="h-4 w-4" /></button>
          <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Image className="h-4 w-4" /></button>
          <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Smile className="h-4 w-4" /></button>
          <div className="flex-1" />
          <Badge variant={isOverLimit ? "destructive" : "secondary"} className="text-xs">
            {charCount}/280
          </Badge>
        </div>

        {/* Text area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Start typing or let AI write it..."
          className="w-full min-h-[200px] bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
        />

        {/* Actions bar */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs"
              onClick={handleRewrite}
              disabled={isRewriting || isGenerating}
            >
              {isRewriting ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Wand2 className="mr-1 h-3 w-3" />}
              Rewrite with AI
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs"
              onClick={handleGenerate}
              disabled={isGenerating || isRewriting}
            >
              {isGenerating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
              Generate with AI
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => setContent("")}>
              <RotateCcw className="mr-1 h-3 w-3" /> Clear
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Save className="mr-1 h-3 w-3" />}
              Save Draft
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-4"
              onClick={handleSchedule}
              disabled={isSaving}
            >
              <Send className="mr-1 h-3 w-3" /> Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Rewrite panel */}
      {showRewrite && (
        <div className="mt-4 glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            AI Rewrite Suggestions
          </h3>
          <div className="space-y-3">
            {["More engaging", "Shorter & punchier", "Add a hook"].map((style) => (
              <div key={style} className="rounded-lg bg-secondary p-3">
                <span className="text-xs text-primary font-medium">{style}</span>
                <p className="text-sm text-foreground/80 mt-1">
                  {content || "Type something first to get AI suggestions..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Limit Modal */}
      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              You've hit your free limit
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              You've used all <strong>{FREE_LIMIT} free AI generations</strong> this month. Upgrade to <strong>PRO</strong> for unlimited AI writes, scheduling, and more.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              className="flex-1 rounded-full bg-primary text-primary-foreground"
              onClick={() => {
                setShowLimitModal(false);
                toast({ title: "Upgrade coming soon!", description: "Midtrans payment setup in progress." });
              }}
            >
              Upgrade to PRO — $39/mo
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setShowLimitModal(false)}>
              Maybe later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>Pick when this goes out.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Date</label>
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Time</label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={confirmSchedule} disabled={isSaving} className="flex-1 rounded-full bg-primary text-primary-foreground">
                {isSaving ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
                Confirm Schedule
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentStudioPage;
