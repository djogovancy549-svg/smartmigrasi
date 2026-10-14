import React, { useState } from 'react';
import { Route, Droplets, GraduationCap, HeartPulse, Store, Building2, Users } from 'lucide-react';
import { TOTAL_KABUPATEN_NAGEKEO, KECAMATAN_NAGEKEO } from '../data/nagekeoData';

export const InfrastrukturKawasan: React.FC = () => {
  const [selectedKecId, setSelectedKecId] = useState<string>('aesesa');

  const currentKec = KECAMATAN_NAGEKEO.find(k => k.id === selectedKecId) || KECAMATAN_NAGEKEO[0];

  return (
    <section id="infrastruktur" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching poster format */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Sarana dan Prasarana Wilayah</span>
              <span>·</span>
              <span>Dukungan Konektivitas & Layanan Publik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Infrastruktur Kawasan
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Fasilitas penunjang mobilitas hasil panen, pasokan irigasi teknis bendungan, sarana pendidikan generasi transmigran, dan fasilitas kesehatan.
            </p>
          </div>

          {/* District selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs text-slate-500 font-medium shrink-0">Wilayah:</span>
            {KECAMATAN_NAGEKEO.map((k) => (
              <button
                key={k.id}
                onClick={() => setSelectedKecId(k.id)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedKecId === k.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {k.nama}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Primary Infrastructure Cards matching flyer icons & numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          
          {/* Jalan */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Jaringan Jalan</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Route className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums text-slate-900">
                {currentKec.infrastruktur.panjangJalanKm}{' '}
                <span className="text-xs font-normal text-slate-500">km</span>
              </div>
              <div className="mt-1 text-xs text-slate-600">Poros utama & tani</div>
            </div>
          </div>

          {/* Irigasi */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Irigasi Teknis</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums text-sky-700">
                {currentKec.infrastruktur.luasIrigasiHa.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-normal text-slate-500">ha</span>
              </div>
              <div className="mt-1 text-xs text-slate-600">Terairi teknis/semi</div>
            </div>
          </div>

          {/* Sekolah */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Fasilitas Sekolah</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums text-slate-900">
                {currentKec.infrastruktur.sekolahUnit}{' '}
                <span className="text-xs font-normal text-slate-500">unit</span>
              </div>
              <div className="mt-1 text-xs text-slate-600">SD, SMP, & SMA/SMK</div>
            </div>
          </div>

          {/* Kesehatan */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Layanan Kesehatan</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums text-rose-700">
                {currentKec.infrastruktur.kesehatanUnit}{' '}
                <span className="text-xs font-normal text-slate-500">unit</span>
              </div>
              <div className="mt-1 text-xs text-slate-600">Puskesmas & Pustu</div>
            </div>
          </div>

          {/* Pasar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Pasar Rakyat</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums text-slate-900">
                {currentKec.infrastruktur.pasarUnit}{' '}
                <span className="text-xs font-normal text-slate-500">unit</span>
              </div>
              <div className="mt-1 text-xs text-slate-600">Pusat transaksi niaga</div>
            </div>
          </div>

        </div>

        {/* Kelembagaan Petani & Pengairan Strip */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Kelompok Tani & Gapoktan</div>
              <div className="text-sm font-semibold tabular-nums text-emerald-800 mt-0.5">
                {currentKec.infrastruktur.poktanUnit} Kelompok Terdaftar
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Terhubung dengan penyuluh lapangan (PPL) dan penyaluran pupuk bersubsidi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">P3A (Perkumpulan Petani Pemakai Air)</div>
              <div className="text-sm font-semibold tabular-nums text-sky-800 mt-0.5">
                Sistem Tata Gilir Air Sutera Mbay
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Mengatur pembagian debit air saluran primer dan sekunder secara adil.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Pelabuhan Laut Marapokot</div>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">
                Konektivitas Logistik Antarpulau
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Gerbang pengapalan ternak sapi, biji jagung, dan bahan pokok ke luar Flores.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
