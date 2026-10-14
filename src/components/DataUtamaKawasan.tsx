import React, { useState } from 'react';
import { Users, Home, Map, Sprout, TrendingUp, Layers, Milk, Wheat, Activity } from 'lucide-react';
import { SheetEntry } from '../types';

interface DataUtamaKawasanProps {
  entries: SheetEntry[];
}

export const DataUtamaKawasan: React.FC<DataUtamaKawasanProps> = ({ entries }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'ternak' | 'pertanian'>('ringkasan');

  // Dynamic calculations from actual entries
  const totalPenduduk = entries
    .filter(e => e.kategori === 'Kependudukan')
    .reduce((sum, e) => sum + (e.jumlahPopulasi || 0), 0);

  const totalKK = entries
    .filter(e => e.kategori === 'Kependudukan' && (e.satuan || '').toLowerCase().includes('kk'))
    .reduce((sum, e) => sum + (e.jumlahPopulasi || 0), 0);

  const totalLuasHa = entries.reduce((sum, e) => sum + (e.luasHa || 0), 0);

  const totalProduktifHa = entries
    .filter(e => e.kategori === 'Pertanian' || e.kategori === 'Ternak')
    .reduce((sum, e) => sum + (e.luasHa || 0), 0);

  // Livestock dynamic counts
  const countAnimal = (keyword: string) => {
    return entries
      .filter(e => e.kategori === 'Ternak' && (e.jenisKomoditas || '').toLowerCase().includes(keyword.toLowerCase()))
      .reduce((sum, e) => sum + (e.jumlahPopulasi || 0), 0);
  };

  const sapiCount = countAnimal('sapi');
  const kambingCount = countAnimal('kambing');
  const babiCount = countAnimal('babi');
  const kerbauCount = countAnimal('kerbau');
  const kudaCount = countAnimal('kuda');
  const unggasCount = countAnimal('unggas') + countAnimal('ayam') + countAnimal('bebek');

  // Agriculture dynamic counts
  const countCropHa = (keyword: string) => {
    return entries
      .filter(e => e.kategori === 'Pertanian' && (e.jenisKomoditas || '').toLowerCase().includes(keyword.toLowerCase()))
      .reduce((sum, e) => sum + (e.luasHa || 0), 0);
  };

  const padiHa = countCropHa('padi');
  const jagungHa = countCropHa('jagung');
  const hortiHa = entries
    .filter(e => e.kategori === 'Pertanian' && !(e.jenisKomoditas || '').toLowerCase().includes('padi') && !(e.jenisKomoditas || '').toLowerCase().includes('jagung'))
    .reduce((sum, e) => sum + (e.luasHa || 0), 0);

  return (
    <section id="data-utama" className="py-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Basis Data Terpadu</span>
              <span>·</span>
              <span>Rekapitulasi Riil ({entries.length} Catatan)</span>
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

        {/* Tab 1: Ringkasan Kawasan Transmigrasi */}
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
                  {totalPenduduk.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">jiwa</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <span>{totalPenduduk > 0 ? 'Data tersimpan' : 'Belum ada data input'}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Status Entri</span>
                <span className="font-bold tabular-nums text-slate-700">{entries.filter(e => e.kategori === 'Kependudukan').length} catatan</span>
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
                  {totalKK.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">KK</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <span>{totalKK > 0 ? 'Data tersimpan' : 'Belum ada data input'}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Status Entri</span>
                <span className="font-bold tabular-nums text-slate-700">{totalKK > 0 ? 'Terverifikasi' : 'Kosong'}</span>
              </div>
            </div>

            {/* Card 3: Luas Kawasan */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Luas Kawasan Terdata</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Map className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums text-slate-900">
                  {totalLuasHa.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">hektare</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  {totalLuasHa > 0 ? 'Total luas terdata lapangan' : 'Belum ada data input'}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Status Entri</span>
                <span className="font-bold tabular-nums text-slate-700">{entries.filter(e => e.luasHa && e.luasHa > 0).length} bidang</span>
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
                  {totalProduktifHa.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">hektare</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <span>{totalProduktifHa > 0 ? 'Pertanian & peternakan' : 'Belum ada data input'}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Status Entri</span>
                <span className="font-bold tabular-nums text-emerald-700">{totalProduktifHa > 0 ? 'Aktif' : '0 Ha'}</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Sektor Peternakan */}
        {activeTab === 'ternak' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Sapi</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{sapiCount.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-slate-400 mt-1">{sapiCount > 0 ? 'Data terinput' : '0 ekor'}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Kambing</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{kambingCount.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-slate-400 mt-1">{kambingCount > 0 ? 'Data terinput' : '0 ekor'}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Babi</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{babiCount.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-slate-400 mt-1">{babiCount > 0 ? 'Data terinput' : '0 ekor'}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Kerbau</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{kerbauCount.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-slate-400 mt-1">{kerbauCount > 0 ? 'Data terinput' : '0 ekor'}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Kuda</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{kudaCount.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-slate-400 mt-1">{kudaCount > 0 ? 'Data terinput' : '0 ekor'}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Populasi Unggas</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{unggasCount.toLocaleString('id-ID')}</div>
              <div className="text-[11px] text-slate-400 mt-1">{unggasCount > 0 ? 'Data terinput' : '0 ekor'}</div>
            </div>
          </div>
        )}

        {/* Tab 3: Sektor Pertanian & Irigasi */}
        {activeTab === 'pertanian' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Luas Lahan Padi Sawah</div>
              <div className="text-xl font-bold tabular-nums text-emerald-800">{padiHa.toLocaleString('id-ID')} Ha</div>
              <div className="text-xs text-slate-400 mt-1">{padiHa > 0 ? 'Terekam di sistem' : 'Belum ada input'}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Luas Lahan Jagung</div>
              <div className="text-xl font-bold tabular-nums text-amber-700">{jagungHa.toLocaleString('id-ID')} Ha</div>
              <div className="text-xs text-slate-400 mt-1">{jagungHa > 0 ? 'Terekam di sistem' : 'Belum ada input'}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Hortikultura / Kebun</div>
              <div className="text-xl font-bold tabular-nums text-sky-800">{hortiHa.toLocaleString('id-ID')} Ha</div>
              <div className="text-xs text-slate-400 mt-1">{hortiHa > 0 ? 'Terekam di sistem' : 'Belum ada input'}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Total Lahan Produktif</div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{totalProduktifHa.toLocaleString('id-ID')} Ha</div>
              <div className="text-xs text-slate-400 mt-1">{totalProduktifHa > 0 ? 'Dari data terinput' : 'Belum ada input'}</div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
