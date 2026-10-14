import React from 'react';
import { Database, FileSpreadsheet, PlusCircle, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onOpenInputModal: () => void;
  onOpenSheetSettings: () => void;
  syncCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenInputModal,
  onOpenSheetSettings,
  syncCount
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <a href="#" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-emerald-800 tracking-wider text-base">SIPEKAT MBAY</span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Kabupaten Nagekeo</span>
            </div>
          </a>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
              Beranda
            </a>
            <a href="#data-utama" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
              Data Kawasan
            </a>
            <a href="#peta-kawasan" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
              Peta Interaktif
            </a>
            <a href="#komoditas" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
              Komoditas
            </a>
            <a href="#infrastruktur" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
              Infrastruktur
            </a>
            <a href="#kelola-data" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
              Sinkronisasi Sheet
            </a>
          </nav>

          {/* Zone 3: Actions & Google Sheet Webhook status */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenSheetSettings}
              title="Konfigurasi Webhook Google Sheets"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Google Sheet</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span className="tabular-nums">({syncCount})</span>
              </span>
            </button>

            <button
              onClick={onOpenInputModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Input Data</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
