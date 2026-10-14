import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { KecamatanData, MapMode, SheetEntry } from '../types';
import { KECAMATAN_NAGEKEO } from '../data/nagekeoData';
import { Layers, MapPin, Maximize2, Compass, Wheat, Milk, Users, Building, PlusCircle, Database } from 'lucide-react';

interface InteractiveMapProps {
  onSelectKecamatan: (k: KecamatanData) => void;
  selectedKecamatan: KecamatanData;
  onOpenDetailModal: (k: KecamatanData) => void;
  onOpenInputForDistrict: (namaKec: string) => void;
  entries: SheetEntry[];
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
  'aesesa': '#15803d',
  'aesesa-selatan': '#16a34a',
  'boawae': '#b45309',
  'mauponggo': '#0d9488',
  'nangaroro': '#ea580c',
  'keo-tengah': '#0284c7',
  'wolowae': '#ca8a04'
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectKecamatan,
  selectedKecamatan,
  onOpenDetailModal,
  onOpenInputForDistrict,
  entries
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonLayersRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [mapMode, setMapMode] = useState<MapMode>('streets');

  // Compute live district entries
  const districtEntries = entries.filter(
    (e) => (e.kecamatan || '').toLowerCase() === selectedKecamatan.nama.toLowerCase()
  );

  const pendudukTerdata = districtEntries
    .filter((e) => e.kategori === 'Kependudukan')
    .reduce((sum, e) => sum + (e.jumlahPopulasi || 0), 0);

  const ternakTerdata = districtEntries
    .filter((e) => e.kategori === 'Ternak')
    .reduce((sum, e) => sum + (e.jumlahPopulasi || 0), 0);

  const pertanianTerdataHa = districtEntries
    .filter((e) => e.kategori === 'Pertanian')
    .reduce((sum, e) => sum + (e.luasHa || 0), 0);

  const totalLahanTerdataHa = districtEntries.reduce(
    (sum, e) => sum + (e.luasHa || 0),
    0
  );

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

