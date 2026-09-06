import { Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-[#0d0805] border-t border-[#c9a04e]/8 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-4 h-4 text-[#c9a04e]" />
            <span className="font-serif-display text-base text-[#f5ebe0]">
              The Second Story
            </span>
          </div>

          <p className="font-mono-label text-[8px] text-[#f5ebe0]/25 text-center">
            Harare · Zimbabwe · Crafting Delicious Narratives
          </p>

          <p className="font-mono-label text-[8px] text-[#f5ebe0]/25">
            © {new Date().getFullYear()} The Second Story
          </p>
        </div>
      </div>
    </footer>
  );
}
