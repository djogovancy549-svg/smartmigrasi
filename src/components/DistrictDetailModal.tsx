import React from 'react';
import { KecamatanData, SheetEntry } from '../types';
import { X, Users, Wheat, Milk, Building2, MapPin, Layers, Droplets, CheckCircle2, Plus } from 'lucide-react';

interface DistrictDetailModalProps {
  kecamatan: KecamatanData | null;
  onClose: () => void;
  onInputForDistrict: (namaKec: string) => void;
  entries: SheetEntry[];
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  kecamatan,
  onClose,
  onInputForDistrict,
  entries
}) => {
  if (!kecamatan) return null;

  const districtEntries = entries.filter(
    (e) => (e.kecamatan || '').toLowerCase() === kecamatan.nama.toLowerCase()
  );

  const totalPenduduk = districtEntries
    .filter((e) => e.kategori === 'Kependudukan')
    .reduce((sum, e) => sum + (e.jumlahPopulasi || 0), 0);

  const totalKK = districtEntries
    .filter((e) => e.kategori === 'Kependudukan' && (e.satuan || '').toLowerCase().includes('kk'))
    .reduce((sum, e) => sum + (e.jumlahPopulasi || 0), 0);

  const totalLahanHa = districtEntries.reduce((sum, e) => sum + (e.luasHa || 0), 0);

  const countAnimal = (kw: string) => {
    return districtEntries
      .filter((e) => e.kategori === 'Ternak' && (e.jenisKomoditas || '').toLowerCase().includes(kw))
      .reduce((sum, e) => sum + (e.jumlahPopulasi || 0), 0);
  };

  const sapi = countAnimal('sapi');
  const kambing = countAnimal('kambing');
  const babi = countAnimal('babi');
  const kerbau = countAnimal('kerbau');
  const kuda = countAnimal('kuda');
  const unggas = countAnimal('unggas') + countAnimal('ayam') + countAnimal('bebek');

  const padiHa = districtEntries
    .filter((e) => e.kategori === 'Pertanian' && (e.jenisKomoditas || '').toLowerCase().includes('padi'))
    .reduce((sum, e) => sum + (e.luasHa || 0), 0);

  const jagungHa = districtEntries
    .filter((e) => e.kategori === 'Pertanian' && (e.jenisKomoditas || '').toLowerCase().includes('jagung'))
    .reduce((sum, e) => sum + (e.luasHa || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Kecamatan {kecamatan.nama}
                </h3>
                {kecamatan.pusatTransmigrasi && (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded uppercase">
                    Pusat Transmigrasi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Ibukota: {kecamatan.ibukota} · Luas Geografis: {kecamatan.luasKm2} km² · {districtEntries.length} Data Terdata
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          
          {/* Quick Stats Grid from live entries */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px]">Luas Lahan Terdata</span>
              <div className="text-base font-bold tabular-nums text-slate-900 mt-0.5">
                {totalLahanHa.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Ha</span>
              </div>
              <div className="text-[10px] text-slate-400">{totalLahanHa > 0 ? 'Terekam di sistem' : 'Belum ada input'}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px]">Penduduk Terdata</span>
              <div className="text-base font-bold tabular-nums text-slate-900 mt-0.5">
                {totalPenduduk.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">jiwa</span>
              </div>
              <div className="text-[10px] text-slate-400">{totalPenduduk > 0 ? 'Terekam di sistem' : 'Belum ada input'}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px]">Kepala Keluarga</span>
              <div className="text-base font-bold tabular-nums text-slate-900 mt-0.5">
                {totalKK.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">KK</span>
              </div>
              <div className="text-[10px] text-slate-400">{totalKK > 0 ? 'Terekam di sistem' : 'Belum ada input'}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px]">Catatan Lapangan</span>
              <div className="text-base font-bold tabular-nums text-emerald-700 mt-0.5">
                {districtEntries.length} <span className="text-xs font-normal text-slate-500">entri</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">Tersinkron Sheet</div>
            </div>
          </div>

          {/* Sektor Peternakan Terdata */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Milk className="w-4 h-4 text-emerald-700" />
                <span>Populasi Peternakan Terdata (Kec. {kecamatan.nama})</span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Sapi</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{sapi.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Kambing</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kambing.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Babi</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{babi.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Kerbau</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kerbau.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Kuda</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kuda.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Unggas</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{unggas.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>

          {/* Sektor Pertanian Terdata */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Wheat className="w-4 h-4 text-emerald-700" />
                <span>Pertanian & Tanaman Pangan Terdata</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Padi Sawah Terdata</div>
                <div className="font-bold tabular-nums text-emerald-800 text-sm mt-0.5">
                  {padiHa.toLocaleString('id-ID')} Ha
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Jagung Terdata</div>
                <div className="font-bold tabular-nums text-amber-700 text-sm mt-0.5">
                  {jagungHa.toLocaleString('id-ID')} Ha
                </div>
              </div>
            </div>
          </div>

          {/* Daftar Catatan Riil */}
          {districtEntries.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="font-bold text-slate-900 text-sm mb-2">
                Rincian Catatan Lapangan Terverifikasi:
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {districtEntries.map((row) => (
                  <div key={row.id} className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-800">{row.jenisKomoditas}</span>
                      <span className="text-slate-500 ml-1.5">({row.dusunUpt || row.kategori})</span>
                    </div>
                    <div className="font-mono font-bold text-emerald-800">
                      {row.jumlahPopulasi} {row.satuan}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                onClose();
                onInputForDistrict(kecamatan.nama);
              }}
              className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Data untuk {kecamatan.nama}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
