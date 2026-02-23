import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, FileText, Download } from "lucide-react";
import { useState } from "react";
import type { Literature } from "@shared/schema";

function LiteratureCard({ item }: { item: Literature }) {
  return (
    <Card className="hover-elevate" data-testid={`card-literature-${item.id}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <CardTitle className="text-base">{item.title}</CardTitle>
          <Badge variant="outline" className="shrink-0 w-fit">{item.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{item.description}</p>
        {item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-literature-${item.id}`}
          >
            <Button variant="outline" size="sm">
              {item.externalUrl.endsWith('.pdf') ? (
                <>
                  <FileText className="w-3 h-3 mr-2" />
                  View PDF
                </>
              ) : (
                <>
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Read More
                </>
              )}
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function LiteratureSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-44" />
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
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">NA Literature</h1>
        <p className="text-muted-foreground">
          Recovery literature is a vital part of the NA program. Explore resources to support your recovery journey.
        </p>
      </div>

      {!isLoading && categories.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="shrink-0"
            onClick={() => setSelectedCategory(null)}
            data-testid="button-filter-all"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="shrink-0"
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-filter-${category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {isLoading && <LiteratureSkeleton />}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load literature. Please try again later.</p>
        </Card>
      )}

      {filteredItems && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <LiteratureCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && !error && filteredItems?.length === 0 && (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Literature Found</h3>
          <p className="text-sm text-muted-foreground">
            {selectedCategory
              ? `No literature available in the "${selectedCategory}" category.`
              : "Literature resources are being added. Please check back soon."}
          </p>
        </Card>
      )}

      <section className="mt-12 p-6 bg-muted/50 rounded-md">
        <h2 className="text-xl font-semibold mb-3">About NA Literature</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          NA literature is written by addicts, for addicts. Our literature shares the collective experience of recovering addicts around the world. It helps us learn how to live and enjoy life without drugs.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="https://www.na.org/meetingsearch/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-3 h-3 mr-2" />
              NA World Services
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
