import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, RotateCcw, Plug, Trash2, ChevronLeft, ChevronRight, Loader2, Edit2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO, isSameDay } from "date-fns";

const timeSlots = ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];

interface Post {
  id: string;
  content: string;
  status: string;
  tone: string;
  scheduled_for: string | null;
  created_at: string;
}

const parseTime = (timeStr: string) => {
  const [time, period] = timeStr.split(" ");
  const [h, m] = time.split(":").map(Number);
  const hours = period === "PM" && h !== 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h;
  return hours;
};

const PostQueuePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [autoRetweet, setAutoRetweet] = useState(false);
  const [autoPlug, setAutoPlug] = useState(false);
  const [autoDelete, setAutoDelete] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    if (user) loadPosts();
  }, [user, weekStart]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const weekEnd = addDays(weekStart, 7);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user!.id)
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (e) {
      toast({ title: "Failed to load posts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getPostForDayAndTime = (day: Date, timeSlot: string) => {
    const slotHour = parseTime(timeSlot);
    return posts.find((p) => {
      if (!p.scheduled_for) return false;
      const d = parseISO(p.scheduled_for);
      return isSameDay(d, day) && d.getHours() >= slotHour && d.getHours() < slotHour + 2;
    });
  };

  const updateStatus = async (postId: string, status: string) => {
    await supabase.from("posts").update({ status }).eq("id", postId);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status } : p));
    toast({ title: status === "published" ? "Post marked as published! 🎉" : "Status updated" });
  };

  const deletePost = async (postId: string) => {
    await supabase.from("posts").delete().eq("id", postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    toast({ title: "Post deleted" });
  };

  // Drafts (no scheduled_for)
  const drafts = posts.filter((p) => p.status === "draft" && !p.scheduled_for);

  const weekLabel = `${format(weekStart, "MMM d")} – ${format(addDays(weekStart, 6), "MMM d, yyyy")}`;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            My Post Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule and manage your posts</p>
        </div>
      </div>

      {/* Auto settings */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {[
          { label: "Auto-Retweet", icon: RotateCcw, active: autoRetweet, toggle: () => setAutoRetweet(!autoRetweet) },
          { label: "Auto-Plug", icon: Plug, active: autoPlug, toggle: () => setAutoPlug(!autoPlug) },
          { label: "Auto-Delete", icon: Trash2, active: autoDelete, toggle: () => setAutoDelete(!autoDelete) },
        ].map((opt) => (
          <button
            key={opt.label}
            onClick={opt.toggle}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-colors ${
              opt.active
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-secondary text-muted-foreground border border-border"
            }`}
          >
            <opt.icon className="h-3 w-3" />
            {opt.label}
            <span className={`ml-1 font-medium ${opt.active ? "text-primary" : ""}`}>
              {opt.active ? "ON" : "OFF"}
            </span>
          </button>
        ))}
      </div>

      {/* Drafts section */}
      {drafts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Drafts ({drafts.length})</h2>
          <div className="space-y-2">
            {drafts.map((post) => (
              <div key={post.id} className="glass-card rounded-xl p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px]">{post.status}</Badge>
                    <span className="text-xs text-muted-foreground">{post.tone}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => updateStatus(post.id, "published")}
                    className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    title="Mark as published"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar nav */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-foreground">{weekLabel}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-3 text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Time
            </div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`p-3 text-xs font-medium text-center border-l border-border ${
                  isSameDay(day, new Date()) ? "text-primary" : "text-foreground"
                }`}
              >
                <div>{format(day, "EEE")}</div>
                <div className={`text-[10px] mt-0.5 ${isSameDay(day, new Date()) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-border last:border-0">
              <div className="p-3 text-xs text-muted-foreground">{time}</div>
              {weekDays.map((day) => {
                const post = getPostForDayAndTime(day, time);
                return (
                  <div key={day.toISOString()} className="p-2 border-l border-border min-h-[60px]">
                    {post && (
                      <div
                        className={`rounded-md p-2 text-xs ${
                          post.status === "scheduled"
                            ? "bg-primary/10 text-primary"
                            : post.status === "published"
                            ? "bg-primary/5 text-primary/70"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <p className="truncate">{post.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-[10px]">{post.status}</Badge>
                          <div className="flex gap-0.5">
                            {post.status === "scheduled" && (
                              <button
                                onClick={() => updateStatus(post.id, "published")}
                                className="hover:text-primary"
                                title="Mark published"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deletePost(post.id)}
                              className="hover:text-destructive"
                              title="Delete"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostQueuePage;
