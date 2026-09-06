import { Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-[#0d0805] border-t border-[#c9a04e]/10 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-5 h-5 text-[#c9a04e]" />
            <span className="font-serif-display text-lg text-[#f5ebe0]">
              The Second Story
            </span>
          </div>

          <p className="font-mono-label text-[8px] text-[#f5ebe0]/30 text-center">
            Coffee · Crafted Daily · Every Cup Tells a Story
          </p>

          <p className="font-mono-label text-[8px] text-[#f5ebe0]/30">
            © {new Date().getFullYear()} The Second Story
          </p>
        </div>
      </div>
    </footer>
  );
}
