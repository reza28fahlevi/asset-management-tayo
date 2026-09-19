# Panduan Integrasi Frontend React TAYO dengan Backend Laravel

Dokumen ini adalah panduan lengkap untuk menghubungkan aplikasi SPA React (Vite + TypeScript) **TAYO Fleet Management** dengan Backend REST API **Laravel** (Laravel 10 / 11 dengan Laravel Sanctum).

---

## 1. Arsitektur Komunikasi Frontend <-> Backend

```
+-----------------------------------+       HTTP JSON (Axios)        +-----------------------------------+
|     React SPA (Vite + TS)         | <===========================> |     Laravel REST API              |
|  - Port Dev: http://localhost:5173|       Bearer Token / Cookie   |  - Port Dev: http://localhost:8000|
|  - api.ts (Interseptor 401 & 422) |                               |  - Laravel Sanctum (Auth)         |
|  - services/ (Modular API Calls)  |                               |  - Controllers & Resources        |
|  - Fallback ke data mock otomatis |                               |  - MySQL / PostgreSQL Database    |
+-----------------------------------+                               +-----------------------------------+
```

---

## 2. File & Konfigurasi yang Telah Disiapkan di Frontend

1. **`src/services/api.ts`**:
   - Klien Axios terstandarisasi dengan `baseURL` dinamis.
   - Header otomatis: `Accept: application/json` (mencegah redirect HTML saat error validasi), `Content-Type: application/json`, dan `X-Requested-With: XMLHttpRequest`.
   - `withCredentials: true` untuk dukungan CSRF Cookie Laravel Sanctum.
   - Interseptor Request: Otomatis menyertakan `Authorization: Bearer <token>` dari `localStorage`.
   - Interseptor Response: Menangani HTTP 401 (Unauthorized) dan HTTP 422 (Validasi Form) secara terpusat.
2. **`src/services/` (Modular Domain Services)**:
   - `authService.ts`: Login, Logout, CSRF Cookie, Profil User.
   - `handoverService.ts`: BASTK Check-In, Check-Out SPJ, Mutasi Pool, Odometer.
   - `workshopService.ts`: SPK Bengkel, Update Status Bay, Alokasi Mekanik.
   - `inventoryService.ts`: Suku Cadang, Penerimaan GRN, Pengeluaran, Opname.
   - `costService.ts`: Realisasi Beban Biaya per KM, Kajian Simulasi Re-Body.
   - `legalService.ts`: Legalitas KIR, KPS, STNK, Jadwal Uji Dishub.
   - `fleetService.ts`: Master Armada Bus & Update Status.
3. **`.env` & `.env.example`**:
   - `VITE_API_BASE_URL=http://localhost:8000/api`
   - `VITE_ENABLE_MOCK_FALLBACK=true` (Memungkinkan frontend tetap berjalan normal dengan data mock jika backend Laravel belum menyala).
4. **`vite.config.ts`**:
   - Dilengkapi *reverse proxy* lokal untuk rute `/api` dan `/sanctum` ke `http://localhost:8000`.

---

## 3. Langkah Konfigurasi di Sisi Backend Laravel

### A. Konfigurasi CORS (`config/cors.php`)
Pastikan Laravel mengizinkan origin React Vite dan mengaktifkan `supports_credentials`:

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Wajib true untuk Sanctum
];
```

### B. Konfigurasi Environment Laravel (`.env`)
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DOMAIN=localhost
```

---

## 4. Daftar Rute API Laravel yang Dibutuhkan (`routes/api.php`)

