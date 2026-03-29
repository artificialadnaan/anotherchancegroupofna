import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import type { Literature } from "@shared/schema";

function LiteratureCard({ item }: { item: Literature }) {
  return (
    <div
      className="bg-[var(--md3-surface-container-lowest)] border border-[var(--md3-outline-variant)]/10 rounded-2xl p-5 flex flex-col gap-3"
      data-testid={`card-literature-${item.id}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <h3 className="text-base font-semibold text-[var(--md3-primary)] leading-snug">
          {item.title}
        </h3>
        <span className="shrink-0 w-fit text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--md3-surface-container-highest)] text-[var(--md3-outline)]">
          {item.category}
        </span>
      </div>
      <p className="text-sm text-[var(--md3-outline)] leading-relaxed">{item.description}</p>
      {item.externalUrl && (
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`link-literature-${item.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--md3-primary)] hover:opacity-75 transition-opacity w-fit"
        >
          {item.externalUrl.endsWith('.pdf') ? (
            <>
              <FileText className="w-3.5 h-3.5" />
              View PDF
            </>
          ) : (
            <>
              <ExternalLink className="w-3.5 h-3.5" />
              Read More
            </>
          )}
        </a>
      )}
    </div>
  );
}

function LiteratureSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-44 rounded-2xl" />
      ))}
    </div>
  );
}

export default function LiteraturePage() {
  const { data: items, isLoading, error } = useQuery<Literature[]>({
    queryKey: ["/api/literature"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = items
    ? Array.from(new Set(items.map((item) => item.category))).sort()
    : [];

  const sortedItems = items?.slice().sort((a, b) => {
    const getIpNumber = (title: string): number => {
      const match = title.match(/IP\s*#(\d+)/);
      return match ? parseInt(match[1], 10) : 9999;
    };
    const catOrder = ["Books", "Daily Readings", "Booklets", "Informational Pamphlets", "Service Material", "Key Tags & Medallions"];
    const catA = catOrder.indexOf(a.category);
    const catB = catOrder.indexOf(b.category);
    if (catA !== catB) return (catA === -1 ? 999 : catA) - (catB === -1 ? 999 : catB);
    return getIpNumber(a.title) - getIpNumber(b.title);
  });

  const filteredItems = selectedCategory
    ? sortedItems?.filter((item) => item.category === selectedCategory)
    : sortedItems;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      <div className="mb-6 md:mb-8">
        <h1 className="font-['Manrope',sans-serif] text-3xl sm:text-4xl font-bold text-[var(--md3-primary)] mb-2">
          NA Literature
        </h1>
        <p className="text-[var(--md3-outline)]">
          Recovery literature is a vital part of the NA program. Explore resources to support your recovery journey.
        </p>
      </div>

      {!isLoading && categories.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
          <button
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-[var(--md3-primary)] text-white"
                : "bg-[var(--md3-surface-container-highest)] text-[var(--md3-outline)] hover:opacity-80"
            }`}
            onClick={() => setSelectedCategory(null)}
            data-testid="button-filter-all"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-[var(--md3-primary)] text-white"
                  : "bg-[var(--md3-surface-container-highest)] text-[var(--md3-outline)] hover:opacity-80"
              }`}
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-filter-${category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {isLoading && <LiteratureSkeleton />}

      {error && (
        <div className="bg-[var(--md3-surface-container-lowest)] border border-[var(--md3-outline-variant)]/10 rounded-2xl p-6 text-center">
          <p className="text-[var(--md3-outline)]">Unable to load literature. Please try again later.</p>
        </div>
      )}

      {filteredItems && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <LiteratureCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && !error && filteredItems?.length === 0 && (
        <div className="bg-[var(--md3-surface-container-lowest)] border border-[var(--md3-outline-variant)]/10 rounded-2xl p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-[var(--md3-outline)]" />
          <h3 className="font-semibold text-[var(--md3-primary)] mb-2">No Literature Found</h3>
          <p className="text-sm text-[var(--md3-outline)]">
            {selectedCategory
              ? `No literature available in the "${selectedCategory}" category.`
              : "Literature resources are being added. Please check back soon."}
          </p>
        </div>
      )}

      <section className="mt-12 p-6 bg-[var(--md3-surface-container-lowest)] border border-[var(--md3-outline-variant)]/10 rounded-3xl mb-8">
        <h2 className="font-['Manrope',sans-serif] text-xl font-semibold text-[var(--md3-primary)] mb-3">
          About NA Literature
        </h2>
        <p className="text-sm text-[var(--md3-outline)] leading-relaxed mb-4">
          NA literature is written by addicts, for addicts. Our literature shares the collective experience of recovering addicts around the world. It helps us learn how to live and enjoy life without drugs.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://www.na.org/meetingsearch/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--md3-surface-container-highest)] text-[var(--md3-outline)] hover:opacity-80 transition-opacity"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            NA World Services
          </a>
        </div>
      </section>
    </div>
  );
}
