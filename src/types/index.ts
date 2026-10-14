export type MapMode = 'satellite' | 'topography' | 'streets';

export interface DemografiData {
  totalPenduduk: number;
  totalKK: number;
  transmigranJiwa: number;
  transmigranKK: number;
  pendudukAsliJiwa: number;
  usia0_14Pct: number;
  usia15_64Pct: number;
  usia65PlusPct: number;
  pria: number;
  wanita: number;
  kepadatanPerKm2: number;
}

export interface TernakData {
  sapi: number;
  kerbau: number;
  kambing: number;
  babi: number;
  kuda: number;
  unggas: number;
  produksiDagingTon: number;
  sentraUtama: string;
}

export interface PertanianData {
  padiSawahHa: number;
  padiProduksiTon: number;
  jagungHa: number;
  jagungProduksiTon: number;
  hortikulturaHa: number;
  komoditasHorti: string[];
  perkebunanHa: number;
  komoditasKebun: string[];
  irigasiTerlayaniHa: number;
}

export interface PemanfaatanLahan {
  pertanianPct: number;
  perkebunanPct: number;
  pemukimanPct: number;
  hutanPct: number;
  lainnyaPct: number;
}

export interface InfrastrukturData {
  panjangJalanKm: number;
  luasIrigasiHa: number;
  sekolahUnit: number;
  kesehatanUnit: number;
  pasarUnit: number;
  kantorDesaUnit: number;
  poktanUnit: number;
}

export interface KecamatanData {
  id: string;
  nama: string;
  luasKm2: number;
  luasHa: number;
  lahanProduktifHa: number;
  ibukota: string;
  jumlahDesa: number;
  pusatTransmigrasi: boolean;
  uptList: string[];
  center: [number, number]; // lat, lng
  polygonCoords: [number, number][]; // lat, lng
  demografi: DemografiData;
  ternak: TernakData;
  pertanian: PertanianData;
  lahan: PemanfaatanLahan;
  infrastruktur: InfrastrukturData;
  deskripsi: string;
  komoditasUnggulan: string[];
}

export interface TransmigrasiUPT {
  id: string;
  nama: string;
  kecamatanId: string;
  kecamatanNama: string;
  tahunPenempatan: number;
  jumlahKeluarga: number;
  jumlahJiwa: number;
  luasLahanHa: number;
  komoditasUtama: string;
  koordinat: [number, number];
  statusPengembangan: 'Mandiri' | 'Berkembang' | 'Bina Lanjut';
}

export interface SheetEntry {
  id: string;
  timestamp: string;
  kecamatan: string;
  dusunUpt: string;
  kategori: 'Ternak' | 'Pertanian' | 'Kependudukan' | 'Infrastruktur' | 'Potensi Kawasan';
  jenisKomoditas: string;
  jumlahPopulasi: number;
  luasHa?: number;
  satuan: string;
  statusLahan: string;
  catatan: string;
  namaPencatat: string;
  syncedToGoogleSheet?: boolean;
}