Salin atau sesuaikan rute berikut pada file `routes/api.php` di proyek Laravel:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusController;
use App\Http\Controllers\Api\HandoverController;
use App\Http\Controllers\Api\WorkOrderController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\CostAnalyticsController;
use App\Http\Controllers\Api\LegalDocumentController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum Auth)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // User Profile & Logout
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // 1. Master Armada Bus
    Route::get('/buses', [BusController::class, 'index']);
    Route::get('/buses/{id}', [BusController::class, 'show']);
    Route::patch('/buses/{id}/status', [BusController::class, 'updateStatus']);

    // 2. Dispatch & Serah Terima BASTK
    Route::get('/handovers', [HandoverController::class, 'index']);
    Route::post('/handovers/check-in', [HandoverController::class, 'storeCheckIn']);
    Route::post('/handovers/check-out', [HandoverController::class, 'storeCheckOut']);
    Route::post('/handovers/mutation', [HandoverController::class, 'storeMutation']);
    Route::get('/pools/fleet-status', [HandoverController::class, 'poolFleetStatus']);

    // 3. Bengkel & SPK Perawatan
    Route::get('/work-orders', [WorkOrderController::class, 'index']);
    Route::post('/work-orders', [WorkOrderController::class, 'store']);
    Route::patch('/work-orders/{id}/status', [WorkOrderController::class, 'updateStatus']);
    Route::post('/work-orders/{id}/assign-mechanic', [WorkOrderController::class, 'assignMechanic']);

    // 4. Gudang & Suku Cadang
    Route::get('/inventory/parts', [InventoryController::class, 'getParts']);
    Route::post('/inventory/parts', [InventoryController::class, 'storePart']);
    Route::get('/inventory/receipts', [InventoryController::class, 'getReceipts']);
    Route::post('/inventory/receipts', [InventoryController::class, 'storeReceipt']);
    Route::post('/inventory/issues', [InventoryController::class, 'storeIssue']);
    Route::post('/inventory/mutations', [InventoryController::class, 'storeMutation']);
    Route::post('/inventory/opnames', [InventoryController::class, 'storeOpname']);

    // 5. Analitik Biaya & Kelayakan Re-Body
    Route::get('/analytics/costs', [CostAnalyticsController::class, 'getCostRecords']);
    Route::post('/analytics/costs', [CostAnalyticsController::class, 'storeCostRecord']);
    Route::get('/analytics/rebody-simulations', [CostAnalyticsController::class, 'getSimulations']);
    Route::post('/analytics/rebody-simulations', [CostAnalyticsController::class, 'storeSimulation']);

    // 6. Legalitas, Uji KIR, KPS, & STNK
    Route::get('/legal/documents', [LegalDocumentController::class, 'index']);
    Route::post('/legal/renew', [LegalDocumentController::class, 'renew']);
    Route::get('/legal/schedules', [LegalDocumentController::class, 'schedules']);
    Route::post('/legal/schedules', [LegalDocumentController::class, 'storeSchedule']);
});
```

---

## 5. Contoh Controller & Request Validation Laravel

### Contoh: `HandoverController.php` (Check-In BASTK)

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Handover;
use App\Models\Bus;

class HandoverController extends Controller
{
    public function storeCheckIn(Request $request)
    {
        // Validasi Laravel (Otomatis menghasilkan respon HTTP 422 JSON yang ditangkap oleh api.ts)
        $validated = $request->validate([
            'bastkNumber'       => 'required|string|unique:handovers,bastk_number',
            'busId'             => 'required|string|exists:buses,bus_code',
            'canbusOdometer'    => 'required|numeric|min:0',
            'physicalOdometer'  => 'required|numeric|min:0',
            'fuelLevelPercent'  => 'required|numeric|min:0|max:100',
            'fuelLiters'        => 'required|numeric|min:0',
            'originPool'        => 'required|string',
            'destinationPool'   => 'required|string',
            'driverName'        => 'required|string',
            'dispatcherName'    => 'required|string',
            'handoverStatus'    => 'required|string',
            'driverComplaint'   => 'nullable|string',
        ]);

        $odometerDiff = $validated['physicalOdometer'] - $validated['canbusOdometer'];

        $handover = Handover::create([
            'bastk_number'       => $validated['bastkNumber'],
            'bus_code'           => $validated['busId'],
            'type'               => 'Check-In (Tiba di Pool)',
            'canbus_odometer'    => $validated['canbusOdometer'],
            'physical_odometer'  => $validated['physicalOdometer'],
            'odometer_diff'      => $odometerDiff,
            'fuel_percent'       => $validated['fuelLevelPercent'],
            'fuel_liters'        => $validated['fuelLiters'],
            'driver_name'        => $validated['driverName'],
            'dispatcher_name'    => $validated['dispatcherName'],
            'status'             => $validated['handoverStatus'],
            'driver_complaint'   => $validated['driverComplaint'] ?? null,
            'check_in_at'        => now(),
        ]);

        // Jika ada keluhan teknis, update status unit bus ke 'Rujuk Workshop'
        if (!empty($validated['driverComplaint'])) {
            Bus::where('bus_code', $validated['busId'])->update(['status' => 'Bengkel']);
        }

        return response()->json([
            'success' => true,
            'message' => 'BASTK Check-In berhasil divalidasi dan disimpan.',
            'data'    => $handover,
        ], 201);
    }
}
```

---

## 6. Cara Menggunakan Service di Komponen React

Untuk menghubungkan komponen React ke backend Laravel, cukup panggil *service* terkait:

```tsx
import React, { useEffect, useState } from 'react';
import { handoverService } from '../services/handoverService';
import { HandoverRecordItem } from '../types';

export const MyComponent = () => {
  const [records, setRecords] = useState<HandoverRecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await handoverService.getHandovers();
        setRecords(data);
      } catch (err: any) {
        console.error('Gagal mengambil data dari Laravel:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveCheckIn = async (formData) => {
    try {
      const savedRecord = await handoverService.createCheckIn(formData);
      setRecords([savedRecord, ...records]);
      alert('Tersimpan ke database Laravel!');
    } catch (err: any) {
      if (err.errors) {
        // Tampilkan error validasi field dari Laravel
        console.log('Error Validasi Laravel:', err.errors);
      }
    }
  };

  return <div>...</div>;
};
```

---

## 7. Kesimpulan

Proyek SPA ini sekarang **sudah 100% siap digunakan bersama Laravel**:
1. Menjalankan `npm run dev` pada React dan `php artisan serve` pada Laravel akan langsung terhubung tanpa kendala CORS berkat proxy Vite dan `apiClient` Axios.
2. Fitur `VITE_ENABLE_MOCK_FALLBACK=true` menjamin pengembang dapat terus bekerja dan menguji tampilan antarmuka meskipun backend Laravel sedang *offline* atau endpoint tertentu masih dalam tahap pengembangan.

