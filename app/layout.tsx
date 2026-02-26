import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LocsongPhim - Xem Phim Miễn Phí Chất Lượng Cao",
  description:
    "Trang xem phim online miễn phí chất lượng cao. Vietsub, thuyết minh, lồng tiếng Full HD – 4K.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
  other: {
    "ed7a46dfbbfc63405a85fc54770b2f645a15dc39":
      "ed7a46dfbbfc63405a85fc54770b2f645a15dc39",
  },
  referrer: "no-referrer-when-downgrade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* ── Global Loader (server-rendered — visible before JS hydration) ── */}
        <div id="global-loader-root" aria-hidden="true">
          <div className="global-loader-glow" />
          <div className="global-loader-content">
            {/* Logo */}
            <div className="global-loader-logo">
              <div className="global-loader-logo-circle">
                <svg
                  className="global-loader-play"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg
                  className="global-loader-ring"
                  viewBox="0 0 44 44"
                  fill="none"
                >
                  <circle
                    cx="22"
                    cy="22"
                    r="20"
                    stroke="rgba(245,166,35,0.15)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="20"
                    stroke="#f5a623"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="30 96"
                  />
                </svg>
              </div>
              <div className="global-loader-brand">
                <span className="global-loader-brand-name">
                  Locsong<span>Phim</span>
                </span>
                <span className="global-loader-brand-sub">Phim hay từ HG</span>
              </div>
            </div>
            {/* Tagline */}
            <p className="global-loader-tagline">
              Xem Phim Miễn Phí Cực Nhanh, Chất Lượng Cao Và Cập Nhật Liên Tục
            </p>
            {/* Progress bar */}
            <div className="global-loader-bar-track">
              <div
                id="global-loader-bar"
                className="global-loader-bar-fill"
                style={{ width: "0%" }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </div>

        {/* Vanilla JS controller — runs immediately, no React needed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var el=document.getElementById('global-loader-root');
  var bar=document.getElementById('global-loader-bar');
  var p=0,done=false;
  function set(v){p=Math.min(v,100);if(bar)bar.style.width=p+'%';}
  var iv=setInterval(function(){
    if(p<70)set(p+Math.random()*9+4);
    else if(p<90)set(p+Math.random()*2+0.5);
    else clearInterval(iv);
  },110);
  function finish(){
    if(done)return;done=true;
    clearInterval(iv);set(100);
    setTimeout(function(){
      if(el){el.setAttribute('data-done','true');
        setTimeout(function(){if(el)el.style.display='none';},750);}
    },350);
  }
  if(document.readyState==='complete'){setTimeout(finish,450);}
  else{window.addEventListener('load',function(){setTimeout(finish,300);},{once:true});}
  setTimeout(finish,7000);
})();`,
          }}
        />

        <QueryProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
        </QueryProvider>
      </body>
    </html>
  );
}
