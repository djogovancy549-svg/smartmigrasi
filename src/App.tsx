import React, { useState, useEffect } from 'react';
import { KecamatanData, SheetEntry } from './types';
import { KECAMATAN_NAGEKEO, INITIAL_SHEET_DATA } from './data/nagekeoData';
import { getStoredRecords, saveStoredRecords } from './services/googleSheetService';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DataUtamaKawasan } from './components/DataUtamaKawasan';
import { InteractiveMap } from './components/InteractiveMap';
import { KomoditasUnggulan } from './components/KomoditasUnggulan';
import { InfrastrukturKawasan } from './components/InfrastrukturKawasan';
import { AdminSheetPanel } from './components/AdminSheetPanel';
import { DistrictDetailModal } from './components/DistrictDetailModal';
import { FooterBanner } from './components/FooterBanner';

export default function App() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<KecamatanData>(KECAMATAN_NAGEKEO[0]);
  const [modalKecamatan, setModalKecamatan] = useState<KecamatanData | null>(null);
  const [entries, setEntries] = useState<SheetEntry[]>(() => getStoredRecords(INITIAL_SHEET_DATA));
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveStoredRecords(entries);
  }, [entries]);

  const handleAddEntry = (newEntry: SheetEntry) => {
    setEntries(prev => [newEntry, ...prev]);
  };

  const handleScrollToMap = () => {
    const el = document.getElementById('peta-kawasan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToData = () => {
    const el = document.getElementById('data-utama');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInputForDistrict = (namaKec: string) => {
    const matched = KECAMATAN_NAGEKEO.find(k => k.nama.toLowerCase() === namaKec.toLowerCase());
    if (matched) {
      setSelectedKecamatan(matched);
    }
    setIsInputModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        onOpenInputModal={() => setIsInputModalOpen(true)}
        onOpenSheetSettings={() => setIsSettingsOpen(true)}
        syncCount={entries.length}
      />

      {/* Main Content Layout */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onScrollToMap={handleScrollToMap}
          onScrollToData={handleScrollToData}
        />

        {/* Data Utama Kawasan */}
        <DataUtamaKawasan />

        {/* Interactive Leaflet Map (3 modes: Satelit, Topografi, Jalan) */}
        <InteractiveMap
          onSelectKecamatan={setSelectedKecamatan}
          selectedKecamatan={selectedKecamatan}
          onOpenDetailModal={setModalKecamatan}
        />

        {/* Komoditas Unggulan */}
        <KomoditasUnggulan />

        {/* Infrastruktur Kawasan */}
        <InfrastrukturKawasan />

        {/* Admin Sheet Panel & Webhook Sync */}
        <AdminSheetPanel
          entries={entries}
          onAddEntry={handleAddEntry}
          isInputModalOpen={isInputModalOpen}
          setIsInputModalOpen={setIsInputModalOpen}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </main>

      {/* District Detail Modal */}
      <DistrictDetailModal
        kecamatan={modalKecamatan}
        onClose={() => setModalKecamatan(null)}
        onInputForDistrict={handleOpenInputForDistrict}
      />

      {/* Footer Banner */}
      <FooterBanner
        onScrollToTop={handleScrollToTop}
        onOpenInputModal={() => setIsInputModalOpen(true)}
      />
    </div>
  );
}
