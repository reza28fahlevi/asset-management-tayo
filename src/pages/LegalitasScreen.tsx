import React from 'react';
import { mockLegalData } from '../data/mockLegal';

export const LegalitasScreen: React.FC = () => {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Legalitas & Dokumen Armada</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">SPIONAM Terhubung</span>
          </div>
          <p className="text-xs text-on-surface-variant">Monitoring kepatuhan kelaikan Uji KIR, Kartu Pengawasan (KPS), dan Pajak STNK.</p>
        </div>
        <button onClick={() => alert("Pendaftaran izin berkala KIR/KPS baru dibuka.")} className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm">
          + Registrasi Dokumen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-sm">
          <span className="text-xs text-on-surface-variant uppercase font-bold">Siap Jalan</span>
          <div className="text-2xl font-bold text-on-surface mt-1">140 <span className="text-xs font-normal text-on-surface-variant">Bus (94.6%)</span></div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-amber-400 shadow-sm">
          <span className="text-xs text-amber-800 uppercase font-bold">Perlu Perpanjangan (&lt;14 Hari)</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">5 <span className="text-xs font-normal text-on-surface-variant">Unit</span></div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-error shadow-sm">
          <span className="text-xs text-error uppercase font-bold">Grounded / Kunci SPJ</span>
          <div className="text-2xl font-bold text-error mt-1">3 <span className="text-xs font-normal text-on-surface-variant">Unit</span></div>
        </div>
      </div>

      {/* Table Legalitas */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-3 bg-surface-container-low flex justify-between items-center text-xs">
          <span className="font-semibold text-on-surface">Daftar Status Uji Berkala & SPIONAM</span>
          <span className="text-on-surface-variant">Sinkronisasi otomatis sistem SPIONAM</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                <th className="py-3 px-4">Armada & Rute</th>
                <th className="py-3 px-4">Uji KIR Dishub</th>
                <th className="py-3 px-4">KPS SPIONAM</th>
                <th className="py-3 px-4">Pajak STNK</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {mockLegalData.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">{row.id}</span>
                      <span className="font-bold text-on-surface">{row.plate}</span>
                    </div>
                    <span className="text-[11px] text-outline block">{row.route}</span>
                  </td>
                  <td className="py-3 px-4 font-medium">{row.kir}</td>
                  <td className="py-3 px-4">{row.kps}</td>
                  <td className="py-3 px-4">{row.stnk}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.statusClass}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => alert(`Detail dokumen ${row.id} siap diproses.`)} className="px-2.5 py-1 bg-surface-container hover:bg-primary hover:text-white rounded font-semibold text-[11px] transition-colors">
                      Kelola
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

