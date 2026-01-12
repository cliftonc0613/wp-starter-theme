# Phase 3 Plan 02: Search Modal UI

**Phase:** 3-search-filtering
**Plan:** 02
**Focus:** Command palette search modal with keyboard shortcut and header integration

## Context

This plan builds the user-facing search experience:
1. SearchCommand component using ShadCN Command
2. Cmd/Ctrl+K keyboard shortcut
3. Search icon in header (desktop and mobile)
4. Instant search results grouped by content type

## Prerequisites

- Plan 3-01 complete (search API, Command component, search config)
- Header component at `frontend/components/Header.tsx`

## Tasks

### Task 1: Create SearchCommand Component (auto)

**Files to create:**
- `frontend/components/SearchCommand.tsx`

**Implementation:**
```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileText, File, Briefcase, Search, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { search, type SearchResult } from "@/lib/wordpress";
import { getEnabledSearchTypes, type SearchableType } from "@/lib/search-config";

// Icon mapping for content types
const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  File,
  Briefcase,
};

interface SearchCommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SearchCommand({ open: controlledOpen, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Support both controlled and uncontrolled modes
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const enabledTypes = getEnabledSearchTypes();

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await search({
          query,
          types: enabledTypes.map(t => t.type),
          per_page: 5,
        });
        setResults(searchResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, enabledTypes]);

  // Handle result selection
  const handleSelect = useCallback((url: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(url);
  }, [router, setOpen]);

  // Group results by type
  const groupedResults = enabledTypes.reduce((acc, typeConfig) => {
    const typeResults = results.filter(r => r.type === typeConfig.type);
    if (typeResults.length > 0) {
      acc.push({ config: typeConfig, results: typeResults });
    }
    return acc;
  }, [] as { config: SearchableType; results: SearchResult[] }[]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search posts, pages, services..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <CommandEmpty>No results found for "{query}"</CommandEmpty>
        )}

        {!loading && groupedResults.map(({ config, results: groupResults }) => {
          const Icon = icons[config.icon] || FileText;
          return (
            <CommandGroup key={config.type} heading={config.label}>
              {groupResults.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  value={`${result.title} ${result.type}`}
                  onSelect={() => handleSelect(result.url)}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.excerpt && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {result.excerpt}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}

        {!loading && !query && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Search className="mx-auto mb-2 h-6 w-6" />
            <p>Start typing to search...</p>
            <p className="mt-1 text-xs">
              Press <kbd className="rounded border bg-muted px-1">Esc</kbd> to close
            </p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
```

**Commit:** `feat(3-02): create SearchCommand component with keyboard shortcut`

### Task 2: Add Search Icon to Header (auto)

**Files to modify:**
- `frontend/components/Header.tsx`

**Changes:**
1. Import `Search` icon from lucide-react
2. Import `SearchCommand` component
3. Add state for search modal
4. Add search icon button next to desktop CTA
5. Add search to mobile menu

**Implementation additions:**
```tsx
// Add imports
import { Search } from "lucide-react";
import { SearchCommand } from "@/components/SearchCommand";

// Add state
const [searchOpen, setSearchOpen] = useState(false);

// Desktop: Add before CTA button
<Button
  variant="ghost"
  size="icon"
  onClick={() => setSearchOpen(true)}
  className="mr-2"
  aria-label="Search"
>
  <Search className="h-5 w-5" />
</Button>

// Mobile: Add after Sheet trigger, in header area
<Button
  variant="ghost"
  size="icon"
  onClick={() => setSearchOpen(true)}
  className="md:hidden"
  aria-label="Search"
>
  <Search className="h-5 w-5" />
</Button>

// At end of component, before closing header tag
<SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
```

**Commit:** `feat(3-02): integrate search into header with icon and shortcut`

### Task 3: Add Search Styles (auto)

**Files to modify:**
- `frontend/app/globals.css`

**Add styles for search modal:**
```css
/* Search Command Modal */
[cmdk-dialog] {
  @apply fixed inset-0 z-50;
}

[cmdk-overlay] {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm;
}

[cmdk-dialog] [cmdk-input] {
  @apply h-12;
}

/* Keyboard shortcut indicator */
.search-shortcut {
  @apply hidden rounded border bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground md:inline-block;
}
```

**Commit:** `style(3-02): add search modal styles`

## Verification

After completing all tasks:
1. Press Cmd/Ctrl+K anywhere on the site - search modal should open
2. Click search icon in header (desktop) - modal should open
3. Click search icon in mobile header - modal should open
4. Type a search query - results should appear grouped by type
5. Click a result - should navigate to that page
6. Press Esc - modal should close

## Success Criteria

- [ ] Search modal opens with Cmd/Ctrl+K keyboard shortcut
- [ ] Search icon visible and functional in desktop header
- [ ] Search icon visible and functional in mobile header
- [ ] Search results appear instantly (debounced 300ms)
- [ ] Results grouped by content type (Posts, Pages, Services)
- [ ] Clicking result navigates to correct page
- [ ] Modal closes on Esc or clicking outside
- [ ] Loading state shows spinner during search

---

*Phase: 3-search-filtering*
*Estimated tasks: 3*
*Commit prefix: feat(3-02), style(3-02)*
