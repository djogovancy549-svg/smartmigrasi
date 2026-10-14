import React, { useState } from 'react';
import { ArrowRight, Check, X, Sprout, TrendingUp, Sparkles } from 'lucide-react';

interface CommodityModalData {
  title: string;
  category: string;
  image: string;
  description: string;
  keyStats: { label: string; value: string }[];
  districts: string[];
  potensiEkspor: string;
}

export const KomoditasUnggulan: React.FC = () => {
  const [activeModal, setActiveModal] = useState<CommodityModalData | null>(null);

  const commodities: CommodityModalData[] = [
    {
      title: 'Jagung Hibrida',
      category: 'Tanaman Pangan Utama',
      image: '/src/assets/images/komoditas_jagung_mbay_1791964150945.jpg',
      description: 'Komoditas utama dengan produktivitas tinggi di kawasan transmigrasi Mbay, Wolowae, dan Nangaroro. Menjadi pilar program TJPS (Tanam Jagung Panen Sapi) dengan hasil panen mencapai 5.5 - 7.0 ton/ha pipilan kering.',
      keyStats: [
        { label: 'Luas Lahan Total', value: '14.470 Hektare' },
        { label: 'Estimasi Produksi', value: '62.260 Ton / Tahun' },
        { label: 'Rata-rata Hasil', value: '5.8 Ton / Ha' },
        { label: 'Varietas Utama', value: 'BISI-18, Pioneer 35, NK-212' }
      ],
      districts: ['Aesesa (Mbay)', 'Wolowae', 'Nangaroro', 'Boawae', 'Aesesa Selatan'],
      potensiEkspor: 'Memenuhi kebutuhan pakan ternak regional NTT dan industri pakan di Jawa Timur.'
    },
    {
      title: 'Padi Sawah Irigasi Sutera',
      category: 'Lumbung Pangan Daerah',
      image: '/src/assets/images/komoditas_padi_sutera_1791964151091.jpg',
      description: 'Mendukung ketahanan pangan kawasan NTT melalui Daerah Irigasi (D.I.) Sutera Mbay seluas 3.850 Ha. Memungkinkan pola tanam padi-padi-palawija 2 hingga 3 kali dalam setahun dengan ketersediaan air terjamin dari Sungai Aesesa.',
      keyStats: [
        { label: 'Luas Sawah Irigasi', value: '4.120 Hektare' },
        { label: 'Estimasi Produksi', value: '52.620 Ton GKG / Tahun' },
        { label: 'Indeks Pertanaman', value: 'IP 220% - 250%' },
        { label: 'Varietas Populer', value: 'Ciherang, Inpari 32, Mekongga' }
      ],
      districts: ['Aesesa (Mbay Kiri & Kanan)', 'Aesesa Selatan', 'Boawae', 'Nangaroro'],
      potensiEkspor: 'Pemasok beras premium untuk Kabupaten Ende, Ngada, Manggarai Timur hingga Labuan Bajo.'
    },
    {
      title: 'Peternakan Ternak Besar & Kecil',
      category: 'Peternakan & Savana',
      image: '/src/assets/images/peternakan_sapi_nagekeo_1791964151818.jpg',
      description: 'Kawasan savana yang luas menjadikannya lumbung ternak sapi potong (Bali & Brahman Cross), sentra kambing kacang di Wolowae & Danga, serta babi ras unggul di Boawae dan Mauponggo.',
      keyStats: [
        { label: 'Populasi Sapi', value: '52.250 Ekor' },
        { label: 'Populasi Kambing', value: '74.100 Ekor' },
        { label: 'Populasi Babi', value: '73.000 Ekor' },
        { label: 'Produksi Daging', value: '3.625 Ton / Tahun' }
      ],
      districts: ['Aesesa (Danga & Savana)', 'Wolowae', 'Boawae', 'Nangaroro', 'Mauponggo'],
      potensiEkspor: 'Pengiriman sapi hidup antarpulau ke Kalimantan Timur dan Pulau Jawa melalui Pelabuhan Marapokot.'
    },
    {
      title: 'Hortikultura & Perkebunan',
      category: 'Sayuran & Rempah',
      image: '/src/assets/images/hortikultura_nagekeo_1791964151891.jpg',
      description: 'Bawang merah tajuk Mbay yang terkenal kering dan awet, cabai rawit super pedas, semangka manis Marapokot, serta komoditas perkebunan bernilai tinggi seperti cengkeh wangi, pala, kakao, dan kopi Robusta Boawae.',
      keyStats: [
        { label: 'Bawang Merah Mbay', value: '380 Ha (Produksi 3.420 Ton)' },
        { label: 'Cabai & Tomat', value: '750 Ha' },
        { label: 'Cengkeh & Pala', value: '3.620 Ha (Mauponggo/Keo)' },
        { label: 'Kopi Robusta', value: '1.120 Ha (Boawae)' }
      ],
      districts: ['Aesesa (Aeramo & Mbay)', 'Boawae', 'Mauponggo', 'Keo Tengah'],
      potensiEkspor: 'Bawang merah Mbay memasok pasar lokal NTT, Flores, dan Timor Barat.'
    }
  ];

  return (
    <section id="komoditas" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Potensi Unggulan Daerah</span>
              <span>·</span>
              <span>Kawasan Transmigrasi Mbay & Nagekeo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Komoditas Unggulan Kawasan
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Produk pertanian, perkebunan, dan peternakan andalan yang dikembangkan oleh petani transmigran dan masyarakat lokal berdaya saing tinggi.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid matching flyer style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commodities.map((item, idx) => (
            <div
              key={idx}
              className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-600 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-slate-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setActiveModal(item)}
                  className="w-full py-2 px-3 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Lihat Detail & Data</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Commodity Detail */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
              
              <div className="relative h-48 bg-slate-100">
                <img
                  src={activeModal.image}
                  alt={activeModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-xs uppercase font-medium tracking-wide text-emerald-200">{activeModal.category}</div>
                  <h3 className="text-xl font-bold">{activeModal.title}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeModal.description}
                </p>

                {/* Quantitative statistics */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                    Indikator Produksi & Capaian
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {activeModal.keyStats.map((stat, i) => (
                      <div key={i} className="text-xs">
                        <div className="text-slate-500 text-[11px]">{stat.label}</div>
                        <div className="font-bold tabular-nums text-slate-900 mt-0.5">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sentra Kecamatan */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-1.5">Wilayah Sentra Utama:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModal.districts.map((d, i) => (
                      <span key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Potensi Pasar */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <strong>Jangkauan Distribusi & Pasar:</strong> {activeModal.potensiEkspor}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
