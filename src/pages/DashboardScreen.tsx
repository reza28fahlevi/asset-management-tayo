import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase">
              Pusat Kendali Operasi AKAP
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-on-surface-variant text-xs flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping"></span>
              Pemutakhiran Real-Time Telematika 14:32 WIB
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">
            Status Kesiapan Armada & Health Command
          </h1>
          <p className="text-sm text-on-surface-variant">
            Monitoring 148 bus lintas Jawa-Sumatera, kesiapan ritase malam, dan kepatuhan kelaikan.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate("/dispatch-serah-terima")}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Dispatch Manifest
          </button>
          <button
            onClick={() => navigate("/perawatan-spk")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Surat Perintah Kerja (SPK) Baru
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2 bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Total Armada Aktif</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold text-primary">148</span>
                <span className="text-xs text-on-surface-variant font-medium">Unit Bus AKAP</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">directions_bus</span>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low -mx-5 -mb-5 p-3 px-5 rounded-b-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <span className="text-xs text-on-surface font-semibold">Tingkat Kesiapan Jalan</span>
            </div>
            <span className="text-sm font-bold text-primary">75.7%</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>Siap Jalan (Ready)</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Siap</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-on-surface">112</span>
            <span className="text-[11px] text-on-surface-variant block">Pool & Jalur Trayek</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "75.6%" }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>Sedang On-Trip</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-primary text-[10px] font-bold">Jalur</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-primary">84</span>
            <span className="text-[11px] text-on-surface-variant block">56.7% Sedang Dinas</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: "56.7%" }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>Standby Cadangan</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">Standby</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-on-surface">14</span>
            <span className="text-[11px] text-on-surface-variant block">Unit Back-up Siaga Pool</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "9.4%" }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>Bengkel & SPK</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 text-error text-[10px] font-bold">Perbaikan</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-error">18</span>
              <span className="text-[11px] text-on-surface-variant block">SPK Dalam Pengerjaan</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-on-surface-variant">4</span>
              <span className="text-[10px] text-outline block">Afkir</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden flex">
            <div className="bg-error h-1.5" style={{ width: "12.1%" }}></div>
            <div className="bg-outline h-1.5" style={{ width: "2.7%" }}></div>
          </div>
        </div>
      </div>

      {/* Mid Section: Active Ritase & SPK / Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-surface-container gap-2">
              <div>
                <h2 className="text-base font-bold text-on-surface">Distribusi Ritase Real-Time Antar Pool & Terminal</h2>
                <p className="text-xs text-on-surface-variant">Pemetaan transit koridor Pantura, Tol Trans-Jawa, dan Lintas Sumatera.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-surface-container text-xs rounded text-on-surface-variant font-semibold">94 Rute</span>
                <span className="px-2 py-0.5 bg-secondary-fixed text-primary text-xs rounded font-bold">18 On-Schedule</span>
              </div>
            </div>

            {/* Hub Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Pulogebang JKT</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex justify-between items-baseline mt-1 text-xs">
                  <span className="font-bold text-on-surface">26 Dept</span>
                  <span className="text-primary font-bold">16 Arr</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Poris Tangerang</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex justify-between items-baseline mt-1 text-xs">
                  <span className="font-bold text-on-surface">14 Dept</span>
                  <span className="text-primary font-bold">9 Arr</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Banyumanik SMG</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <div className="flex justify-between items-baseline mt-1 text-xs">
                  <span className="font-bold text-on-surface">18 Dept</span>
                  <span className="text-primary font-bold">22 Arr</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Medaeng SBY</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex justify-between items-baseline mt-1 text-xs">
                  <span className="font-bold text-on-surface">22 Dept</span>
                  <span className="text-primary font-bold">28 Arr</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-surface-container text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">route</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[11px]">Total Ritase Hari Ini</span>
                  <span className="font-bold text-on-surface">118 Ritase</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[11px]">On-Time Departure</span>
                  <span className="font-bold text-emerald-700">96.4%</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">local_gas_station</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[11px]">Rerata Konsumsi Solar</span>
                  <span className="font-bold text-on-surface">3.42 KM/L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Order Table Widget */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">build</span>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Work Order (SPK) Bengkel Aktif</h2>
                  <span className="text-xs text-on-surface-variant">18 bus dalam antrean perawatan di bengkel workshop</span>
                </div>
              </div>
              <button onClick={() => navigate("/perawatan-spk")} className="text-xs font-semibold text-primary hover:underline">
                Lihat Seluruh SPK →
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
                    <th className="py-2.5 px-3 rounded-l-lg">No SPK / Unit</th>
                    <th className="py-2.5 px-3">Chassis</th>
                    <th className="py-2.5 px-3">Kendala</th>
                    <th className="py-2.5 px-3">Workshop</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3">
                      <span className="font-bold text-primary block">TY-082</span>
                      <span className="font-mono text-[11px] text-outline">SPK-2024-1108</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-on-surface block">Hino RM 280 ABS</span>
                      <span className="text-[10px] text-on-surface-variant">Executive 2+2</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-on-surface block">Bocoran Valve Air Brake</span>
                      <span className="text-[10px] text-error">Prioritas Kritis</span>
                    </td>
                    <td className="py-3 px-3">
                      <span>Pool Pulogebang</span>
                      <span className="text-[10px] text-outline block">Bay 03</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-error text-[10px] font-bold">
                        Menunggu Part
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3">
                      <span className="font-bold text-primary block">TY-043</span>
                      <span className="font-mono text-[11px] text-outline">SPK-2024-1104</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-on-surface block">MB OH 1626 L</span>
                      <span className="text-[10px] text-on-surface-variant">Super Executive</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-on-surface block">Penggantian Kopling</span>
                      <span className="text-[10px] text-on-surface-variant">Servis 80K KM</span>
                    </td>
                    <td className="py-3 px-3">
                      <span>Pool Medaeng SBY</span>
                      <span className="text-[10px] text-outline block">Pit Stop 01</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-primary text-[10px] font-bold">
                        In-Progress (70%)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Legalitas & PM Alert */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">notification_important</span>
                <h2 className="text-sm font-bold text-on-surface">Compliance & Legalitas</h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-error text-white text-[10px] font-bold">4 Kritis</span>
            </div>
            <div className="space-y-3 mt-3">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">TY-021 (B 7741 TGA)</span>
                  <span className="text-error font-bold">Sisa 3 Hari</span>
                </div>
                <p className="text-on-surface-variant mt-1">Uji Berkala KIR Dishub - Jatuh Tempo 28 Okt</p>
                <div className="mt-2 flex justify-end">
                  <button onClick={() => navigate("/legalitas-regulasi")} className="px-2.5 py-1 bg-primary text-white rounded text-[11px] font-semibold">
                    Booking Slot KIR
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">TY-064 (B 7190 KGA)</span>
                  <span className="text-error font-bold">Sisa 5 Hari</span>
                </div>
                <p className="text-on-surface-variant mt-1">KPS / SPIONAM Trayek Jkt-Malang</p>
                <div className="mt-2 flex justify-end">
                  <button onClick={() => navigate("/legalitas-regulasi")} className="px-2.5 py-1 bg-primary text-white rounded text-[11px] font-semibold">
                    Perpanjang KPS
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[20px]">timelapse</span>
                <h2 className="text-sm font-bold text-on-surface">Ambang Servis PM Kritis</h2>
              </div>
              <span className="text-xs text-outline">&lt; 500 KM</span>
            </div>
            <div className="space-y-3 mt-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10">
                <div className="flex justify-between font-semibold">
                  <span className="text-primary">TY-015 (Scania K410)</span>
                  <span className="text-error font-bold">Sisa 240 KM</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-error h-1.5 rounded-full" style={{ width: "97.6%" }}></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px]">
                  <span className="text-on-surface-variant">Paket 200.000 KM</span>
                  <button onClick={() => navigate("/perawatan-spk")} className="text-primary font-bold hover:underline">
                    Booking Bay Solo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

