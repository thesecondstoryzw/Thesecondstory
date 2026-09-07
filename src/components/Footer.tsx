import { BrandLogo } from '@/components/BrandLogo';

export function Footer() {
  return (
    <footer className="relative bg-[#080604] border-t border-[#d49a61]/10 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <BrandLogo className="h-11 w-auto max-w-[200px]" />
        <p className="font-mono-label text-[8px] text-[#f3e6d8]/25 text-center">
          Harare · Zimbabwe · Crafting Delicious Narratives
        </p>
        <p className="font-mono-label text-[8px] text-[#f3e6d8]/25">
          © {new Date().getFullYear()} The Second Story
        </p>
      </div>
    </footer>
  );
}
