

## Upgrade Halaman Inspiration Dashboard

### Ringkasan
Memperkaya halaman Inspiration dengan lebih banyak mock data, interaksi yang lebih lengkap (bookmark, search, sort), dan layout yang lebih polished agar terasa seperti fitur produk nyata.

### Yang Akan Ditambahkan

**1. Data Mock yang Lebih Lengkap**
- Dari 5 tweet menjadi 12+ tweet dengan variasi kategori lebih seimbang
- Tambah field baru: `bookmarked`, `verified` (centang biru), `image` (opsional gambar/media preview)
- Tambah kategori baru: "Growth", "Mindset"

**2. Fitur Search & Sort**
- Search bar di atas category chips untuk filter tweet berdasarkan teks
- Sort dropdown (Most Liked, Most Retweeted, Latest) menggunakan komponen Select yang sudah ada

**3. Interaksi Bookmark**
- Toggle bookmark pada setiap tweet card (ikon Bookmark yang bisa di-klik, state lokal)
- Tab filter tambahan: tampilkan hanya tweet yang di-bookmark

**4. Tweet Card yang Lebih Kaya**
- Verified badge (centang biru) di samping nama user yang terverifikasi
- Opsional image preview di bawah teks tweet
- Hover state yang lebih jelas pada card (subtle border glow)
- Tombol "Use Tweet" dan "View" tetap dipertahankan, tambah tombol "Bookmark"

**5. Empty State**
- Tampilan khusus jika filter menghasilkan 0 hasil (ikon + pesan)

**6. Stats Summary Bar**
- Bar kecil di bawah header menampilkan total suggestions, bookmarked count, dan kategori terpopuler

---

### Detail Teknis

**File yang diubah:**
- `src/pages/dashboard/InspirationPage.tsx` -- refactor utama

**Komponen yang digunakan (sudah ada):**
- `Badge`, `Button`, `Select/SelectTrigger/SelectContent/SelectItem` dari UI library
- `Input` untuk search bar
- Icon dari `lucide-react`: `Search`, `Bookmark`, `BadgeCheck`, `SlidersHorizontal`, `Filter`

**State management:**
- `activeTab`, `activeCategory`, `searchQuery`, `sortBy`, `bookmarkedIds` (Set) -- semua local state dengan `useState`
- Filter pipeline: tab -> category -> search -> sort

**Struktur mock data baru:**
```text
12+ tweets dengan field:
  id, avatar, name, handle, time, text, category, likes, replies, retweets,
  verified (boolean), image (string | null)
```

**Sort logic:**
- "latest" = default order
- "most-liked" = sort by likes desc
- "most-retweeted" = sort by retweets desc

**Tidak ada perubahan database** -- semua menggunakan mock data lokal.

