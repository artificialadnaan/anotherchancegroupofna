import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Sun, Sparkles } from "lucide-react";

export default function DailyReadingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[var(--md3-primary)]" data-testid="text-readings-heading">Daily Readings</h1>
        <p className="text-[var(--md3-outline)]">
          Start your day with NA daily meditation readings. These readings offer daily inspiration and guidance for living clean.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover-elevate bg-[var(--md3-surface-container-lowest)] rounded-3xl border border-[var(--md3-outline-variant)]/10" data-testid="card-jft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Sun className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <CardTitle className="text-lg text-[var(--md3-primary)]">Just for Today</CardTitle>
                <p className="text-sm text-[var(--md3-outline)]">Daily Meditation</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--md3-outline)] mb-4 leading-relaxed">
              "Just for Today" offers daily meditations for recovering addicts. Each day includes a quote from NA literature, a reflection on the quote, and a closing thought to carry throughout the day.
            </p>
            <a href="https://www.jftna.org/jft/" target="_blank" rel="noopener noreferrer" data-testid="link-jft" className="text-[var(--md3-secondary)]">
              <Button className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Read Today's JFT
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="hover-elevate bg-[var(--md3-surface-container-lowest)] rounded-3xl border border-[var(--md3-outline-variant)]/10" data-testid="card-spad">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <CardTitle className="text-lg text-[var(--md3-primary)]">Spiritual Principle a Day</CardTitle>
                <p className="text-sm text-[var(--md3-outline)]">Daily Meditation</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--md3-outline)] mb-4 leading-relaxed">
              "A Spiritual Principle a Day" explores the spiritual principles found in NA's Twelve Steps, Twelve Traditions, and Twelve Concepts. A daily reading to deepen your understanding of recovery.
            </p>
            <a href="https://www.spadna.org/spad/" target="_blank" rel="noopener noreferrer" data-testid="link-spad" className="text-[var(--md3-secondary)]">
              <Button className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Read Today's SPAD
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <section className="p-6 bg-[var(--md3-surface-container-lowest)] rounded-3xl border border-[var(--md3-outline-variant)]/10">
        <h2 className="text-xl font-semibold mb-3 text-[var(--md3-primary)]">About Daily Readings</h2>
        <p className="text-sm text-[var(--md3-outline)] leading-relaxed mb-3">
          Daily meditation readings are an important part of many NA members' recovery routines. They provide a moment of reflection and connection to the principles of recovery each day.
        </p>
        <p className="text-sm text-[var(--md3-outline)] leading-relaxed">
          Whether you're starting your morning or winding down your evening, taking a few minutes to read and reflect can strengthen your recovery and keep you grounded in the principles of the program.
        </p>
      </section>
    </div>
  );
}
