/**
 * BACKEND CATUR ALAM 3D — Key-Value Store bersama
 * Menggantikan window.storage (yang hanya jalan di dalam artifact claude.ai)
 * agar dua browser/perangkat berbeda bisa saling menemukan ruangan yang sama.
 *
 * CARA DEPLOY:
 * 1. Buka https://script.google.com -> New Project, tempel kode ini.
 * 2. Klik Deploy > New deployment > pilih tipe "Web app".
 * 3. Execute as: Me. Who has access: Anyone.
 * 4. Klik Deploy, salin URL Web App yang muncul (diakhiri /exec).
 * 5. Tempel URL itu ke variabel GAS_API_URL di index.html.
 * 6. Setiap kali mengubah kode ini, buat deployment baru (atau "Manage deployments" -> Edit -> New version) supaya perubahan aktif.
 */

const CACHE_SECONDS = 21600; // 6 jam, cukup untuk satu sesi permainan

function doGet(e) {
  return handle(e);
}

function doPost(e) {
  return handle(e);
}

function handle(e) {
  try {
    const params = e.parameter;
    const action = params.action;
    const key = params.key;
    const cache = CacheService.getScriptCache();

    if (action === 'get') {
      const value = cache.get(key);
      return jsonOut({ value: value || null });
    }

    if (action === 'set') {
      const value = params.value;
      cache.put(key, value, CACHE_SECONDS);
      return jsonOut({ ok: true });
    }

    return jsonOut({ error: 'action tidak dikenal' });
  } catch (err) {
    return jsonOut({ error: String(err) });
  }
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
