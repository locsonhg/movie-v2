import Link from "next/link";

const FOOTER_NAV = [
  {
    title: "Khám Phá",
    links: [
      { label: "Phim Mới", href: "/danh-sach/phim-moi" },
      { label: "Phim Bộ", href: "/danh-sach/phim-bo" },
      { label: "Phim Lẻ", href: "/danh-sach/phim-le" },
      { label: "Hoạt Hình", href: "/danh-sach/hoat-hinh" },
      { label: "TV Shows", href: "/danh-sach/tv-shows" },
      { label: "Chiếu Rạp", href: "/danh-sach/phim-chieu-rap" },
    ],
  },
  {
    title: "Thể Loại",
    links: [
      { label: "Hành Động", href: "/the-loai/hanh-dong" },
      { label: "Tình Cảm", href: "/the-loai/tinh-cam" },
      { label: "Hài Hước", href: "/the-loai/hai-huoc" },
      { label: "Kinh Dị", href: "/the-loai/kinh-di" },
      { label: "Viễn Tưởng", href: "/the-loai/vien-tuong" },
      { label: "Tâm Lý", href: "/the-loai/tam-ly" },
    ],
  },
  {
    title: "Hỗ Trợ",
    links: [
      { label: "Giới Thiệu", href: "/gioi-thieu" },
      { label: "Hỏi - Đáp", href: "/hoi-dap" },
      { label: "Liên Hệ", href: "/lien-he" },
      { label: "Chính Sách Bảo Mật", href: "/chinh-sach-bao-mat" },
      { label: "Điều Khoản Sử Dụng", href: "/dieu-khoan-su-dung" },
    ],
  },
];

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 1 0 24 12 12 12 0 0 0 11.944 0zm5.878 8.16l-1.97 9.28c-.15.66-.54.82-1.08.51l-3-2.21-1.45 1.4c-.16.16-.3.3-.61.3l.22-3.1 5.56-5.02c.24-.21-.05-.33-.37-.12L7.1 13.43l-2.96-.92c-.64-.2-.65-.64.14-.95l11.57-4.46c.53-.19 1 .13.82.9z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.053a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    Icon: FacebookIcon,
    color: "hover:bg-[#1877f2] hover:border-[#1877f2]",
  },
  {
    label: "Telegram",
    href: "https://t.me",
    Icon: TelegramIcon,
    color: "hover:bg-[#0088cc] hover:border-[#0088cc]",
  },
  {
    label: "Discord",
    href: "https://discord.gg",
    Icon: DiscordIcon,
    color: "hover:bg-[#5865f2] hover:border-[#5865f2]",
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-[#13151e]">
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            {/* Logo */}
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5a623]">
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Locsonhg<span className="text-[#f5a623]">Phim</span>
                </span>
                <p className="text-[10px] font-medium text-white/40 leading-none mt-0.5">
                  Phim hay từ HG
                </p>
              </div>
            </Link>

            <p className="mb-6 text-sm leading-relaxed text-white/40">
              Trang xem phim online miễn phí chất lượng cao. Vietsub, thuyết
              minh, lồng tiếng Full HD – 4K.
            </p>

            {/* Social */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-all hover:text-white ${color}`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 text-center md:flex-row md:justify-between md:px-6 md:text-left">
          <p className="text-xs text-white/25">
            © 2026 LocsonhgPhim. All rights reserved.
          </p>
          <p className="text-xs font-medium text-white/30">
            🇻🇳 Hoàng Sa & Trường Sa là của Việt Nam!
          </p>
        </div>
      </div>
    </footer>
  );
}
