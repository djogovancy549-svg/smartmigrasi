import React from 'react';
import { ShieldCheck, Map, Target, Globe, Award, ArrowRight } from 'lucide-react';

interface FooterBannerProps {
  onScrollToTop: () => void;
  onOpenInputModal: () => void;
}

export const FooterBanner: React.FC<FooterBannerProps> = ({
  onScrollToTop,
  onOpenInputModal
}) => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full-width Callout Banner matching the poster footer */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 border border-emerald-700/50 p-6 sm:p-8 mb-12 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                Visi Satu Data Transmigrasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                Satu Data. Satu Peta. Satu Informasi Kawasan.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Untuk Mbay & Kabupaten Nagekeo yang lebih maju, mandiri, berdaya saing pangan tinggi, dan berkelanjutan bagi seluruh warga transmigran serta masyarakat lokal.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenInputModal}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 bg-white hover:bg-emerald-50 rounded-lg shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Input Data Lapangan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Badges from the Right-Hand Strip in the user's poster */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pb-12 border-b border-slate-800 text-xs">
          
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/60 text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">Data Terpercaya</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Menyajikan informasi akurat dan terkini bersumber dari dinas teknis, BPS, dan PPL lapangan.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/60 text-emerald-300 flex items-center justify-center">
              <Map className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">Peta Interaktif</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Visualisasi spasial dan potensi kawasan dalam satu peta digital Leaflet dengan 3 mode layer.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/60 text-emerald-300 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">Mendukung Pembangunan</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Menjadi dasar perencanaan spasial dan pengambilan kebijakan strategis kepala daerah.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/60 text-emerald-300 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">Mudah Diakses</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Informasi terbuka untuk pemerintah, petani transmigran, dan pemangku kepentingan.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/60 text-emerald-300 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">Transparan & Akuntabel</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Mewujudkan tata kelola data transmigrasi partisipatif dan tersinkronisasi Google Sheet.
            </p>
          </div>

        </div>

        {/* Bottom copyright & handwritten motto signature */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 SIPEKAT MBAY · Pemerintah Kabupaten Nagekeo & Kementerian Transmigrasi RI.
          </div>

          <div className="font-serif italic text-sm text-emerald-400 tracking-wide">
            "Data Hari Ini Untuk Masa Depan Mbay & Nagekeo"
          </div>
        </div>

      </div>
    </footer>
  );
};
