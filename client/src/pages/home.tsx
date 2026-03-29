import { Link } from "wouter";

const quickLinks = [
  { title: "Find a Meeting", icon: "location_on", href: "/meetings" },
  { title: "NA Literature", icon: "library_books", href: "/literature" },
  { title: "Calendar", icon: "calendar_month", href: "/calendar" },
  { title: "Service Positions", icon: "groups", href: "/service-positions" },
];

export default function HomePage() {
  return (
    <div className="min-h-full pb-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Hero Section */}
        <section className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden min-h-[320px] sm:min-h-[400px] flex items-end p-6 sm:p-8 md:p-12 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--md3-primary)] to-[var(--md3-primary-container)]" />
          <div className="relative z-10 space-y-3 sm:space-y-4 max-w-2xl">
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[var(--md3-secondary-container)] text-[var(--md3-on-secondary-container)] text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              Member Portal
            </span>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Welcome to Recovery,
              <br />
              <span className="text-[var(--md3-secondary-container)]">Another Chance Group</span>
            </h2>
            <p className="text-[var(--md3-on-primary-container)] text-base sm:text-lg font-medium max-w-md">
              You never have to use again. One day at a time, we walk this path together.
            </p>
          </div>
        </section>

        {/* Bento Grid: JFT + Help */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Just For Today Card */}
          <article className="md:col-span-8 bg-[var(--md3-surface-container-lowest)] rounded-3xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(25,28,29,0.04)] border border-[var(--md3-outline-variant)]/10 flex flex-col justify-between">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--md3-primary)] text-2xl sm:text-3xl">menu_book</span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--md3-primary)]">Just for Today</h3>
              </div>
              <div className="space-y-3">
                <p className="text-[var(--md3-outline)] font-semibold tracking-wide uppercase text-xs sm:text-sm">Daily Meditation</p>
                <h4 className="text-2xl sm:text-3xl font-bold leading-snug">One Day at a Time</h4>
                <p className="text-[var(--md3-outline)] text-base sm:text-lg leading-relaxed line-clamp-3">
                  "Just for today, I will try to live through this day only, and not tackle my whole life problem at once. I can do something for twelve hours that would appall me if I felt that I had to keep it up for a lifetime..."
                </p>
              </div>
            </div>
            <div className="mt-6 sm:mt-8">
              <a
                href="https://www.jftna.org/jft/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--md3-secondary-container)] text-[var(--md3-on-secondary-container)] h-12 sm:h-14 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 transition-all"
              >
                Read Full Meditation
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </article>

          {/* Urgent Help Card */}
          <aside className="md:col-span-4 bg-[var(--md3-error-container)] rounded-3xl p-6 sm:p-8 border border-[var(--md3-error)]/10 flex flex-col items-center text-center justify-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[var(--md3-error)] text-3xl sm:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency_home
              </span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[var(--md3-on-error-container)]">Need Help Now?</h3>
              <p className="text-[var(--md3-on-error-container)]/80 font-medium text-sm sm:text-base">Available 24/7 for support.</p>
            </div>
            <a
              className="w-full bg-[var(--md3-error)] text-white h-14 sm:h-16 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
              href="tel:18187739999"
            >
              <span className="material-symbols-outlined">call</span>
              1-818-773-9999
            </a>
            <p className="text-[var(--md3-on-error-container)] text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-60">
              NA Helpline 24/7
            </p>
          </aside>
        </div>

        {/* Quick Links Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-[var(--md3-surface-container-high)] rounded-3xl p-5 sm:p-6 hover:bg-[var(--md3-secondary-container)] transition-colors cursor-pointer group flex flex-col h-36 sm:h-48 justify-between active:scale-95 duration-150">
                <span
                  className="material-symbols-outlined text-[var(--md3-secondary)] text-3xl sm:text-4xl group-hover:scale-110 transition-transform"
                >
                  {item.icon}
                </span>
                <h3 className="text-base sm:text-xl font-bold text-[var(--md3-primary)]">{item.title}</h3>
              </div>
            </Link>
          ))}
        </section>

        {/* More Resources Row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Link href="/daily-readings">
            <div className="bg-[var(--md3-surface-container-lowest)] rounded-2xl p-5 border border-[var(--md3-outline-variant)]/10 flex items-center gap-4 hover:bg-[var(--md3-surface-container-high)] transition-colors cursor-pointer active:scale-[0.98] duration-150">
              <span className="material-symbols-outlined text-[var(--md3-tertiary)] text-2xl">auto_stories</span>
              <div>
                <h4 className="font-bold text-sm text-[var(--md3-primary)]">Daily Readings</h4>
                <p className="text-xs text-[var(--md3-outline)]">JFT & SPAD</p>
              </div>
            </div>
          </Link>
          <Link href="/birthday-signup">
            <div className="bg-[var(--md3-surface-container-lowest)] rounded-2xl p-5 border border-[var(--md3-outline-variant)]/10 flex items-center gap-4 hover:bg-[var(--md3-surface-container-high)] transition-colors cursor-pointer active:scale-[0.98] duration-150">
              <span className="material-symbols-outlined text-[var(--md3-secondary)] text-2xl">cake</span>
              <div>
                <h4 className="font-bold text-sm text-[var(--md3-primary)]">Birthday Sign-Up</h4>
                <p className="text-xs text-[var(--md3-outline)]">Celebrate milestones</p>
              </div>
            </div>
          </Link>
          <Link href="/newsletter">
            <div className="bg-[var(--md3-surface-container-lowest)] rounded-2xl p-5 border border-[var(--md3-outline-variant)]/10 flex items-center gap-4 hover:bg-[var(--md3-surface-container-high)] transition-colors cursor-pointer active:scale-[0.98] duration-150">
              <span className="material-symbols-outlined text-[var(--md3-primary)] text-2xl">mail</span>
              <div>
                <h4 className="font-bold text-sm text-[var(--md3-primary)]">Newsletter</h4>
                <p className="text-xs text-[var(--md3-outline)]">Stay connected</p>
              </div>
            </div>
          </Link>
        </section>

        {/* Area Resources */}
        <section className="bg-[var(--md3-surface-container-lowest)] rounded-3xl p-6 sm:p-8 border border-[var(--md3-outline-variant)]/10">
          <h3 className="text-lg font-bold text-[var(--md3-primary)] mb-4">Fort Worth Area Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[var(--md3-secondary)] text-xl mt-0.5">call</span>
              <div>
                <p className="text-sm font-bold">NA Helpline</p>
                <a href="tel:18886296757" className="text-sm text-[var(--md3-outline)] hover:underline">
                  888-629-6757 (888-NA-WORKS)
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[var(--md3-secondary)] text-xl mt-0.5">call</span>
              <div>
                <p className="text-sm font-bold">Spanish Helpline</p>
                <a href="tel:18886006229" className="text-sm text-[var(--md3-outline)] hover:underline">
                  888-600-6229
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[var(--md3-secondary)] text-xl mt-0.5">language</span>
              <div>
                <p className="text-sm font-bold">FW Area Website</p>
                <a href="https://www.fwana.org" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--md3-outline)] underline underline-offset-2">
                  www.fwana.org
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[var(--md3-secondary)] text-xl mt-0.5">storefront</span>
              <div>
                <p className="text-sm font-bold">Area Service Office</p>
                <p className="text-sm text-[var(--md3-outline)]">6816 Camp Bowie Blvd. West, Ste 124</p>
                <p className="text-xs text-[var(--md3-outline)]">Mon & Thu 6-8 PM | 817-335-6360</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
