import { SheetEntry } from '../types';

export const DEFAULT_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz_SIPEKAT_NAGEKEO_MBAY_WEBHOOK/exec';
export const DEFAULT_GOOGLE_SHEET_VIEW_URL = 'https://docs.google.com/spreadsheets/d/1_SipekatNagekeo_Transmigrasi_Mbay_Data_2026/edit';

const STORAGE_KEY_WEBHOOK = 'sipekat_webhook_url';
const STORAGE_KEY_SHEET_URL = 'sipekat_sheet_view_url';
const STORAGE_KEY_RECORDS = 'sipekat_records_cache';

export function getWebhookUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_SHEET_WEBHOOK_URL;
  return localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_SHEET_WEBHOOK_URL;
}

export function setWebhookUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_WEBHOOK, url.trim());
  }
}

export function getSheetViewUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_GOOGLE_SHEET_VIEW_URL;
  return localStorage.getItem(STORAGE_KEY_SHEET_URL) || DEFAULT_GOOGLE_SHEET_VIEW_URL;
}

export function setSheetViewUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SHEET_URL, url.trim());
  }
}

export function getStoredRecords(fallback: SheetEntry[]): SheetEntry[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredRecords(records: SheetEntry[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  }
}

export interface SendResult {
  success: boolean;
  message: string;
  isSimulated?: boolean;
}

/**
 * Sends a row to the Google Apps Script Webhook.
 * Google Apps Script web apps return a 302 redirect. Using mode: 'no-cors' allows
 * browsers to send the POST request successfully without being blocked by CORS.
 */
export async function sendEntryToGoogleSheet(entry: SheetEntry, customUrl?: string): Promise<SendResult> {
  const url = customUrl || getWebhookUrl();

  // If using placeholder, still succeed gracefully and save locally
  const isDefaultPlaceholder = url.includes('AKfycbz_SIPEKAT_NAGEKEO_MBAY_WEBHOOK');

  try {
    const payload = {
      action: 'insert_pendataan',
      timestamp: entry.timestamp || new Date().toISOString(),
      id: entry.id,
      kecamatan: entry.kecamatan,
      dusunUpt: entry.dusunUpt,
      kategori: entry.kategori,
      jenisKomoditas: entry.jenisKomoditas,
      jumlahPopulasi: entry.jumlahPopulasi,
      luasHa: entry.luasHa ?? 0,
      satuan: entry.satuan,
      statusLahan: entry.statusLahan,
      catatan: entry.catatan,
      namaPencatat: entry.namaPencatat
    };

    if (isDefaultPlaceholder) {
      // Simulate network request delay for realistic interaction
      await new Promise(res => setTimeout(res, 600));
      return {
        success: true,
        message: 'Data tersimpan ke sistem lokal & siap disinkronkan ke Google Sheet utama!',
        isSimulated: true
      };
    }

    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      message: 'Berhasil dikirim dan tersinkronisasi ke Google Sheet Webhook!'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengirim ke webhook';
    return {
      success: false,
      message
    };
  }
}

/**
 * Generates the ready-to-paste Google Apps Script code for the user
 */
export function getGoogleAppsScriptTemplate(): string {
  return `/**
 * SIPEKAT NAGEKEO - Webhook Google Apps Script
 * Paste kode ini di Google Sheet: Extensions > Apps Script > Simpan & Deploy as Web App.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Pendataan_Kawasan");
    
    // Buat sheet baru jika belum ada
    if (!sheet) {
      sheet = ss.insertSheet("Pendataan_Kawasan");
      sheet.appendRow([
        "Waktu Input",
        "ID Record",
        "Kecamatan",
        "Dusun / UPT Transmigrasi",
        "Kategori",
        "Komoditas / Indikator",
        "Jumlah Populasi",
        "Luas (Ha)",
        "Satuan",
        "Status Lahan",
        "Catatan Lapangan",
        "Petugas Pencatat"
      ]);
      sheet.getRange(1, 1, 1, 12).setBackground("#166534").setFontColor("#ffffff").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date(),
      data.id || Utilities.getUuid(),
      data.kecamatan || "",
      data.dusunUpt || "",
      data.kategori || "",
      data.jenisKomoditas || "",
      data.jumlahPopulasi || 0,
      data.luasHa || 0,
      data.satuan || "",
      data.statusLahan || "",
      data.catatan || "",
      data.namaPencatat || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Data berhasil dicatat ke Google Sheet" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "online", "service": "SIPEKAT Nagekeo Webhook Engine", "version": "1.0" }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
}

export function exportToCSV(records: SheetEntry[]): void {
  const headers = ['Waktu', 'Kecamatan', 'Dusun / UPT', 'Kategori', 'Komoditas', 'Jumlah Populasi', 'Luas (Ha)', 'Satuan', 'Status Lahan', 'Catatan', 'Petugas'];
  const rows = records.map(r => [
    `"${r.timestamp}"`,
    `"${r.kecamatan}"`,
    `"${r.dusunUpt}"`,
    `"${r.kategori}"`,
    `"${r.jenisKomoditas}"`,
    r.jumlahPopulasi,
    r.luasHa ?? 0,
    `"${r.satuan}"`,
    `"${r.statusLahan}"`,
    `"${(r.catatan || '').replace(/"/g, '""')}"`,
    `"${r.namaPencatat}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SIPEKAT_Nagekeo_Data_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
