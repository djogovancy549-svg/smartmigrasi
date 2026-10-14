import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { KecamatanData, MapMode, TransmigrasiUPT } from '../types';
import { KECAMATAN_NAGEKEO, TRANSMIGRASI_UPT_LIST } from '../data/nagekeoData';
import { Layers, MapPin, Maximize2, Compass, Wheat, Milk, Users, Building, Info } from 'lucide-react';

interface InteractiveMapProps {
  onSelectKecamatan: (k: KecamatanData) => void;
  selectedKecamatan: KecamatanData;
  onOpenDetailModal: (k: KecamatanData) => void;
}

const TILE_LAYERS: Record<MapMode, { url: string; attribution: string; name: string }> = {
  streets: {
    name: 'Peta Jalan',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor'
  },
  satellite: {
    name: 'Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Sumber: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, dan Komunitas GIS'
  },
  topography: {
    name: 'Topografi',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Peta: &copy; OpenTopoMap (CC-BY-SA)'
  }
};

const COLOR_PALETTE: Record<string, string> = {
  'aesesa': '#15803d', // Hijau tua irigasi
  'aesesa-selatan': '#16a34a', // Hijau subur
  'boawae': '#b45309', // Coklat gunung vulkanik
  'mauponggo': '#0d9488', // Teal pesisir rempah
  'nangaroro': '#ea580c', // Oranye savana
  'keo-tengah': '#0284c7', // Biru pesisir
  'wolowae': '#ca8a04' // Emas jambu mete
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectKecamatan,
  selectedKecamatan,
  onOpenDetailModal
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonLayersRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [mapMode, setMapMode] = useState<MapMode>('streets');
  const [filterLayer, setFilterLayer] = useState<'all' | 'pertanian' | 'ternak' | 'upt'>('all');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-8.6700, 121.2900],
      zoom: 10,
      zoomControl: false,
      scrollWheelZoom: true,
      minZoom: 9,
      maxZoom: 18
    });

    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Initial tile layer
    const activeTileConfig = TILE_LAYERS[mapMode];
    const initialTile = L.tileLayer(activeTileConfig.url, {
      attribution: activeTileConfig.attribution,
      maxZoom: 18
    }).addTo(map);

    tileLayerRef.current = initialTile;
    geojsonLayersRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Mode switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = TILE_LAYERS[mapMode];
    const newTile = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 18
    }).addTo(map);

    tileLayerRef.current = newTile;
  }, [mapMode]);

  // Render Polygons and Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !geojsonLayersRef.current || !markersLayerRef.current) return;

    geojsonLayersRef.current.clearLayers();
    markersLayerRef.current.clearLayers();

    // 1. Draw Kecamatan polygons
    KECAMATAN_NAGEKEO.forEach((kec) => {
      const isSelected = selectedKecamatan.id === kec.id;
      const baseColor = COLOR_PALETTE[kec.id] || '#15803d';

      const polygon = L.polygon(kec.polygonCoords, {
        color: isSelected ? '#111827' : baseColor,
        weight: isSelected ? 3.5 : 1.8,
        fillColor: baseColor,
        fillOpacity: isSelected ? 0.55 : 0.28,
        dashArray: isSelected ? '' : '2'
      });

      polygon.on('click', () => {
        onSelectKecamatan(kec);
      });

      polygon.on('mouseover', function () {
        if (!isSelected) {
          polygon.setStyle({ fillOpacity: 0.45, weight: 2.5 });
        }
      });

      polygon.on('mouseout', function () {
        if (!isSelected) {
          polygon.setStyle({ fillOpacity: 0.28, weight: 1.8 });
        }
      });

      polygon.bindTooltip(
        `<div class="text-xs font-semibold px-1 py-0.5">${kec.nama}</div><div class="text-[11px] text-slate-500">${kec.luasHa.toLocaleString('id-ID')} Ha · ${kec.demografi.totalPenduduk.toLocaleString('id-ID')} jiwa</div>`,
        { permanent: false, direction: 'center', className: 'map-tooltip' }
      );

      geojsonLayersRef.current?.addLayer(polygon);

      // Centroid Label Marker
      const centerIcon = L.divIcon({
        className: 'custom-district-marker',
        html: `
          <div class="flex items-center gap-1.5 px-2 py-1 bg-white/95 backdrop-blur-xs border ${isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-300'} rounded-lg shadow-sm whitespace-nowrap text-xs font-bold text-slate-800 transition-transform hover:scale-105">
            <span class="w-2 h-2 rounded-full" style="background-color: ${baseColor}"></span>
            <span>${kec.nama}</span>
          </div>
        `,
        iconSize: [100, 24],
        iconAnchor: [50, 12]
      });

      const centerMarker = L.marker(kec.center, { icon: centerIcon });
      centerMarker.on('click', () => onSelectKecamatan(kec));
      markersLayerRef.current?.addLayer(centerMarker);
    });

    // 2. Transmigration UPT Markers (if filter allows)
    if (filterLayer === 'all' || filterLayer === 'upt') {
      TRANSMIGRASI_UPT_LIST.forEach((upt) => {
        const uptIcon = L.divIcon({
          className: 'custom-upt-marker',
          html: `
            <div class="group relative flex items-center justify-center w-7 h-7 bg-emerald-600 text-white rounded-full shadow-md border-2 border-white hover:scale-110 transition-transform">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const uptMarker = L.marker(upt.koordinat, { icon: uptIcon });
        uptMarker.bindPopup(`
          <div class="p-1 space-y-1.5 max-w-xs">
            <div class="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Kawasan Transmigrasi</div>
            <div class="font-bold text-sm text-slate-900 leading-tight">${upt.nama}</div>
            <div class="text-xs text-slate-600">Kecamatan: <span class="font-medium text-slate-800">${upt.kecamatanNama}</span></div>
            <div class="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div><span class="text-slate-500">Warga:</span> <span class="font-bold tabular-nums text-slate-800">${upt.jumlahJiwa} jiwa</span></div>
              <div><span class="text-slate-500">Keluarga:</span> <span class="font-bold tabular-nums text-slate-800">${upt.jumlahKeluarga} KK</span></div>
              <div class="col-span-2"><span class="text-slate-500">Lahan:</span> <span class="font-bold tabular-nums text-slate-800">${upt.luasLahanHa} Ha</span></div>
            </div>
            <div class="text-[11px] text-slate-600"><strong>Komoditas:</strong> ${upt.komoditasUtama}</div>
          </div>
        `);
        markersLayerRef.current?.addLayer(uptMarker);
      });
    }

  }, [selectedKecamatan, filterLayer]);

  const resetView = () => {
    mapInstanceRef.current?.setView([-8.6700, 121.2900], 10);
  };

  const focusDistrict = (kec: KecamatanData) => {
    onSelectKecamatan(kec);
    mapInstanceRef.current?.flyTo(kec.center, 11, { duration: 0.8 });
  };

  return (
    <section id="peta-kawasan" className="py-8 border-b border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Sistem Informasi Geospasial</span>
              <span>·</span>
              <span>Kabupaten Nagekeo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Peta Interaktif Kawasan Transmigrasi & Potensi
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Visualisasi geospasial sebaran 7 kecamatan, jaringan irigasi Sutera Mbay, sentra peternakan, pertanian, dan UPT penempatan transmigran.
            </p>
          </div>

          {/* Map Mode Buttons (Satelit, Topografi, Jalan) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setMapMode('streets')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                mapMode === 'streets'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Jalan
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                mapMode === 'satellite'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Satelit
            </button>
            <button
              onClick={() => setMapMode('topography')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                mapMode === 'topography'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Topografi
            </button>
          </div>
        </div>

        {/* Filter Bars & Quick Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Kecamatan:</span>
            {KECAMATAN_NAGEKEO.map((kec) => (
              <button
                key={kec.id}
                onClick={() => focusDistrict(kec)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedKecamatan.id === kec.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {kec.nama}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setFilterLayer('all')}
                className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${filterLayer === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Semua Layer
              </button>
              <button
                onClick={() => setFilterLayer('upt')}
                className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${filterLayer === 'upt' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600'}`}
              >
                Titik UPT Trans
              </button>
            </div>

            <button
              onClick={resetView}
              title="Reset pandangan peta"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Geospatial Grid (Map on Left, Detail Panels on Right like flyer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Map Viewport Container */}
          <div className="lg:col-span-8 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs relative">
            <div
              ref={mapContainerRef}
              className="w-full h-[520px] sm:h-[580px] z-10"
              style={{ minHeight: '520px' }}
            />

            {/* Map Floating Legend (bottom left inside map) */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md text-xs max-w-[210px] pointer-events-auto">
              <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                <span>Legenda Wilayah</span>
                <Compass className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#15803d]"></span>
                  <span>Aesesa (Pusat Mbay)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#b45309]"></span>
                  <span>Boawae (Lereng Ebulobo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#0d9488]"></span>
                  <span>Mauponggo (Pesisir Rempah)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#ea580c]"></span>
                  <span>Nangaroro (Savana Ternak)</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] font-bold">U</span>
                  <span>Titik Pemukiman UPT</span>
                </div>
              </div>
            </div>

            {/* Top Right Map Overlay Quick Tip */}
            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 shadow-xs hidden sm:block">
              Klik wilayah pada peta untuk melihat profil detail
            </div>
          </div>

          {/* Right Sidebar: Jelajahi Kawasan + Demografi + Pemanfaatan Lahan (matching poster) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Jelajahi Kawasan Card */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Jelajahi Kawasan
                </div>
                <span className="text-xs text-slate-500">7 Kecamatan Nagekeo</span>
              </div>

              <div className="mb-3">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Kecamatan {selectedKecamatan.nama}</span>
                  {selectedKecamatan.pusatTransmigrasi && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold uppercase">
                      Pusat Mbay
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {selectedKecamatan.deskripsi}
                </p>
              </div>

              {/* Numerical Attributes Strip */}
              <div className="grid grid-cols-2 gap-2.5 mb-4 bg-white p-3 rounded-lg border border-slate-200/80">
                <div>
                  <div className="text-[11px] text-slate-500">Jumlah Penduduk</div>
                  <div className="text-base font-bold tabular-nums text-slate-900">
                    {selectedKecamatan.demografi.totalPenduduk.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-500">jiwa</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Kepala Keluarga</div>
                  <div className="text-base font-bold tabular-nums text-slate-900">
                    {selectedKecamatan.demografi.totalKK.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-500">KK</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Luas Wilayah</div>
                  <div className="text-base font-bold tabular-nums text-slate-900">
                    {selectedKecamatan.luasHa.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-500">Ha</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Lahan Produktif</div>
                  <div className="text-base font-bold tabular-nums text-emerald-700">
                    {selectedKecamatan.lahanProduktifHa.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-500">Ha</span>
                  </div>
                </div>
              </div>

              {/* UPT Transmigrasi info inside district */}
              {selectedKecamatan.uptList.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                    Kawasan UPT Transmigrasi:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedKecamatan.uptList.map((upt, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {upt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => onOpenDetailModal(selectedKecamatan)}
                className="w-full py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Lihat Profil Detail & Potensi Lengkap</span>
                <span>&rarr;</span>
              </button>
            </div>

            {/* Demografi Bar Stats (matching poster) */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Struktur Demografi</span>
                </div>
                <span className="text-[11px] text-slate-500">Usia Produktif</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>0 - 14 tahun (Anak)</span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {selectedKecamatan.demografi.usia0_14Pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${selectedKecamatan.demografi.usia0_14Pct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium text-slate-800">15 - 64 tahun (Usia Kerja)</span>
                    <span className="font-bold tabular-nums text-emerald-700">
                      {selectedKecamatan.demografi.usia15_64Pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-700 h-2 rounded-full"
                      style={{ width: `${selectedKecamatan.demografi.usia15_64Pct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>&ge; 65 tahun (Lansia)</span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {selectedKecamatan.demografi.usia65PlusPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-400 h-2 rounded-full"
                      style={{ width: `${selectedKecamatan.demografi.usia65PlusPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pemanfaatan Lahan Progress (matching poster exactly) */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Wheat className="w-4 h-4 text-emerald-700" />
                  <span>Pemanfaatan Lahan</span>
                </div>
                <span className="text-[11px] text-slate-500">Kawasan {selectedKecamatan.nama}</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600"></span>
                      <span>Pertanian Pangan</span>
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {selectedKecamatan.lahan.pertanianPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${selectedKecamatan.lahan.pertanianPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-600"></span>
                      <span>Perkebunan Rakyat</span>
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {selectedKecamatan.lahan.perkebunanPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-1.5 rounded-full"
                      style={{ width: `${selectedKecamatan.lahan.perkebunanPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-sky-600"></span>
                      <span>Pemukiman Warga</span>
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {selectedKecamatan.lahan.pemukimanPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-1.5 rounded-full"
                      style={{ width: `${selectedKecamatan.lahan.pemukimanPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-teal-800"></span>
                      <span>Hutan Lindung & Savana</span>
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {selectedKecamatan.lahan.hutanPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-800 h-1.5 rounded-full"
                      style={{ width: `${selectedKecamatan.lahan.hutanPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-slate-400"></span>
                      <span>Lainnya / Lahan Cadangan</span>
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {selectedKecamatan.lahan.lainnyaPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-400 h-1.5 rounded-full"
                      style={{ width: `${selectedKecamatan.lahan.lainnyaPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
