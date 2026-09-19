import React, { useState } from 'react';

export const DispatchSerahTerimaScreen: React.FC = () => {
  const [inputOdo, setInputOdo] = useState<string>("218490");

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Serah Terima Antar-Pool & Log Odometer</h1>
          <p className="text-xs text-on-surface-variant">Validasi mutasi bus AKAP, rekonsiliasi odometer fisik vs GPS CAN-bus, dan kelaikan operasional.</p>
        </div>
        <button onClick={() => alert("Form Check-In unit baru dibuka.")} className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm">
          + Check-In / Serah Terima
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Check-In Aktif */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-primary text-white font-mono font-bold text-xs">TY-088</span>
              <div>
                <h3 className="font-bold text-sm text-on-surface">B 7942 KGA (Double Decker)</h3>
                <span className="text-[11px] text-on-surface-variant">Scania K410IB • Laksana SR3</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">Tiba di Ramp Pulogebang</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-surface-container-low rounded-lg text-xs">
            <div>
              <span className="text-outline block text-[10px]">Rute Operasi</span>
              <span className="font-semibold text-on-surface">Surabaya Waru → JKT</span>
            </div>
            <div>
              <span className="text-outline block text-[10px]">Driver Utama</span>
              <span className="font-semibold text-on-surface">Bambang Sutrisno</span>
            </div>
            <div>
              <span className="text-outline block text-[10px]">Sisa BBM Solar</span>
              <span className="font-bold text-primary">140 L (35%)</span>
            </div>
          </div>

          {/* Odometer Reconciliation */}
          <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-on-surface">Komparasi CAN-bus vs Odometer Fisik</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Deviasi Normal (+2 KM)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                <span className="text-[10px] text-outline block">GPS Telematics CAN-bus</span>
                <span className="font-mono text-base font-bold text-primary">218.488 KM</span>
              </div>
              <div className="p-3 bg-surface-container-lowest rounded-lg border border-primary/40 ring-2 ring-primary/10">
                <span className="text-[10px] text-primary font-semibold block">Input Fisik Dashboard</span>
                <input
                  value={inputOdo}
                  onChange={(e) => setInputOdo(e.target.value)}
                  className="w-full font-mono text-base font-bold text-on-surface bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-on-surface block">Checklist Kelaikan Cepat</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-0" />
                <span>Dokumen STNK & KIR Fisik Lengkap</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-0" />
                <span>34 Selimut Laundry & Headset</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-0" />
                <span>Kaca Bebas Retak / Bodi Bersih</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-0" />
                <span>Sanitasi Toilet & AC Bersih</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button onClick={() => alert("Check-in handover dan update Odometer berhasil disimpan!")} className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm">
              Validasi & Simpan Check-In
            </button>
          </div>
        </div>

        {/* Right: Pool Distribution */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-5 space-y-4">
          <h3 className="font-bold text-sm text-on-surface">Distribusi Armada per Pool</h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10 flex justify-between items-center">
              <div>
                <span className="font-bold text-on-surface block">Pool Pusat Pulogebang</span>
                <span className="text-emerald-700">26 Siap • 5 Cuci • 7 Bengkel</span>
              </div>
              <span className="font-mono font-bold text-sm text-primary">38 Unit</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10 flex justify-between items-center">
              <div>
                <span className="font-bold text-on-surface block">Pool Surabaya Waru</span>
                <span className="text-emerald-700">17 Siap • 5 Bengkel</span>
              </div>
              <span className="font-mono font-bold text-sm text-primary">22 Unit</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10 flex justify-between items-center">
              <div>
                <span className="font-bold text-on-surface block">Pool Solo Tirtonadi</span>
                <span className="text-emerald-700">12 Siap • 3 Bengkel</span>
              </div>
              <span className="font-mono font-bold text-sm text-primary">15 Unit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

