---
title: Component Architecture - One Component Per File, Feature-Based Structure
impact: HIGH
impactDescription: enforces separation of concerns, improves maintainability and scalability
tags: architecture, components, file-structure, separation-of-concerns
---

## Component Architecture: One Component Per File, Feature-Based Structure

Each React component must live in its own dedicated file. A single file must not contain multiple unrelated responsibilities. Components should be organized by feature, not by type.

---

### Rule 1: One Component Per File

Each file must export exactly one primary React component. Helper sub-components that are tightly coupled and only used by the parent may coexist in the same file, but must not be exported.

**Incorrect: multiple exported components in one file**

```tsx
// ❌ components/Movie.tsx
export function MovieCard({ movie }: Props) {
  return <div>{movie.name}</div>;
}

export function MovieGrid({ movies }: Props) {
  return (
    <div>
      {movies.map((m) => (
        <MovieCard key={m._id} movie={m} />
      ))}
    </div>
  );
}

export function MovieBadge({ label }: Props) {
  return <span className="badge">{label}</span>;
}
```

**Correct: one component per file**

```tsx
// ✅ components/movie/MovieCard.tsx
export function MovieCard({ movie }: Props) {
  return <div>{movie.name}</div>;
}

// ✅ components/movie/MovieGrid.tsx
import { MovieCard } from "./MovieCard";

export function MovieGrid({ movies }: Props) {
  return (
    <div>
      {movies.map((m) => (
        <MovieCard key={m._id} movie={m} />
      ))}
    </div>
  );
}

// ✅ components/movie/MovieBadge.tsx
export function MovieBadge({ label }: Props) {
  return <span className="badge">{label}</span>;
}
```

---

### Rule 2: One Responsibility Per File

A file must not mix unrelated logic. Each file handles exactly one concern: a component, a hook, a service, a type definition, or a utility.

**Incorrect: mixed responsibilities**

```tsx
// ❌ utils/movie.ts
export interface MovieItem { ... }          // type
export const BASE_URL = 'https://...'       // constant
export function fetchMovie(slug: string) {} // API call
export function slugify(text: string) {}    // utility
export function MovieCard() {}              // component
```

**Correct: each responsibility in its own file**

```tsx
// ✅ types/ophim.ts          → TypeScript interfaces & types only
// ✅ constants/ophim.ts      → Constants & config only
// ✅ services/ophimService.ts → API service calls only
// ✅ lib/slugify.ts           → Utility function only
// ✅ components/movie/MovieCard.tsx → Component only
```

---

### Rule 3: Feature-Based Folder Structure

Organize components by **feature/domain**, not by technical type. Group everything related to a feature in the same folder.

**Incorrect: organized by type**

```
components/
  cards/
    MovieCard.tsx
    EpisodeCard.tsx
    PersonCard.tsx
  grids/
    MovieGrid.tsx
    EpisodeGrid.tsx
  modals/
    MovieModal.tsx
    SearchModal.tsx
```

**Correct: organized by feature**

```
components/
  movie/
    MovieCard.tsx
    MovieGrid.tsx
    MovieBadge.tsx
    MovieSkeleton.tsx
    index.ts              ← re-exports for this feature
  episode/
    EpisodeList.tsx
    EpisodeCard.tsx
    EpisodePlayer.tsx
    index.ts
  search/
    SearchBar.tsx
    SearchModal.tsx
    SearchResults.tsx
    index.ts
  layout/
    Navbar.tsx
    Footer.tsx
    Sidebar.tsx
    index.ts
  ui/
    Button.tsx
    Badge.tsx
    Skeleton.tsx
    Pagination.tsx
    index.ts
```

---

### Rule 4: Folder Index File

Each feature folder must have an `index.ts` that re-exports its public API. This prevents deep import paths and makes refactoring easier.

**Incorrect: deep direct imports**

```tsx
import { MovieCard } from "../../components/movie/MovieCard";
import { MovieGrid } from "../../components/movie/MovieGrid";
import { MovieBadge } from "../../components/movie/MovieBadge";
```

**Correct: import from feature index**

```tsx
import { MovieCard, MovieGrid, MovieBadge } from "@/components/movie";
```

```ts
// components/movie/index.ts
export { MovieCard } from "./MovieCard";
export { MovieGrid } from "./MovieGrid";
export { MovieBadge } from "./MovieBadge";
export { MovieSkeleton } from "./MovieSkeleton";
```

> **Note:** The `index.ts` re-export file itself is allowed to contain multiple exports because it acts as a public API barrel — not a component or logic file.

---

### Rule 5: Complete Project Structure Reference

```
app/                         → Next.js App Router pages
  (home)/
    page.tsx                 → Trang chủ
    loading.tsx
  phim/[slug]/
    page.tsx                 → Chi tiết phim
    loading.tsx
  danh-sach/[slug]/
    page.tsx                 → Danh sách phim
  the-loai/[slug]/
    page.tsx
  quoc-gia/[slug]/
    page.tsx
  tim-kiem/
    page.tsx
  layout.tsx
  globals.css

components/                  → UI components (one file per component)
  movie/
    MovieCard.tsx
    MovieGrid.tsx
    MovieBadge.tsx
    MovieSkeleton.tsx
    MovieHero.tsx
    MovieRow.tsx             → Horizontal scroll row
    index.ts
  episode/
    EpisodeList.tsx
    EpisodeCard.tsx
    VideoPlayer.tsx
    ServerSelector.tsx
    index.ts
  search/
    SearchBar.tsx
    SearchModal.tsx
    SearchResults.tsx
    index.ts
  filter/
    FilterBar.tsx
    CategoryFilter.tsx
    CountryFilter.tsx
    YearFilter.tsx
    SortSelector.tsx
    index.ts
  layout/
    Navbar.tsx
    Footer.tsx
    MobileMenu.tsx
    index.ts
  ui/
    Button.tsx
    Badge.tsx
    Skeleton.tsx
    Pagination.tsx
    Spinner.tsx
    index.ts

hooks/                       → Custom React Query hooks (one hook file per domain)
  useOphimQueries.ts         → All React Query hooks for OPhim API
  useMovies.ts               → (deprecated - remove)

services/                    → API service layer (one service per API domain)
  ophimService.ts            → OPhim API service

types/                       → TypeScript types only
  ophim.ts                   → All OPhim API types
  index.ts                   → (deprecated - remove)

constants/                   → Constants and config
  ophim.ts                   → OPhim endpoints & config
  queryKeys.ts               → React Query keys

lib/                         → Pure utility functions (no React)
  utils.ts
  cn.ts                      → className utility
```
