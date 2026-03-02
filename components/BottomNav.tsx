import { useRouter } from "next/router";
import type { SVGProps } from "react";

function HomeIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M4 10.6 12 4l8 6.6V20a2 2 0 0 1-2 2h-3v-7H9v7H6a2 2 0 0 1-2-2v-9.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.7-.3-3.9-.8L3 21l1.3-5.6A8.5 8.5 0 1 1 21 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M7 3v3M17 3v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 12h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M12 12a4.2 4.2 0 1 0 0-8.4A4.2 4.2 0 0 0 12 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 21c1.8-4 5-6 7.5-6s5.7 2 7.5 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const items = [
  { href: "/feed", label: "בית", Icon: HomeIcon },
  { href: "/search", label: "חיפוש", Icon: SearchIcon },
  { href: "/messages", label: "הודעות", Icon: ChatIcon },
  { href: "/calendar", label: "לוח", Icon: CalendarIcon },
  { href: "/profile", label: "פרופיל", Icon: UserIcon },
];

export default function BottomNav() {
  const router = useRouter();
  const path = router.pathname;

  const isActive = (href: string) =>
    path === href || (href !== "/" && path.startsWith(href + "/"));

  return (
    <nav className="bn" aria-label="ניווט תחתון">
      {items.map(({ href, label, Icon }) => {
        const active = isActive(href);
        return (
          <button
            key={href}
            className={`it ${active ? "on" : ""}`}
            onClick={() => router.push(href)}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <span className="ic">
              <Icon className="svg" />
            </span>
            <span className="tx">{label}</span>
            <span className="dot" aria-hidden />
          </button>
        );
      })}

      <style jsx>{`
        .bn {
          position: fixed;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: min(520px, calc(100vw - 24px));
          height: 64px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.86);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(17, 24, 39, 0.10);
          box-shadow: 0 22px 60px rgba(17, 24, 39, 0.16);
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 8px;
          z-index: 1000;
        }

        .it {
          border: 0;
          background: transparent;
          border-radius: 14px;
          display: grid;
          place-items: center;
          gap: 4px;
          color: rgba(17, 24, 39, 0.72);
          transition: transform 160ms ease, background 160ms ease, color 160ms ease;
          position: relative;
        }

        .it:hover {
          background: rgba(17, 24, 39, 0.06);
          color: rgba(17, 24, 39, 0.92);
          transform: translateY(-1px);
        }

        .it:active {
          transform: translateY(0px) scale(0.98);
        }

        .it.on {
          color: #111827;
          background: rgba(17, 24, 39, 0.05);
        }

        .ic {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
        }

        /* hard-size svg (prevents “giant icons”) */
        .svg {
          width: 22px !important;
          height: 22px !important;
          display: block;
        }

        .tx {
          font-size: 11px;
          font-weight: 900;
          line-height: 1;
        }

        .dot {
          position: absolute;
          bottom: 6px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #111827;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .it.on .dot {
          opacity: 0.9;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .it,
          .dot {
            transition: none;
          }
        }
      `}</style>
    </nav>
  );
}
