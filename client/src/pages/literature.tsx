import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ExternalLink, FileText, X, ChevronLeft } from "lucide-react";
import { useState } from "react";
import type { Literature } from "@shared/schema";

const books = [
  {
    title: "Basic Text — Narcotics Anonymous (6th Edition)",
    description: "The foundational text of NA. Contains the NA philosophy, the Twelve Steps and Twelve Traditions, and personal stories of recovery.",
    pdfUrl: "/literature/basic-text.pdf",
    cover: "menu_book",
    gradient: "from-[var(--md3-primary)] to-[var(--md3-primary-container)]",
  },
  {
    title: "It Works: How and Why",
    description: "An in-depth exploration of the Twelve Steps and Twelve Traditions of NA, explaining how and why they work in recovery.",
    pdfUrl: "/literature/it-works-how-and-why.pdf",
    cover: "auto_stories",
    gradient: "from-[var(--md3-secondary)] to-[var(--md3-tertiary)]",
  },
];

function PDFReader({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--md3-surface-container)] border-b border-[var(--md3-outline-variant)]/20">
        <button onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-[var(--md3-primary)]">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <h3 className="text-sm font-bold text-[var(--md3-primary)] truncate max-w-[60%]">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--md3-surface-container-high)]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <iframe
        src={url}
        className="flex-1 w-full"
        title={title}
      />
    </div>
  );
}

function BookCard({ book, onRead }: { book: typeof books[0]; onRead: () => void }) {
  return (
    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${book.gradient} p-6 sm:p-8 text-white flex flex-col justify-between min-h-[240px]`}>
      <div className="absolute top-0 right-0 opacity-10">
        <span className="material-symbols-outlined text-[8rem]">{book.cover}</span>
      </div>
      <div className="relative z-10 space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold leading-snug">{book.title}</h3>
        <p className="text-white/80 text-sm leading-relaxed max-w-md">{book.description}</p>
      </div>
      <div className="relative z-10 flex gap-3 mt-4">
        <button
          onClick={onRead}
          className="bg-white text-[var(--md3-primary)] px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">chrome_reader_mode</span>
          Read Now
        </button>
        <a
          href={book.pdfUrl}
          download
          className="bg-white/20 backdrop-blur text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Download
        </a>
      </div>
    </div>
  );
}

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
              Read PDF
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
  const [readingBook, setReadingBook] = useState<typeof books[0] | null>(null);

  const sortedItems = items?.slice().sort((a, b) => {
    const getIpNumber = (title: string): number => {
      const match = title.match(/IP\s*#(\d+)/);
      return match ? parseInt(match[1], 10) : 9999;
    };
    const catOrder = ["Informational Pamphlets", "Daily Readings", "Booklets", "Service Material", "Key Tags & Medallions"];
    const catA = catOrder.indexOf(a.category);
    const catB = catOrder.indexOf(b.category);
    if (catA !== catB) return (catA === -1 ? 999 : catA) - (catB === -1 ? 999 : catB);
    return getIpNumber(a.title) - getIpNumber(b.title);
  });

  // Filter out "Books" category since we handle those separately above
  const freeItems = sortedItems?.filter((item) => item.category !== "Books");

  const categories = freeItems
    ? Array.from(new Set(freeItems.map((item) => item.category))).sort()
    : [];

  const filteredItems = selectedCategory
    ? freeItems?.filter((item) => item.category === selectedCategory)
    : freeItems;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      {readingBook && (
        <PDFReader
          url={readingBook.pdfUrl}
          title={readingBook.title}
          onClose={() => setReadingBook(null)}
        />
      )}

      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-[2.75rem] font-extrabold leading-tight text-[var(--md3-primary)] mb-2 tracking-tight">
          Wisdom for the <span className="text-[var(--md3-secondary)] italic">Journey</span>
        </h1>
        <p className="text-[var(--md3-outline)] text-lg">
          Explore our collection of recovery literature, informational pamphlets, and daily guides.
        </p>
      </div>

      {/* Main Books Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[var(--md3-primary)] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--md3-secondary)]">book</span>
          NA Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {books.map((book) => (
            <BookCard key={book.title} book={book} onRead={() => setReadingBook(book)} />
          ))}
        </div>
      </section>

      {/* Free Literature Section */}
      <section>
        <h2 className="text-xl font-bold text-[var(--md3-primary)] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--md3-secondary)]">description</span>
          Free Informational Pamphlets & Resources
        </h2>

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
      </section>

      <section className="mt-12 p-6 bg-[var(--md3-surface-container-lowest)] border border-[var(--md3-outline-variant)]/10 rounded-3xl mb-8">
        <h2 className="text-xl font-semibold text-[var(--md3-primary)] mb-3">
          About NA Literature
        </h2>
        <p className="text-sm text-[var(--md3-outline)] leading-relaxed mb-4">
          NA literature is written by addicts, for addicts. Our literature shares the collective experience of recovering addicts around the world. It helps us learn how to live and enjoy life without drugs.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://na.org/literature/recovery-literature-in-english-usa/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--md3-surface-container-highest)] text-[var(--md3-outline)] hover:opacity-80 transition-opacity"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            More at NA World Services
          </a>
        </div>
      </section>
    </div>
  );
}
