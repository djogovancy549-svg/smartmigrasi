import React from 'react';
import { KecamatanData } from '../types';
import { X, Users, Wheat, Milk, Building2, MapPin, Layers, Droplets, CheckCircle2 } from 'lucide-react';

interface DistrictDetailModalProps {
  kecamatan: KecamatanData | null;
  onClose: () => void;
  onInputForDistrict: (namaKec: string) => void;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  kecamatan,
  onClose,
  onInputForDistrict
}) => {
  if (!kecamatan) return null;

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
                Ibukota: {kecamatan.ibukota} · {kecamatan.jumlahDesa} Desa/Kelurahan
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
          
          {/* Deskripsi Wilayah */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
            {kecamatan.deskripsi}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px]">Luas Wilayah</span>
              <div className="text-base font-bold tabular-nums text-slate-900 mt-0.5">
                {kecamatan.luasHa.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Ha</span>
              </div>
              <div className="text-[10px] text-slate-400">({kecamatan.luasKm2} km²)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px]">Lahan Produktif</span>
              <div className="text-base font-bold tabular-nums text-emerald-700 mt-0.5">
                {kecamatan.lahanProduktifHa.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Ha</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">{Math.round((kecamatan.lahanProduktifHa / kecamatan.luasHa) * 100)}% dari luas</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px]">Total Penduduk</span>
              <div className="text-base font-bold tabular-nums text-slate-900 mt-0.5">
                {kecamatan.demografi.totalPenduduk.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">jiwa</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono tabular-nums">{kecamatan.demografi.kepadatanPerKm2} jiwa/km²</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px]">Kepala Keluarga</span>
              <div className="text-base font-bold tabular-nums text-slate-900 mt-0.5">
                {kecamatan.demografi.totalKK.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">KK</span>
              </div>
              <div className="text-[10px] text-slate-400">Rata-rata 4 jiwa/KK</div>
            </div>
          </div>

          {/* Sektor Peternakan Detail */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Milk className="w-4 h-4 text-emerald-700" />
                <span>Populasi & Potensi Peternakan</span>
              </div>
              <span className="text-[11px] text-slate-500">{kecamatan.ternak.sentraUtama}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Sapi</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kecamatan.ternak.sapi.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Kambing</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kecamatan.ternak.kambing.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Babi</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kecamatan.ternak.babi.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Kerbau</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kecamatan.ternak.kerbau.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Kuda</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kecamatan.ternak.kuda.toLocaleString('id-ID')}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Unggas</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">{kecamatan.ternak.unggas.toLocaleString('id-ID')}</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-600">
              <span>Estimasi Produksi Daging:</span>
              <span className="font-bold text-slate-900">{kecamatan.ternak.produksiDagingTon} Ton / Tahun</span>
            </div>
          </div>

          {/* Sektor Pertanian & Irigasi Detail */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Wheat className="w-4 h-4 text-emerald-700" />
                <span>Pertanian, Perkebunan, & Irigasi</span>
              </div>
              <span className="text-[11px] text-sky-700 font-semibold">
                Irigasi: {kecamatan.pertanian.irigasiTerlayaniHa.toLocaleString('id-ID')} Ha
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Padi Sawah</div>
                <div className="font-bold tabular-nums text-emerald-800 text-sm mt-0.5">
                  {kecamatan.pertanian.padiSawahHa.toLocaleString('id-ID')} Ha
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Produksi: {kecamatan.pertanian.padiProduksiTon.toLocaleString('id-ID')} ton
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Jagung Hibrida</div>
                <div className="font-bold tabular-nums text-amber-700 text-sm mt-0.5">
                  {kecamatan.pertanian.jagungHa.toLocaleString('id-ID')} Ha
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Produksi: {kecamatan.pertanian.jagungProduksiTon.toLocaleString('id-ID')} ton
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Hortikultura</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">
                  {kecamatan.pertanian.hortikulturaHa.toLocaleString('id-ID')} Ha
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {kecamatan.pertanian.komoditasHorti.slice(0, 2).join(', ')}
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Perkebunan</div>
                <div className="font-bold tabular-nums text-slate-900 text-sm mt-0.5">
                  {kecamatan.pertanian.perkebunanHa.toLocaleString('id-ID')} Ha
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {kecamatan.pertanian.komoditasKebun.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-700 mr-1">Komoditas Andalan:</span>
              {kecamatan.komoditasUnggulan.map((kom, i) => (
                <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
                  {kom}
                </span>
              ))}
            </div>
          </div>

          {/* Sarana Infrastruktur Kawasan */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Infrastruktur & Kelembagaan</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Panjang Jalan</div>
                <div className="font-bold tabular-nums text-slate-900 mt-0.5">{kecamatan.infrastruktur.panjangJalanKm} km</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Sekolah</div>
                <div className="font-bold tabular-nums text-slate-900 mt-0.5">{kecamatan.infrastruktur.sekolahUnit} unit</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Kesehatan</div>
                <div className="font-bold tabular-nums text-slate-900 mt-0.5">{kecamatan.infrastruktur.kesehatanUnit} unit</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Kelompok Tani</div>
                <div className="font-bold tabular-nums text-emerald-700 mt-0.5">{kecamatan.infrastruktur.poktanUnit} Poktan</div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                onClose();
                onInputForDistrict(kecamatan.nama);
              }}
              className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>+ Input Data untuk {kecamatan.nama}</span>
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
