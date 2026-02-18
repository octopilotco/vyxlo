import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Heart,
  MessageCircle,
  Repeat2,
  Eye,
  ArrowRight,
  Sparkles,
  Search,
  Bookmark,
  BookmarkCheck,
  BadgeCheck,
  Filter,
  Inbox,
} from "lucide-react";

const tabs = ["All", "Media", "Articles", "Tweets", "Daily Mix", "Bookmarked"];

const mockTweets = [
  {
    id: 1,
    avatar: "🧑‍💻",
    name: "Alex Johnson",
    handle: "@alexj",
    time: "2h ago",
    text: "Just shipped a new feature that increased our conversion rate by 34%. The key? We listened to what our users were actually asking for instead of building what we thought they needed.",
    category: "Products",
    likes: 234,
    replies: 45,
    retweets: 89,
    verified: true,
    image: null,
  },
  {
    id: 2,
    avatar: "👩‍🎨",
    name: "Sarah Chen",
    handle: "@sarahc",
    time: "4h ago",
    text: "Hot take: The best marketing strategy in 2025 isn't ads, it's building in public. Share your journey, your failures, and your wins. People connect with authenticity.",
    category: "Trending",
    likes: 567,
    replies: 123,
    retweets: 201,
    verified: true,
    image: null,
  },
  {
    id: 3,
    avatar: "🚀",
    name: "Mike Rivera",
    handle: "@mikeriv",
    time: "6h ago",
    text: "I analyzed 500 viral tweets and found 3 patterns:\n\n1. They challenge conventional wisdom\n2. They share specific numbers\n3. They tell a story in under 280 chars\n\nBookmark this.",
    category: "Viral",
    likes: 1243,
    replies: 89,
    retweets: 456,
    verified: false,
    image: null,
  },
  {
    id: 4,
    avatar: "💡",
    name: "Priya Patel",
    handle: "@priyap",
    time: "8h ago",
    text: "Reminder: Your audience doesn't care about your product features. They care about how your product makes their life better. Lead with outcomes, not specifications.",
    category: "Products",
    likes: 345,
    replies: 67,
    retweets: 123,
    verified: false,
    image: null,
  },
  {
    id: 5,
    avatar: "📊",
    name: "David Kim",
    handle: "@davidk",
    time: "12h ago",
    text: "I grew from 1K to 50K followers in 8 months. Here's my exact content strategy thread 🧵",
    category: "Growth",
    likes: 892,
    replies: 234,
    retweets: 567,
    verified: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
  },
  {
    id: 6,
    avatar: "🎯",
    name: "Lisa Nguyen",
    handle: "@lisang",
    time: "1d ago",
    text: "Stop chasing follower count. Start chasing engagement rate.\n\n10K engaged followers > 100K ghost followers.\n\nEvery. Single. Time.",
    category: "Growth",
    likes: 1102,
    replies: 178,
    retweets: 390,
    verified: true,
    image: null,
  },
  {
    id: 7,
    avatar: "🧠",
    name: "James Wright",
    handle: "@jamesw",
    time: "1d ago",
    text: "The 5am morning routine didn't change my life. But showing up consistently for 365 days straight did. Discipline beats motivation.",
    category: "Mindset",
    likes: 2341,
    replies: 312,
    retweets: 876,
    verified: false,
    image: null,
  },
  {
    id: 8,
    avatar: "💰",
    name: "Emma Torres",
    handle: "@emmat",
    time: "1d ago",
    text: "Our SaaS went from $0 to $10K MRR in 90 days. The secret? We didn't build what we wanted. We built what people were already paying for with duct-tape solutions.",
    category: "Products",
    likes: 678,
    replies: 98,
    retweets: 234,
    verified: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
  },
  {
    id: 9,
    avatar: "🔥",
    name: "Carlos Mendez",
    handle: "@carlosm",
    time: "2d ago",
    text: "Thread: 7 copywriting frameworks that generated $2M+ in revenue for my clients ↓\n\n1. PAS (Problem-Agitate-Solve)\n2. AIDA\n3. BAB (Before-After-Bridge)\n...",
    category: "Viral",
    likes: 3456,
    replies: 567,
    retweets: 1234,
    verified: true,
    image: null,
  },
  {
    id: 10,
    avatar: "🌱",
    name: "Ava Mitchell",
    handle: "@avam",
    time: "2d ago",
    text: "Unpopular opinion: You don't need to hustle 24/7 to build a successful business. Strategic rest is a competitive advantage.",
    category: "Mindset",
    likes: 1890,
    replies: 245,
    retweets: 678,
    verified: false,
    image: null,
  },
  {
    id: 11,
    avatar: "📈",
    name: "Ryan Foster",
    handle: "@ryanf",
    time: "3d ago",
    text: "This week's content experiment:\n\n- Posted 3x/day for 7 days\n- Focused on threads over single tweets\n- Engaged 30 min before and after each post\n\nResult: +4,200 followers. The algorithm rewards consistency.",
    category: "Growth",
    likes: 756,
    replies: 134,
    retweets: 289,
    verified: false,
    image: null,
  },
  {
    id: 12,
    avatar: "✨",
    name: "Nina Johansson",
    handle: "@ninaj",
    time: "3d ago",
    text: "Best $0 marketing channels in 2025:\n\n1. Twitter/X threads\n2. LinkedIn carousels\n3. YouTube Shorts\n4. Newsletter cross-promos\n5. Community partnerships\n\nNo budget needed. Just consistency.",
    category: "Trending",
    likes: 945,
    replies: 167,
    retweets: 412,
    verified: true,
    image: null,
  },
];

const InspirationPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    mockTweets.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return [
      { label: "All", count: mockTweets.length },
      ...Object.entries(counts).map(([label, count]) => ({ label, count })),
    ];
  }, []);

  const filteredTweets = useMemo(() => {
    let result = [...mockTweets];

    // Tab: Bookmarked
    if (activeTab === "Bookmarked") {
      result = result.filter((t) => bookmarkedIds.has(t.id));
    }

    // Category
    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.handle.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "most-liked") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "most-retweeted") {
      result.sort((a, b) => b.retweets - a.retweets);
    }

    return result;
  }, [activeTab, activeCategory, searchQuery, sortBy, bookmarkedIds]);

  const topCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    mockTweets.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, []);

  return (
    <div className="p-6 lg:p-8">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "Bookmarked" && bookmarkedIds.size > 0 && (
              <span className="ml-1.5 text-xs bg-primary/10 text-primary rounded-full px-1.5">
                {bookmarkedIds.size}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Today's tweet suggestions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Curated content ideas based on your context
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-muted-foreground">
          <Settings className="h-4 w-4 mr-2" />
          Manage context
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          {mockTweets.length} suggestions
        </span>
        <span className="flex items-center gap-1.5">
          <Bookmark className="h-3.5 w-3.5" />
          {bookmarkedIds.size} bookmarked
        </span>
        <span>
          Top category: <span className="text-foreground font-medium">{topCategory}</span>
        </span>
      </div>

      {/* Search & Sort */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="most-liked">Most Liked</SelectItem>
            <SelectItem value="most-retweeted">Most Retweeted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition-colors ${
              activeCategory === cat.label
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
            <span className="text-xs opacity-70">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Tweet cards or empty state */}
      {filteredTweets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-base font-medium text-foreground mb-1">No tweets found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Try adjusting your filters or search query to discover more inspiration.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTweets.map((tweet) => {
            const isBookmarked = bookmarkedIds.has(tweet.id);
            return (
              <div
                key={tweet.id}
                className="glass-card rounded-xl p-5 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-lg">
                    {tweet.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm flex items-center gap-1">
                        {tweet.name}
                        {tweet.verified && (
                          <BadgeCheck className="h-4 w-4 text-primary" />
                        )}
                      </span>
                      <span className="text-muted-foreground text-sm">{tweet.handle}</span>
                      <span className="text-muted-foreground text-xs">· {tweet.time}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {tweet.category}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                      {tweet.text}
                    </p>

                    {tweet.image && (
                      <img
                        src={tweet.image}
                        alt="Tweet media"
                        className="mt-3 rounded-lg w-full max-h-48 object-cover"
                        loading="lazy"
                      />
                    )}

                    {/* Engagement */}
                    <div className="mt-3 flex items-center gap-5 text-muted-foreground">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Heart className="h-3.5 w-3.5" /> {tweet.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <MessageCircle className="h-3.5 w-3.5" /> {tweet.replies}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <Repeat2 className="h-3.5 w-3.5" /> {tweet.retweets}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-4"
                      >
                        Use Tweet <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full text-xs px-4">
                        <Eye className="mr-1 h-3 w-3" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`rounded-full text-xs px-3 ${isBookmarked ? "text-primary" : "text-muted-foreground"}`}
                        onClick={() => toggleBookmark(tweet.id)}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InspirationPage;
