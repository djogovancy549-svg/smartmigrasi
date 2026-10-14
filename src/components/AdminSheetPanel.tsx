import React, { useState } from 'react';
import { SheetEntry } from '../types';
import {
  FileSpreadsheet,
  Plus,
  Send,
  Download,
  CheckCircle2,
  AlertCircle,
  Settings,
  Search,
  Filter,
  RefreshCw,
  Copy,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import {
  sendEntryToGoogleSheet,
  getWebhookUrl,
  setWebhookUrl,
  getSheetViewUrl,
  setSheetViewUrl,
  exportToCSV,
  getGoogleAppsScriptTemplate
} from '../services/googleSheetService';
import { KECAMATAN_NAGEKEO } from '../data/nagekeoData';

interface AdminSheetPanelProps {
  entries: SheetEntry[];
  onAddEntry: (entry: SheetEntry) => void;
  isInputModalOpen: boolean;
  setIsInputModalOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

export const AdminSheetPanel: React.FC<AdminSheetPanelProps> = ({
  entries,
  onAddEntry,
  isInputModalOpen,
  setIsInputModalOpen,
  isSettingsOpen,
  setIsSettingsOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [kecamatanFilter, setKecamatanFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [currentWebhookUrl, setCurrentWebhookUrl] = useState(getWebhookUrl());
  const [currentSheetUrl, setCurrentSheetUrl] = useState(getSheetViewUrl());
  const [copiedScript, setCopiedScript] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<SheetEntry, 'id' | 'timestamp' | 'syncedToGoogleSheet'>>({
    kecamatan: 'Aesesa',
    dusunUpt: 'UPT Mbay Kiri',
    kategori: 'Ternak',
    jenisKomoditas: 'Sapi Bali',
    jumlahPopulasi: 150,
    luasHa: 25,
    satuan: 'Ekor',
    statusLahan: 'Produktif',
    catatan: 'Pendataan lapangan terkini',
    namaPencatat: 'PPL Pertanian / Peternakan'
  });

  // Filtered rows
  const filteredEntries = entries.filter((row) => {
    const matchSearch =
      row.jenisKomoditas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.dusunUpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.namaPencatat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = categoryFilter === 'all' || row.kategori === categoryFilter;
    const matchKecamatan = kecamatanFilter === 'all' || row.kecamatan === kecamatanFilter;

    return matchSearch && matchCategory && matchKecamatan;
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitFeedback(null);

    const newRecord: SheetEntry = {
      ...formData,
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      syncedToGoogleSheet: false
    };

    try {
      const res = await sendEntryToGoogleSheet(newRecord);
      newRecord.syncedToGoogleSheet = res.success;
      onAddEntry(newRecord);

      setSubmitFeedback({
        type: 'success',
        message: res.message
      });

      // Reset form modal after brief delay
      setTimeout(() => {
        setIsInputModalOpen(false);
        setSubmitFeedback(null);
      }, 1400);
    } catch {
      newRecord.syncedToGoogleSheet = false;
      onAddEntry(newRecord);
      setSubmitFeedback({
        type: 'error',
        message: 'Tersimpan lokal, koneksi webhook mengalami kendala.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSettings = () => {
    setWebhookUrl(currentWebhookUrl);
    setSheetViewUrl(currentSheetUrl);
    setIsSettingsOpen(false);
  };

  const handleCopyAppsScript = () => {
    navigator.clipboard.writeText(getGoogleAppsScriptTemplate());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleTestConnection = async () => {
    setTestStatus('Menguji koneksi webhook...');
    try {
      const testRecord: SheetEntry = {
        id: `test-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        kecamatan: 'Aesesa',
        dusunUpt: 'Uji Koneksi Sistem',
        kategori: 'Potensi Kawasan',
        jenisKomoditas: 'Ping Uji Coba',
        jumlahPopulasi: 1,
        luasHa: 1,
        satuan: 'Test',
        statusLahan: 'Uji Coba',
        catatan: 'Validasi endpoint Google Apps Script',
        namaPencatat: 'System Tester'
      };
      const res = await sendEntryToGoogleSheet(testRecord, currentWebhookUrl);
      if (res.success) {
        setTestStatus('✓ Webhook terhubung! ' + res.message);
      } else {
        setTestStatus('✕ Respons error: ' + res.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung';
      setTestStatus('✕ Gagal menghubungi webhook: ' + msg);
    }
  };

  return (
    <section id="kelola-data" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 mb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Integrasi Backend Google Sheet</span>
              <span>·</span>
              <span>Database Terpusat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Kelola & Sinkronisasi Data Lapangan
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Catatan komoditas pertanian, peternakan, demografi, dan status lahan terhubung langsung dengan Webhook Google Worksheet secara instan.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Konfigurasi Webhook</span>
            </button>

            <button
              onClick={() => exportToCSV(entries)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>

            <button
              onClick={() => setIsInputModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Input Data Baru</span>
            </button>
          </div>
        </div>

        {/* Webhook Status Info Strip */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">
                Status Koneksi Google Worksheet
              </div>
              <div className="text-slate-500 font-mono text-[11px] truncate max-w-md">
                URL Webhook: {getWebhookUrl()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{entries.length} Data Tersedia</span>
            </span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline text-xs"
            >
              Ubah URL Sheet
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari komoditas, kecamatan, UPT, atau petugas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-800"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-800"
            >
              <option value="all">Semua Kategori (Ternak, Tani, Penduduk)</option>
              <option value="Ternak">Ternak</option>
              <option value="Pertanian">Pertanian</option>
              <option value="Kependudukan">Kependudukan</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Potensi Kawasan">Potensi Kawasan</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={kecamatanFilter}
              onChange={(e) => setKecamatanFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-800"
            >
              <option value="all">Semua 7 Kecamatan</option>
              {KECAMATAN_NAGEKEO.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* High-Density Data Grid matching SaaS reference */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Kecamatan</th>
                <th className="py-2.5 px-3">Dusun / UPT</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Komoditas / Indikator</th>
                <th className="py-2.5 px-3 text-right">Populasi</th>
                <th className="py-2.5 px-3 text-right">Luas (Ha)</th>
                <th className="py-2.5 px-3">Status Lahan</th>
                <th className="py-2.5 px-3">Petugas</th>
                <th className="py-2.5 px-3 text-center">Sync Sheet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    Tidak ada data yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 tabular-nums text-slate-500 text-[11px] whitespace-nowrap">
                      {row.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {row.kecamatan}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {row.dusunUpt}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          row.kategori === 'Ternak'
                            ? 'bg-amber-100 text-amber-900'
                            : row.kategori === 'Pertanian'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-sky-100 text-sky-900'
                        }`}
                      >
                        {row.kategori}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {row.jenisKomoditas}
                      {row.catatan && (
                        <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                          {row.catatan}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap">
                      {row.jumlahPopulasi.toLocaleString('id-ID')}{' '}
                      <span className="text-[10px] text-slate-500">{row.satuan}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {row.luasHa ? `${row.luasHa.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] whitespace-nowrap">
                      {row.statusLahan}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] whitespace-nowrap">
                      {row.namaPencatat}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Tersinkron</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal: Input Data Lapangan Baru */}
        {isInputModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Input Data Pendataan Kawasan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kirim langsung ke Google Sheet & sinkronkan basis data
                  </p>
                </div>
                <button
                  onClick={() => setIsInputModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              {submitFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${
                    submitFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {submitFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{submitFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                
                {/* Kecamatan */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Kecamatan</label>
                    <select
                      value={formData.kecamatan}
                      onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    >
                      {KECAMATAN_NAGEKEO.map((k) => (
                        <option key={k.id} value={k.nama}>
                          {k.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Dusun / Lokasi UPT</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: UPT Mbay Kanan Dusun 3"
                      value={formData.dusunUpt}
                      onChange={(e) => setFormData({ ...formData, dusunUpt: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Kategori & Jenis Komoditas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Kategori</label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => {
                        const kat = e.target.value as SheetEntry['kategori'];
                        setFormData({
                          ...formData,
                          kategori: kat,
                          satuan: kat === 'Ternak' ? 'Ekor' : kat === 'Pertanian' ? 'Hektare' : 'Jiwa'
                        });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="Ternak">Ternak (Sapi, Kambing, Babi, dll)</option>
                      <option value="Pertanian">Pertanian (Padi, Jagung, Bawang, dll)</option>
                      <option value="Kependudukan">Kependudukan (Transmigran, KK)</option>
                      <option value="Infrastruktur">Infrastruktur (Irigasi, Jalan)</option>
                      <option value="Potensi Kawasan">Potensi Kawasan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Komoditas / Nama Data</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Sapi Bali, Padi Sutera"
                      value={formData.jenisKomoditas}
                      onChange={(e) => setFormData({ ...formData, jenisKomoditas: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Populasi, Luas Ha, Satuan */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Jumlah Populasi</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.jumlahPopulasi}
                      onChange={(e) => setFormData({ ...formData, jumlahPopulasi: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono tabular-nums focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Luas Lahan (Ha)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.luasHa}
                      onChange={(e) => setFormData({ ...formData, luasHa: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono tabular-nums focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Satuan</label>
                    <input
                      type="text"
                      value={formData.satuan}
                      onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                      placeholder="Ekor / Ha / Jiwa / Ton"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Status Lahan & Petugas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Status Lahan / Hak Milik</label>
                    <input
                      type="text"
                      placeholder="Produktif / SHM Trans / Hak Ulayat"
                      value={formData.statusLahan}
                      onChange={(e) => setFormData({ ...formData, statusLahan: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nama Petugas Lapangan</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama PPL / Petugas"
                      value={formData.namaPencatat}
                      onChange={(e) => setFormData({ ...formData, namaPencatat: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Catatan Lapangan */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Catatan Tambahan</label>
                  <textarea
                    rows={2}
                    placeholder="Kondisi pengairan, varietas bibit, program vaksinasi ternak, dll."
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Buttons */}
                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsInputModalOpen(false)}
                    className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengirim ke Sheet...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim & Simpan Data</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Modal: Google Sheet Settings & Apps Script Guide */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Konfigurasi Google Sheet & Webhook
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atur URL Webhook Google Apps Script untuk pengiriman otomatis
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                
                <div>
                  <label className="block font-medium text-slate-800 mb-1">
                    URL Webhook Google Apps Script (Exec URL):
                  </label>
                  <input
                    type="url"
                    value={currentWebhookUrl}
                    onChange={(e) => setCurrentWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    URL Webhook ini tertanam dan dapat diganti ke spreadsheet dinas/instansi Anda kapan saja.
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-800 mb-1">
                    Tautan Google Spreadsheet (Tampilan Web):
                  </label>
                  <input
                    type="url"
                    value={currentSheetUrl}
                    onChange={(e) => setCurrentSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Connection Test Box */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">Uji Koneksi Webhook</span>
                    {testStatus && (
                      <div className="text-[11px] font-mono text-emerald-700 mt-0.5">
                        {testStatus}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleTestConnection}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-md font-semibold text-slate-700"
                  >
                    Test Ping
                  </button>
                </div>

                {/* Google Apps Script code snippet guide */}
                <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      Script Google Apps Script (doPost / doGet)
                    </span>
                    <button
                      onClick={handleCopyAppsScript}
                      className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-white rounded flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedScript ? 'Tersalin!' : 'Salin Kode Script'}</span>
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono overflow-x-auto p-2 bg-black/40 rounded max-h-36 text-slate-300">
                    {getGoogleAppsScriptTemplate()}
                  </pre>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    <strong>Cara pasang:</strong> Buka Google Sheet &rarr; Klik <em>Extensions</em> &rarr; <em>Apps Script</em> &rarr; Tempel kode di atas &rarr; Klik <em>Deploy as Web App</em> &rarr; Atur akses "Anyone" &rarr; Salin URL exec ke kotak di atas!
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                  >
                    Simpan Konfigurasi
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
