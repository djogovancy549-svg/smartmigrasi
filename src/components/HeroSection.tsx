import React, { useState } from 'react';
import { ArrowRight, MapPin, Users, Home, Maximize, Sprout, Layers } from 'lucide-react';
import { TOTAL_KABUPATEN_NAGEKEO } from '../data/nagekeoData';
import heroMbayImage from '../assets/images/hero_mbay_transmigrasi_1791964149257.jpg';

interface HeroSectionProps {
  onScrollToMap: () => void;
  onScrollToData: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToMap,
  onScrollToData
}) => {
  const [viewScope, setViewScope] = useState<'mbay' | 'nagekeo'>('mbay');

  const stats = viewScope === 'mbay'
    ? {
        label: 'Kawasan Transmigrasi Mbay',
        penduduk: TOTAL_KABUPATEN_NAGEKEO.mbaySpesifik.penduduk,
        kk: TOTAL_KABUPATEN_NAGEKEO.mbaySpesifik.kk,
        luas: TOTAL_KABUPATEN_NAGEKEO.mbaySpesifik.luasKawasanHa,
        produktif: TOTAL_KABUPATEN_NAGEKEO.mbaySpesifik.lahanProduktifHa,
        catatan: 'Pusat Kawasan Transmigrasi Prioritas Nasional (D.I. Sutera Mbay)'
      }
    : {
        label: 'Total Kabupaten Nagekeo (7 Kecamatan)',
        penduduk: TOTAL_KABUPATEN_NAGEKEO.totalPenduduk,
        kk: TOTAL_KABUPATEN_NAGEKEO.totalKK,
        luas: TOTAL_KABUPATEN_NAGEKEO.luasWilayahHa,
        produktif: TOTAL_KABUPATEN_NAGEKEO.lahanProduktifHa,
        catatan: 'Aesesa, Aesesa Selatan, Boawae, Mauponggo, Nangaroro, Keo Tengah, Wolowae'
      };

  return (
    <section id="hero" className="relative bg-white pt-6 pb-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-4">
          <span>Kementerian Transmigrasi & Pemkab Nagekeo</span>
          <span aria-hidden="true">·</span>
          <span>Sistem Informasi Terpadu</span>
          <span aria-hidden="true">·</span>
          <span>Tahun 2026</span>
        </div>

        {/* 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Heading + Subtitle + Action buttons + Hero Image */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-2xl">
                Data Kawasan Mbay & Nagekeo dalam Satu Platform.
              </h1>
              
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Akses informasi demografi, pemanfaatan lahan beririgasi teknis, komoditas unggulan pertanian, populasi peternakan, infrastruktur, dan perkembangan kawasan transmigrasi secara terpadu, cepat, dan transparan.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={onScrollToData}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Jelajahi Data</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onScrollToMap}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Lihat Peta Kawasan</span>
                </button>
              </div>
            </div>

            {/* Generated Hero Image Banner */}
            <div className="mt-6 relative rounded-xl overflow-hidden border border-slate-200/90 shadow-xs group">
              <img
                src={heroMbayImage}
                alt="Persawahan Irigasi Sutera Mbay Lembah Nagekeo"
                className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to public folder path if needed
                  const target = e.currentTarget;
                  if (!target.src.includes('/images/hero_mbay_transmigrasi_1791964149257.jpg')) {
                    target.src = '/images/hero_mbay_transmigrasi_1791964149257.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                <div className="text-white text-xs">
                  <div className="font-semibold text-sm">Lembah Persawahan Beririgasi Mbay</div>
                  <div className="text-slate-200 text-[11px]">Kawasan Transmigrasi Utama Sutera Mbay · Kabupaten Nagekeo, NTT</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: "Mbay dalam Angka" Card (matching flyer layout) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
              
              <div>
                {/* Header of the right card */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      Mbay dalam Angka
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Ringkasan data pokok kawasan transmigrasi
                    </p>
                  </div>

                  {/* Scope Selector Button Toggle */}
                  <div className="flex items-center p-1 bg-white rounded-lg border border-slate-200 text-xs">
                    <button
                      onClick={() => setViewScope('mbay')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                        viewScope === 'mbay'
                          ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Mbay
                    </button>
                    <button
                      onClick={() => setViewScope('nagekeo')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                        viewScope === 'nagekeo'
                          ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      7 Kec. Nagekeo
                    </button>
                  </div>
                </div>

                {/* Mini Stylized Map Schematic Illustration */}
                <div className="my-4 p-3 bg-white rounded-lg border border-slate-200/90 relative overflow-hidden flex items-center justify-between">
                  <div className="text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      Fokus Kawasan
                    </span>
                    <div className="font-bold text-slate-800">{stats.label}</div>
                    <div className="text-[11px] text-slate-500 max-w-[220px]">
                      {stats.catatan}
                    </div>
                  </div>

                  {/* SVG Map Schematic of Nagekeo & Mbay */}
                  <div className="w-24 h-20 bg-emerald-50 rounded border border-emerald-200/80 p-1 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 100 80" className="w-full h-full text-emerald-700 fill-emerald-100 stroke-emerald-600">
                      {/* Stylized contours of Nagekeo coastal northern Mbay and southern Keo */}
                      <path
                        d="M20,15 Q40,5 65,10 Q85,15 90,30 Q92,50 70,68 Q50,75 30,70 Q15,60 18,40 Z"
                        strokeWidth="1.5"
                      />
                      {/* Mbay highlighted zone in North */}
                      <path
                        d="M45,15 Q65,12 75,22 Q60,32 45,26 Z"
                        className="fill-emerald-600 stroke-emerald-800"
                        strokeWidth="1.5"
                      />
                      <circle cx="58" cy="20" r="2.5" className="fill-white" />
                      <text x="38" y="42" className="text-[8px] fill-emerald-950 font-bold font-sans">NAGEKEO</text>
                      <text x="50" y="27" className="text-[6px] fill-emerald-900 font-bold font-sans">MBAY</text>
                    </svg>
                  </div>
                </div>

                {/* 4 Core Quantitative Attributes matching flyer */}
                <div className="space-y-3">
                  
                  {/* Jumlah Penduduk */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-700">Jumlah Penduduk</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums text-slate-900">
                        {stats.penduduk.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-normal text-slate-500">jiwa</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">+2.4% tahunan</div>
                    </div>
                  </div>

                  {/* Kepala Keluarga */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-700">Kepala Keluarga</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums text-slate-900">
                        {stats.kk.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-normal text-slate-500">KK</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">+1.1% tahunan</div>
                    </div>
                  </div>

                  {/* Luas Kawasan */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Maximize className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-700">Luas Kawasan</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums text-slate-900">
                        {stats.luas.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-normal text-slate-500">hektare</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {viewScope === 'mbay' ? 'D.I. Sutera Mbay' : '1.416,96 km² total'}
                      </div>
                    </div>
                  </div>

                  {/* Lahan Produktif */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-700">Lahan Produktif</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums text-emerald-700">
                        {stats.produktif.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-normal text-slate-500">hektare</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">+3.6% pemanfaatan</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom footer text */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Sumber: Disnakertrans & BPS 2026</span>
                <span className="text-emerald-700 font-semibold">Status: Validasi Resmi</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
