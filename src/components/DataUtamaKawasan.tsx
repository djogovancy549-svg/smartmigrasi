import React, { useState } from 'react';
import { Users, Home, Map, Sprout, TrendingUp, Layers, Milk, Wheat, Activity } from 'lucide-react';
import { TOTAL_KABUPATEN_NAGEKEO, KECAMATAN_NAGEKEO } from '../data/nagekeoData';

export const DataUtamaKawasan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'ternak' | 'pertanian'>('ringkasan');

  return (
    <section id="data-utama" className="py-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title with subtle bar matching flyer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Basis Data Spasial & Sektoral</span>
              <span>·</span>
              <span>Pembaruan Berkala</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Data Utama Kawasan Transmigrasi & Kabupaten
            </h2>
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 text-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('ringkasan')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'ringkasan'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kawasan Transmigrasi
            </button>
            <button
              onClick={() => setActiveTab('ternak')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'ternak'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Potensi Peternakan
            </button>
            <button
              onClick={() => setActiveTab('pertanian')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'pertanian'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Potensi Pertanian
            </button>
          </div>
        </div>

        {/* Tab 1: Ringkasan Kawasan Transmigrasi (matching exact flyer 4 cards) */}
        {activeTab === 'ringkasan' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Jumlah Penduduk */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Jumlah Penduduk</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums text-slate-900">
                  {TOTAL_KABUPATEN_NAGEKEO.mbaySpesifik.penduduk.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">jiwa</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+2.4% laju pertumbuhan</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Total 7 Kec. Nagekeo</span>
                <span className="font-bold tabular-nums text-slate-700">{TOTAL_KABUPATEN_NAGEKEO.totalPenduduk.toLocaleString('id-ID')} jiwa</span>
              </div>
            </div>

            {/* Card 2: Kepala Keluarga */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Kepala Keluarga</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums text-slate-900">
                  {TOTAL_KABUPATEN_NAGEKEO.mbaySpesifik.kk.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">KK</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+1.1% registrasi KK</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Total 7 Kec. Nagekeo</span>
                <span className="font-bold tabular-nums text-slate-700">{TOTAL_KABUPATEN_NAGEKEO.totalKK.toLocaleString('id-ID')} KK</span>
              </div>
            </div>

            {/* Card 3: Luas Kawasan */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Luas Kawasan</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Map className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums text-slate-900">
                  {TOTAL_KABUPATEN_NAGEKEO.mbaySpesifik.luasKawasanHa.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">hektare</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  Kawasan Inti Transmigrasi Mbay
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Luas Kabupaten</span>
                <span className="font-bold tabular-nums text-slate-700">{TOTAL_KABUPATEN_NAGEKEO.luasWilayahKm2.toLocaleString('id-ID')} km²</span>
              </div>
            </div>

            {/* Card 4: Lahan Produktif */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Lahan Produktif</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums text-emerald-700">
                  {TOTAL_KABUPATEN_NAGEKEO.mbaySpesifik.lahanProduktifHa.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">hektare</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+3.6% efisiensi tanam</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Irigasi Sutera Mbay</span>
                <span className="font-bold tabular-nums text-emerald-700">3.850 Ha terairi</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Sektor Peternakan */}
        {activeTab === 'ternak' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Sapi</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{TOTAL_KABUPATEN_NAGEKEO.totalSapi.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">Sentra Aesesa & Savana</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Kambing</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{TOTAL_KABUPATEN_NAGEKEO.totalKambing.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">Kambing Kacang Savana</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Babi</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{TOTAL_KABUPATEN_NAGEKEO.totalBabi.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">Sentra Boawae & Mauponggo</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Kerbau</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{TOTAL_KABUPATEN_NAGEKEO.totalKerbau.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-slate-600 mt-1">Kerbau Sawah & Adat</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Kuda</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{TOTAL_KABUPATEN_NAGEKEO.totalKuda.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-slate-600 mt-1">Kuda Pacu & Angkutan</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Unggas</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{TOTAL_KABUPATEN_NAGEKEO.totalUnggas.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">Ayam Buras & Petelur</div>
            </div>
          </div>
        )}

        {/* Tab 3: Sektor Pertanian & Irigasi */}
        {activeTab === 'pertanian' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Luas Lahan Padi Sawah</div>
              <div className="text-xl font-bold tabular-nums text-emerald-800">{TOTAL_KABUPATEN_NAGEKEO.totalPadiHa.toLocaleString('id-ID')} Ha</div>
              <div className="text-xs text-slate-600 mt-1">Estimasi Produksi: <strong>{TOTAL_KABUPATEN_NAGEKEO.totalProduksiPadiTon.toLocaleString('id-ID')} ton</strong>/tahun</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Luas Lahan Jagung Hibrida</div>
              <div className="text-xl font-bold tabular-nums text-amber-700">{TOTAL_KABUPATEN_NAGEKEO.totalJagungHa.toLocaleString('id-ID')} Ha</div>
              <div className="text-xs text-slate-600 mt-1">Estimasi Produksi: <strong>{TOTAL_KABUPATEN_NAGEKEO.totalProduksiJagungTon.toLocaleString('id-ID')} ton</strong>/tahun</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Jaringan Irigasi Teknis</div>
              <div className="text-xl font-bold tabular-nums text-sky-800">{TOTAL_KABUPATEN_NAGEKEO.luasIrigasiHa.toLocaleString('id-ID')} Ha</div>
              <div className="text-xs text-slate-600 mt-1">Didukung D.I. Sutera Mbay & Bendungan Aesesa</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Total Lahan Produktif</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{TOTAL_KABUPATEN_NAGEKEO.lahanProduktifHa.toLocaleString('id-ID')} Ha</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">Mencakup 55% dari total daratan</div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
