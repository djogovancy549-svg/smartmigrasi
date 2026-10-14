import React, { useState, useEffect } from 'react';
import { KecamatanData, SheetEntry } from './types';
import { KECAMATAN_NAGEKEO } from './data/nagekeoData';
import { getStoredRecords, saveStoredRecords, clearAllLocalRecords } from './services/googleSheetService';
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
  
  // Starts completely clean (0 data) unless user adds real entries
  const [entries, setEntries] = useState<SheetEntry[]>(() => getStoredRecords());
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync entries to localStorage
  useEffect(() => {
    saveStoredRecords(entries);
  }, [entries]);

  // 1. ADD / CREATE
  const handleAddEntry = (newEntry: SheetEntry) => {
    setEntries(prev => [newEntry, ...prev]);
  };

  // 2. UPDATE / EDIT
  const handleUpdateEntry = (updatedEntry: SheetEntry) => {
    setEntries(prev => prev.map(e => (e.id === updatedEntry.id ? updatedEntry : e)));
  };

  // 3. DELETE
  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  // 4. CLEAR ALL / KOSONGKAN
  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan semua data pendataan di web?')) {
      setEntries([]);
      clearAllLocalRecords();
    }
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
          onOpenInputModal={() => setIsInputModalOpen(true)}
          entries={entries}
        />

        {/* Data Utama Kawasan */}
        <DataUtamaKawasan entries={entries} />

        {/* Interactive Leaflet Map (3 modes: Satelit, Topografi, Jalan) */}
        <InteractiveMap
          onSelectKecamatan={setSelectedKecamatan}
          selectedKecamatan={selectedKecamatan}
          onOpenDetailModal={setModalKecamatan}
          onOpenInputForDistrict={handleOpenInputForDistrict}
          entries={entries}
        />

        {/* Komoditas Unggulan */}
        <KomoditasUnggulan />

        {/* Infrastruktur Kawasan */}
        <InfrastrukturKawasan />

        {/* Admin Sheet Panel & Webhook Sync (Full CRUD: Insert, Edit, Delete) */}
        <AdminSheetPanel
          entries={entries}
          onAddEntry={handleAddEntry}
          onUpdateEntry={handleUpdateEntry}
          onDeleteEntry={handleDeleteEntry}
          onClearAll={handleClearAll}
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
        entries={entries}
      />

      {/* Footer Banner */}
      <FooterBanner
        onScrollToTop={handleScrollToTop}
        onOpenInputModal={() => setIsInputModalOpen(true)}
      />
    </div>
  );
}
