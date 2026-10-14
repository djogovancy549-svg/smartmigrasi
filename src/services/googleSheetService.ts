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

/**
 * Retrieves records from localStorage. Cleans out any legacy dummy rows.
 */
export function getStoredRecords(): SheetEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      // Filter out any legacy dummy records that started with 'row-'
      const cleanUserEntries = parsed.filter(item => item && !item.id?.startsWith('row-'));
      return cleanUserEntries;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveStoredRecords(records: SheetEntry[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  }
}

export function clearAllLocalRecords(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_RECORDS);
  }
}

export interface SendResult {
  success: boolean;
  message: string;
  isSimulated?: boolean;
}

/**
 * 1. INSERT: Sends a new row to Google Sheet Webhook.
 */
export async function sendEntryToGoogleSheet(entry: SheetEntry, customUrl?: string): Promise<SendResult> {
  const url = customUrl || getWebhookUrl();
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
      await new Promise(res => setTimeout(res, 500));
      return {
        success: true,
        message: 'Data baru berhasil disimpan di sistem lokal & siap disinkronkan ke Google Sheet!',
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
      message: 'Data berhasil dicatat ke Google Sheet Webhook!'
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
 * 2. UPDATE: Updates an existing row in Google Sheet Webhook matching ID Record.
 */
export async function updateEntryInGoogleSheet(entry: SheetEntry, customUrl?: string): Promise<SendResult> {
  const url = customUrl || getWebhookUrl();
  const isDefaultPlaceholder = url.includes('AKfycbz_SIPEKAT_NAGEKEO_MBAY_WEBHOOK');

  try {
    const payload = {
      action: 'update_pendataan',
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
      await new Promise(res => setTimeout(res, 400));
      return {
        success: true,
        message: 'Perubahan data berhasil disimpan di sistem lokal!',
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
      message: 'Data berhasil diperbarui di Google Sheet!'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui di webhook';
    return {
      success: false,
      message
    };
  }
}

/**
 * 3. DELETE: Deletes an existing row in Google Sheet Webhook matching ID Record.
 */
export async function deleteEntryFromGoogleSheet(id: string, customUrl?: string): Promise<SendResult> {
  const url = customUrl || getWebhookUrl();
  const isDefaultPlaceholder = url.includes('AKfycbz_SIPEKAT_NAGEKEO_MBAY_WEBHOOK');

  try {
    const payload = {
      action: 'delete_pendataan',
      id: id
    };

    if (isDefaultPlaceholder) {
      await new Promise(res => setTimeout(res, 400));
      return {
        success: true,
        message: 'Data berhasil dihapus dari sistem lokal!',
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
      message: 'Data berhasil dihapus dari baris Google Sheet!'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus dari webhook';
    return {
      success: false,
      message
    };
  }
}

/**
 * Generates the complete, production-ready CRUD Google Apps Script template
 */
export function getGoogleAppsScriptTemplate(): string {
  return `/**
 * SIPEKAT NAGEKEO - Webhook Google Apps Script (Full CRUD: Insert, Update, Delete)
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
    var action = data.action || 'insert_pendataan';

    // 1. DELETE ACTION
    if (action === 'delete_pendataan') {
      var targetId = data.id;
      if (!targetId) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "ID tidak ditemukan" })).setMimeType(ContentService.MimeType.JSON);
      }
      var lastRow = sheet.getLastRow();
      var deleted = false;
      if (lastRow > 1) {
        var idValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
        for (var i = idValues.length - 1; i >= 0; i--) {
          if (String(idValues[i][0]) === String(targetId)) {
            sheet.deleteRow(i + 2);
            deleted = true;
            break;
          }
        }
      }
      return ContentService
        .createTextOutput(JSON.stringify({ "status": "success", "message": deleted ? "Data baris berhasil dihapus dari Google Sheet" : "ID tidak ditemukan di sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. UPDATE ACTION
    if (action === 'update_pendataan') {
      var targetId = data.id;
      var lastRow = sheet.getLastRow();
      var updated = false;
      if (lastRow > 1) {
        var idValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
        for (var i = 0; i < idValues.length; i++) {
          if (String(idValues[i][0]) === String(targetId)) {
            var rowIndex = i + 2;
            sheet.getRange(rowIndex, 1, 1, 12).setValues([[
              data.timestamp || new Date(),
              data.id,
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
            ]]);
            updated = true;
            break;
          }
        }
      }
      // If row not found to update, append as new
      if (!updated) {
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
      }
      return ContentService
        .createTextOutput(JSON.stringify({ "status": "success", "message": "Data baris berhasil diperbarui di Google Sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. INSERT ACTION (Default)
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
    .createTextOutput(JSON.stringify({ "status": "online", "service": "SIPEKAT Nagekeo Webhook Engine", "crud": ["insert", "update", "delete"] }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
}

export function exportToCSV(records: SheetEntry[]): void {
  const headers = ['Waktu', 'ID', 'Kecamatan', 'Dusun / UPT', 'Kategori', 'Komoditas', 'Jumlah Populasi', 'Luas (Ha)', 'Satuan', 'Status Lahan', 'Catatan', 'Petugas'];
  const rows = records.map(r => [
    `"${r.timestamp}"`,
    `"${r.id}"`,
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