  // Render Polygons and dynamic markers
  useEffect(() => {
    if (!mapInstanceRef.current || !geojsonLayersRef.current || !markersLayerRef.current) return;

    geojsonLayersRef.current.clearLayers();
    markersLayerRef.current.clearLayers();

    KECAMATAN_NAGEKEO.forEach((kec) => {
      const isSelected = selectedKecamatan.id === kec.id;
      const baseColor = COLOR_PALETTE[kec.id] || '#15803d';

      // Count user records for this kecamatan
      const count = entries.filter(
        (e) => (e.kecamatan || '').toLowerCase() === kec.nama.toLowerCase()
      ).length;

      const polygon = L.polygon(kec.polygonCoords, {
        color: isSelected ? '#111827' : baseColor,
        weight: isSelected ? 3.5 : 1.8,
        fillColor: baseColor,
        fillOpacity: isSelected ? 0.45 : 0.2,
        dashArray: isSelected ? '' : '2'
      });

      polygon.on('click', () => {
        onSelectKecamatan(kec);
      });

      polygon.on('mouseover', function () {
        if (!isSelected) {
          polygon.setStyle({ fillOpacity: 0.35, weight: 2.5 });
        }
      });

      polygon.on('mouseout', function () {
        if (!isSelected) {
          polygon.setStyle({ fillOpacity: 0.2, weight: 1.8 });
        }
      });

      polygon.bindTooltip(
        `<div class="text-xs font-semibold px-1 py-0.5">${kec.nama}</div><div class="text-[11px] text-slate-500">${count > 0 ? `${count} data terdata` : 'Belum ada data'}</div>`,
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
            ${count > 0 ? `<span class="ml-0.5 text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-semibold">${count}</span>` : ''}
          </div>
        `,
        iconSize: [110, 24],
        iconAnchor: [55, 12]
      });

      const centerMarker = L.marker(kec.center, { icon: centerIcon });
      centerMarker.on('click', () => onSelectKecamatan(kec));
      markersLayerRef.current?.addLayer(centerMarker);
    });

  }, [selectedKecamatan, entries]);

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
              Peta Geospasial Kawasan & Potensi
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Visualisasi batas 7 kecamatan Kabupaten Nagekeo. Data populasi ternak, pertanian, dan penduduk terhubung secara dinamis dengan input Google Sheet.
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
            {KECAMATAN_NAGEKEO.map((kec) => {
              const kCount = entries.filter(
                (e) => (e.kecamatan || '').toLowerCase() === kec.nama.toLowerCase()
              ).length;
              return (
                <button
                  key={kec.id}
                  onClick={() => focusDistrict(kec)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    selectedKecamatan.id === kec.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{kec.nama}</span>
                  {kCount > 0 && (
                    <span className="text-[10px] bg-emerald-600 text-white px-1 py-0.2 rounded-full">
                      {kCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetView}
              title="Reset pandangan peta"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Reset Posisi</span>
            </button>
          </div>
        </div>

        {/* Main Geospatial Grid (Map on Left, Detail Panels on Right) */}
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
                <span>7 Kecamatan Nagekeo</span>
                <Compass className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#15803d]"></span>
                  <span>Aesesa (Mbay)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#16a34a]"></span>
                  <span>Aesesa Selatan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#b45309]"></span>
                  <span>Boawae</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#0d9488]"></span>
                  <span>Mauponggo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#ea580c]"></span>
                  <span>Nangaroro</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#0284c7]"></span>
                  <span>Keo Tengah</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#ca8a04]"></span>
                  <span>Wolowae</span>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 shadow-xs hidden sm:block">
              Klik wilayah peta untuk melihat data terinput
            </div>
          </div>

          {/* Right Sidebar: Dynamic stats reflecting REAL user entries */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Jelajahi Kawasan Card */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Data Wilayah Terpilih
                </div>
                <span className="text-xs text-slate-500">
                  {districtEntries.length} Data Terdata
                </span>
              </div>

              <div className="mb-3">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Kecamatan {selectedKecamatan.nama}</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Ibukota: {selectedKecamatan.ibukota} · Luas Wilayah Geografis: {selectedKecamatan.luasKm2} km²
                </p>
              </div>

              {/* Dynamic Quantitative Attributes Strip */}
              <div className="grid grid-cols-2 gap-2.5 mb-4 bg-white p-3 rounded-lg border border-slate-200/80">
                <div>
                  <div className="text-[11px] text-slate-500">Penduduk Terdata</div>
                  <div className="text-base font-bold tabular-nums text-slate-900">
                    {pendudukTerdata.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-500">jiwa</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {pendudukTerdata > 0 ? 'Data tersimpan' : 'Belum ada input'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Ternak Terdata</div>
                  <div className="text-base font-bold tabular-nums text-slate-900">
                    {ternakTerdata.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-500">ekor</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {ternakTerdata > 0 ? 'Data tersimpan' : 'Belum ada input'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Pertanian Terdata</div>
                  <div className="text-base font-bold tabular-nums text-emerald-700">
                    {pertanianTerdataHa.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-500">Ha</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {pertanianTerdataHa > 0 ? 'Lahan garapan' : 'Belum ada input'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Total Luas Lahan</div>
                  <div className="text-base font-bold tabular-nums text-slate-900">
                    {totalLahanTerdataHa.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-500">Ha</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {totalLahanTerdataHa > 0 ? 'Terekam di sistem' : 'Belum ada input'}
                  </div>
                </div>
              </div>

              {/* Action Buttons for this district */}
              <div className="space-y-2">
                <button
                  onClick={() => onOpenInputForDistrict(selectedKecamatan.nama)}
                  className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Input Data untuk Kecamatan {selectedKecamatan.nama}</span>
                </button>

                <button
                  onClick={() => onOpenDetailModal(selectedKecamatan)}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span>Lihat Profil Detail Wilayah</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* Rekapitulasi Catatan Lapangan untuk Kecamatan ini */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span>Daftar Entri Terdata ({districtEntries.length})</span>
                </div>
              </div>

              {districtEntries.length === 0 ? (
                <div className="text-center py-6 px-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700 mb-1">Kawasan Masih Bersih</p>
                  <p className="text-[11px] text-slate-400">
                    Belum ada data ternak, pertanian, atau penduduk yang dicatat untuk Kecamatan {selectedKecamatan.nama}.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {districtEntries.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{item.jenisKomoditas}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.dusunUpt || item.kategori} · {item.namaPencatat}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold tabular-nums text-emerald-800">
                          {item.jumlahPopulasi.toLocaleString('id-ID')} {item.satuan}
                        </div>
                        {item.luasHa ? (
                          <div className="text-[10px] text-slate-400">{item.luasHa} Ha</div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
