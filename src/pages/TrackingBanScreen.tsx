import React, { useState } from 'react';
import { mockWheels, mockBatteries, mockTireLogs } from '../data/mockTires';
import { BatteryItem, WheelItem } from '../types';

export const TrackingBanScreen: React.FC = () => {
  const [selectedWheel, setSelectedWheel] = useState<string>("2L-I");
  const [activeTab, setActiveTab] = useState<"tire" | "battery" | "log">("tire");

  // Dynamic Data States
  const [wheels, setWheels] = useState<Record<string, WheelItem>>(mockWheels);
  const [batteries, setBatteries] = useState<BatteryItem[]>(mockBatteries);
  const [tireLogs, setTireLogs] = useState(mockTireLogs);

  // Modal Visibility States
  const [showRotateModal, setShowRotateModal] = useState<boolean>(false);
  const [showBatteryModal, setShowBatteryModal] = useState<boolean>(false);
  const [showTireModal, setShowTireModal] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  // Form States
  const [batteryForm, setBatteryForm] = useState<{
    title: string;
    model: string;
    serial: string;
    voltage: string;
    cca: string;
    detail: string;
    busId: string;
    type: string;
  }>({
    title: "Starter Bank 3 (Aux)",
    model: "GS Yuasa N120 HD 12V 120Ah",
    serial: `GS-HD-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    voltage: "12.8V",
    cca: "910 CCA (Optimal)",
    detail: "Beban kelistrikan audio kabin & charger port USB",
    busId: "TY-082 (Mercedes-Benz OH 1626)",
    type: "Aki Basah Heavy Duty (Lead-Acid)"
  });

  const [tireForm, setTireForm] = useState<{
    position: string;
    name: string;
    serial: string;
    tread: string;
    psi: string;
    odo: string;
    status: string;
  }>({
    position: "1L",
    name: "Michelin X Multi Z",
    serial: `DOT MC-${Math.floor(100 + Math.random() * 900)}-2024`,
    tread: "14.0 mm",
    psi: "125 PSI",
    odo: "0 km",
    status: "Aman"
  });

  const [logForm, setLogForm] = useState<{
    busId: string;
    serial: string;
    transaction: string;
    mechanic: string;
    type: "rotation" | "retread" | "battery";
  }>({
    busId: "TY-082",
    serial: "GS-HD-2409-8819A",
    transaction: "Ganti Aki Baru",
    mechanic: "Hendra Saputra",
    type: "battery"
  });

  const cur = wheels[selectedWheel] || wheels["2L-I"];

  // Form Submission Handlers
  const handleAddBattery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batteryForm.model || !batteryForm.serial) {
      alert("Harap lengkapi merk/model dan nomor seri aki!");
      return;
    }

    const newBatteryItem: BatteryItem = {
      title: batteryForm.title,
      voltage: batteryForm.voltage,
      model: batteryForm.model,
      serial: batteryForm.serial,
      cca: batteryForm.cca,
      detail: batteryForm.detail || undefined,
    };

    setBatteries([newBatteryItem, ...batteries]);

    // Also add to audit logs
    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setTireLogs([
      {
        date: nowStr,
        busId: batteryForm.busId.split(' ')[0] || 'TY-082',
        serial: `${batteryForm.serial} (${batteryForm.model})`,
        transaction: `Pasang Aki Baru (${batteryForm.title})`,
        mechanic: 'Teknisi Elektrikal Pool',
        type: 'battery'
      },
      ...tireLogs
    ]);

    setShowBatteryModal(false);
    alert(`Unit aki "${batteryForm.model}" (${batteryForm.serial}) berhasil ditambahkan dan dicatat ke log!`);

    // Reset form with new serial
    setBatteryForm({
      title: "Starter Bank 3 (Aux)",
      model: "GS Yuasa N120 HD 12V 120Ah",
      serial: `GS-HD-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      voltage: "12.8V",
      cca: "910 CCA (Optimal)",
      detail: "Beban kelistrikan audio kabin & charger port USB",
      busId: "TY-082 (Mercedes-Benz OH 1626)",
      type: "Aki Basah Heavy Duty (Lead-Acid)"
    });
  };

  const handleAddTire = (e: React.FormEvent) => {
    e.preventDefault();
    const pos = tireForm.position;
    const badgeLabel = wheels[pos]?.badge || pos;

    const updatedWheel: WheelItem = {
      name: tireForm.name,
      serial: tireForm.serial,
      odo: tireForm.odo,
      tread: tireForm.tread,
      status: tireForm.status,
      badge: badgeLabel,
      color: "bg-emerald-600",
      psi: tireForm.psi
    };

    setWheels({
      ...wheels,
      [pos]: updatedWheel
    });

    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setTireLogs([
      {
        date: nowStr,
        busId: "TY-082",
        serial: `${tireForm.serial} (${tireForm.name})`,
        transaction: `Pasang Ban Baru Posisi ${pos}`,
        mechanic: "Mekanik Ban Pool",
        type: "rotation"
      },
      ...tireLogs
    ]);

    setShowTireModal(false);
    alert(`Ban baru ${tireForm.name} (${tireForm.serial}) berhasil dipasang pada posisi ${pos}!`);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setTireLogs([
      {
        date: nowStr,
        busId: logForm.busId,
        serial: logForm.serial,
        transaction: logForm.transaction,
        mechanic: logForm.mechanic,
        type: logForm.type
      },
      ...tireLogs
    ]);

    setShowLogModal(false);
    alert(`Log transaksi "${logForm.transaction}" berhasil dicatat!`);
  };

  const handleDeleteBattery = (serial: string, model: string) => {
    if (window.confirm(`Yakin ingin menghapus unit baterai ${model} (${serial})?`)) {
      setBatteries(batteries.filter((b) => b.serial !== serial));
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase mb-1">
            <span>Modul 2.3 & 4.3</span>
            <span>•</span>
            <span className="text-on-surface-variant font-medium">Workshop & Lifecycle Hardware</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Pelacakan Komponen Ban & Aki</h1>
          <p className="text-xs text-on-surface-variant">Audit individual serial DOT ban radial, rotasi alur tapak, dan voltase baterai aki 24V.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === "tire" && (
            <>
              <button
                onClick={() => setShowRotateModal(true)}
                className="px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">swap_horizontal_circle</span>
                Rotasi Posisi Ban
              </button>
              <button
                onClick={() => setShowTireModal(true)}
                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-hover flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                + Pasang Ban Baru
              </button>
            </>
          )}

          {activeTab === "battery" && (
            <button
              onClick={() => setShowBatteryModal(true)}
              className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-hover flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              + Tambah Aki / Inverter Baru
            </button>
          )}

          {activeTab === "log" && (
            <button
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-hover flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">post_add</span>
              + Catat Log Mutasi
            </button>
          )}
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab("tire")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "tire" ? "bg-primary text-white shadow-xs" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Visualisasi Roda</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "tire" ? "bg-white/20 text-white" : "bg-surface-container text-on-surface"
              }`}
            >
              {Object.keys(wheels).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("battery")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "battery" ? "bg-primary text-white shadow-xs" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Tracking Aki 24V & Inverter</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "battery" ? "bg-white/20 text-white" : "bg-surface-container text-on-surface"
              }`}
            >
              {batteries.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("log")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "log" ? "bg-primary text-white shadow-xs" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Log Pergantian Pool</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "log" ? "bg-white/20 text-white" : "bg-surface-container text-on-surface"
              }`}
            >
              {tireLogs.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-on-surface-variant px-2 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Armada Aktif: <strong>TY-082 (B 7199 UGA)</strong></span>
          </span>
        </div>
      </div>

      {activeTab === "tire" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Chassis Map */}
          <div className="xl:col-span-7 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Armada TY-082 (B 7199 UGA)</h3>
                <span className="text-[11px] text-on-surface-variant">MB OH 1626 • 6-Wheeler Bus</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &gt;8mm</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 4-8mm</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-error"></span> &lt;4mm</span>
              </div>
            </div>

            {/* Simulated Bus Frame */}
            <div className="my-6 p-6 bg-surface-container-low rounded-2xl flex flex-col items-center max-w-md mx-auto w-full">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-4">Front Steering Axle</span>

              {/* Steer Axle */}
              <div className="w-full flex items-center justify-between px-4">
                <button
                  onClick={() => setSelectedWheel("1L")}
                  className={`p-2 rounded-lg text-white font-mono text-xs flex flex-col items-center ${wheels["1L"].color} ${selectedWheel === "1L" ? "ring-4 ring-primary" : ""}`}
                >
                  <span className="font-bold">1L</span>
                  <span className="text-[10px]">{wheels["1L"].tread}</span>
                </button>
                <div className="h-2 flex-1 bg-outline-variant/40 mx-4 rounded-full"></div>
                <button
                  onClick={() => setSelectedWheel("1R")}
                  className={`p-2 rounded-lg text-white font-mono text-xs flex flex-col items-center ${wheels["1R"].color} ${selectedWheel === "1R" ? "ring-4 ring-primary" : ""}`}
                >
                  <span className="font-bold">1R</span>
                  <span className="text-[10px]">{wheels["1R"].tread}</span>
                </button>
              </div>

              <div className="w-1 h-16 bg-outline-variant/30 my-4"></div>
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Drive Axle (Dual)</span>

              {/* Rear Dual Axle */}
              <div className="w-full flex items-center justify-between px-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSelectedWheel("2L-O")}
                    className={`p-2 rounded-lg text-white font-mono text-xs flex flex-col items-center ${wheels["2L-O"].color} ${selectedWheel === "2L-O" ? "ring-4 ring-primary" : ""}`}
                  >
                    <span className="font-bold">2L-O</span>
                    <span className="text-[10px]">{wheels["2L-O"].tread}</span>
                  </button>
                  <button
                    onClick={() => setSelectedWheel("2L-I")}
                    className={`p-2 rounded-lg text-white font-mono text-xs flex flex-col items-center ${wheels["2L-I"].color} ${selectedWheel === "2L-I" ? "ring-4 ring-primary" : ""}`}
                  >
                    <span className="font-bold">2L-I</span>
                    <span className="text-[10px]">{wheels["2L-I"].tread}</span>
                  </button>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">AX-2</div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSelectedWheel("2R-I")}
                    className={`p-2 rounded-lg text-white font-mono text-xs flex flex-col items-center ${wheels["2R-I"].color} ${selectedWheel === "2R-I" ? "ring-4 ring-primary" : ""}`}
                  >
                    <span className="font-bold">2R-I</span>
                    <span className="text-[10px]">{wheels["2R-I"].tread}</span>
                  </button>
                  <button
                    onClick={() => setSelectedWheel("2R-O")}
                    className={`p-2 rounded-lg text-white font-mono text-xs flex flex-col items-center ${wheels["2R-O"].color} ${selectedWheel === "2R-O" ? "ring-4 ring-primary" : ""}`}
                  >
                    <span className="font-bold">2R-O</span>
                    <span className="text-[10px]">{wheels["2R-O"].tread}</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t w-full flex justify-center">
                <button
                  onClick={() => setSelectedWheel("SP-1")}
                  className={`px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs font-semibold flex items-center gap-1.5 shadow-xs ${selectedWheel === "SP-1" ? "ring-2 ring-primary" : ""}`}
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">support</span>
                  <span>Ban Serep SP-1 (11.4mm)</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-on-surface-variant text-center">Klik roda pada diagram di atas untuk memeriksa riwayat alur fisik.</p>
          </div>

          {/* Detail Selected Tire */}
          <div className="xl:col-span-5 bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <span className="px-2 py-0.5 rounded bg-primary text-white font-mono text-xs font-bold">{cur.badge}</span>
                <h3 className="text-base font-bold text-on-surface mt-1.5">{cur.name}</h3>
                <span className="text-xs text-on-surface-variant">{cur.serial}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                cur.status === "Aman" ? "bg-emerald-100 text-emerald-800" :
                cur.status === "Waspada" || cur.status === "Perhatian" ? "bg-amber-100 text-amber-800" :
                "bg-error-container text-error"
              }`}>{cur.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Tebal Alur</span>
                <span className="text-lg font-bold text-on-surface">{cur.tread}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Jarak Tempuh Ban</span>
                <span className="text-lg font-bold text-on-surface font-mono">{cur.odo}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Tekanan TPMS</span>
                <span className="text-sm font-bold text-emerald-700">{cur.psi}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Ukuran Ban</span>
                <span className="text-sm font-bold text-on-surface">295/80 R22.5</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg text-amber-900 text-xs">
              <span className="font-bold block mb-1">Rekomendasi AI Workshop</span>
              <p>Lakukan rotasi silang roda dalam 3.000 KM ke depan agar keausan tidak condong ke sisi luar tapak.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowRotateModal(true)} className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-hover">
                Tukar Posisi (Rotasi)
              </button>
              <button onClick={() => alert("Form pengiriman vulkanisir ke PT Goodyear Bandag telah dibuat.")} className="flex-1 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded hover:bg-surface-container-high">
                Kirim Vulkanisir
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "battery" && (
        <div className="space-y-6">
          {/* Quick Metrics Battery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Komponen Daya</span>
              <div className="text-2xl font-bold text-on-surface mt-1">{batteries.length} <span className="text-xs font-normal text-on-surface-variant">Unit</span></div>
              <span className="text-[11px] text-emerald-600 font-medium">Starter 24V & Inverter</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Tegangan Sistem Starter</span>
              <div className="text-2xl font-bold text-primary mt-1">25.5V <span className="text-xs font-normal text-on-surface-variant">DC Serial</span></div>
              <span className="text-[11px] text-emerald-600 font-medium">Batas Aman &gt;24.0V</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Rerata Nilai CCA</span>
              <div className="text-2xl font-bold text-on-surface mt-1">882 <span className="text-xs font-normal text-on-surface-variant">CCA</span></div>
              <span className="text-[11px] text-emerald-600 font-medium">Kondisi Starter Prima</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Inverter AC 220V</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">Normal</div>
              <span className="text-[11px] text-on-surface-variant">Beban AVOD & USB Port</span>
            </div>
          </div>

          {/* Battery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {batteries.map((b, i) => (
              <div key={i} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm space-y-3 relative group hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {b.title.toLowerCase().includes('inverter') ? 'electric_bolt' : 'bolt'}
                    </span>
                    <span className="text-xs font-bold text-on-surface-variant uppercase">{b.title}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    {b.voltage}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">{b.model}</h4>
                <div className="text-xs text-on-surface-variant space-y-1 font-mono bg-surface-container-low p-2.5 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-outline">No. Seri:</span>
                    <span className="font-bold text-on-surface">{b.serial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Hasil Uji:</span>
                    <span className="font-semibold text-emerald-700">{b.cca}</span>
                  </div>
                </div>
                {b.detail && (
                  <div className="text-xs text-primary font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    <span>{b.detail}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-surface-container flex justify-between items-center text-xs">
                  <span className="text-[11px] text-on-surface-variant">Status: <strong className="text-emerald-600">Aktif Terhubung</strong></span>
                  <button
                    onClick={() => handleDeleteBattery(b.serial, b.model)}
                    className="text-error hover:underline text-[11px] cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "log" && (
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-container">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Histori Mutasi, Rotasi & Pergantian Komponen</h3>
              <p className="text-xs text-on-surface-variant">Log jejak transaksi penggantian ban radial, rotasi tapak, dan instalasi aki starter.</p>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">{tireLogs.length} Transaksi Tercatat</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
                  <th className="py-2.5 px-3">Tanggal & Pool</th>
                  <th className="py-2.5 px-3">No. Lambung</th>
                  <th className="py-2.5 px-3">Serial Komponen</th>
                  <th className="py-2.5 px-3">Transaksi</th>
                  <th className="py-2.5 px-3">Mekanik Pelaksana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {tireLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-3 font-mono">{log.date}</td>
                    <td className="py-3 px-3 font-bold text-primary">{log.busId}</td>
                    <td className="py-3 px-3 font-medium">{log.serial}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        log.type === "rotation" ? "bg-blue-50 text-primary" :
                        log.type === "battery" ? "bg-purple-50 text-purple-700" :
                        "bg-amber-50 text-amber-800"
                      }`}>
                        {log.transaction}
                      </span>
                    </td>
                    <td className="py-3 px-3">{log.mechanic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Rotasi */}
      {showRotateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">autorenew</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Catat Rotasi Roda Bus</h3>
                  <p className="text-xs text-on-surface-variant">Rotasi silang posisi ban untuk pemerataan tapak.</p>
                </div>
              </div>
              <button
                onClick={() => setShowRotateModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form
              id="rotate-wheel-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Rotasi berhasil diverifikasi dan SPK mekanik diterbitkan.");
                setShowRotateModal(false);
              }}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs"
            >
              <div>
                <label className="font-semibold text-on-surface block mb-1">Armada Bus</label>
                <input
                  disabled
                  value="TY-082 (Mercedes-Benz OH 1626)"
                  className="w-full p-2.5 bg-surface-container rounded-lg border border-outline-variant/30 text-on-surface font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Posisi Asal</label>
                  <select className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface">
                    <option>2L-Inner (4.6mm)</option>
                    <option>2R-Outer (3.1mm)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Posisi Tujuan</label>
                  <select className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface">
                    <option>SP-1 (Ban Serep)</option>
                    <option>1L (Steer Kiri)</option>
                  </select>
                </div>
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRotateModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="rotate-wheel-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan & Terbitkan SPK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Tambah Aki / Inverter */}
      {showBatteryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">bolt</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Tambah Unit Aki / Inverter Baru</h3>
                  <p className="text-xs text-on-surface-variant">Daftarkan komponen aki baterai 24V atau inverter kabin armada bus.</p>
                </div>
              </div>
              <button
                onClick={() => setShowBatteryModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="battery-form" onSubmit={handleAddBattery} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">Armada Bus Target</label>
                <select
                  value={batteryForm.busId}
                  onChange={(e) => setBatteryForm({ ...batteryForm, busId: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="TY-082 (Mercedes-Benz OH 1626)">TY-082 (Mercedes-Benz OH 1626 - B 7199 UGA)</option>
                  <option value="TY-104 (Scania K410IB)">TY-104 (Scania K410IB - B 7201 UGA)</option>
                  <option value="TY-001 (Hino RK8 R260)">TY-001 (Hino RK8 R260 - B 7001 TAY)</option>
                  <option value="TY-015 (Volvo B11R 430HP)">TY-015 (Volvo B11R 430HP - B 7015 TAY)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Posisi / Bank Baterai *</label>
                  <select
                    value={batteryForm.title}
                    onChange={(e) => setBatteryForm({ ...batteryForm, title: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    required
                  >
                    <option value="Starter Bank 1 (Primary)">Starter Bank 1 (Primary)</option>
                    <option value="Starter Bank 2 (Pair)">Starter Bank 2 (Pair)</option>
                    <option value="Starter Bank 3 (Aux)">Starter Bank 3 (Auxiliary)</option>
                    <option value="Aux Inverter AC 220V">Aux Inverter AC 220V</option>
                    <option value="Baterai Cadangan Standby">Baterai Cadangan Standby</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Tipe Komponen *</label>
                  <select
                    value={batteryForm.type}
                    onChange={(e) => setBatteryForm({ ...batteryForm, type: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Aki Basah Heavy Duty (Lead-Acid)">Aki Basah Heavy Duty (Lead-Acid)</option>
                    <option value="Aki Kering Maintenance Free (MF)">Aki Kering Maintenance Free (MF)</option>
                    <option value="Baterai Lithium LiFePO4">Baterai Lithium LiFePO4</option>
                    <option value="Inverter Pure Sine Wave">Inverter Pure Sine Wave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Merk & Model Komponen *</label>
                  <input
                    type="text"
                    required
                    value={batteryForm.model}
                    onChange={(e) => setBatteryForm({ ...batteryForm, model: e.target.value })}
                    placeholder="Contoh: GS Yuasa N120 HD 120Ah"
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Nomor Seri / SN Barcode *</label>
                  <input
                    type="text"
                    required
                    value={batteryForm.serial}
                    onChange={(e) => setBatteryForm({ ...batteryForm, serial: e.target.value })}
                    placeholder="Contoh: GS-HD-2409-8821C"
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Voltase Terukur (V) *</label>
                  <input
                    type="text"
                    required
                    value={batteryForm.voltage}
                    onChange={(e) => setBatteryForm({ ...batteryForm, voltage: e.target.value })}
                    placeholder="Contoh: 12.8V atau 24.0V atau 220 VAC"
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Hasil Uji CCA / Efisiensi *</label>
                  <input
                    type="text"
                    required
                    value={batteryForm.cca}
                    onChange={(e) => setBatteryForm({ ...batteryForm, cca: e.target.value })}
                    placeholder="Contoh: 890 CCA (Optimal)"
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Keterangan / Beban Penggunaan</label>
                <input
                  type="text"
                  value={batteryForm.detail}
                  onChange={(e) => setBatteryForm({ ...batteryForm, detail: e.target.value })}
                  placeholder="Contoh: Beban starter engine & alternator 80A, atau beban inverter audio kabin"
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBatteryModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="battery-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan & Daftarkan Aki
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Tambah / Pasang Ban Baru */}
      {showTireModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">add_circle</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Registrasi & Pasang Ban Baru</h3>
                  <p className="text-xs text-on-surface-variant">Pasang unit ban radial baru ke posisi axle armada bus.</p>
                </div>
              </div>
              <button
                onClick={() => setShowTireModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="tire-form" onSubmit={handleAddTire} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">Posisi Axle Pemasangan *</label>
                <select
                  value={tireForm.position}
                  onChange={(e) => setTireForm({ ...tireForm, position: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  required
                >
                  <option value="1L">1L - Steer Depan Kiri</option>
                  <option value="1R">1R - Steer Depan Kanan</option>
                  <option value="2L-O">2L-O - Drive Belakang Kiri (Outer)</option>
                  <option value="2L-I">2L-I - Drive Belakang Kiri (Inner)</option>
                  <option value="2R-I">2R-I - Drive Belakang Kanan (Inner)</option>
                  <option value="2R-O">2R-O - Drive Belakang Kanan (Outer)</option>
                  <option value="SP-1">SP-1 - Ban Cadangan / Serep</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Merk & Pola Tapak Ban *</label>
                  <select
                    value={tireForm.name}
                    onChange={(e) => setTireForm({ ...tireForm, name: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    required
                  >
                    <option value="Michelin X Multi Z">Michelin X Multi Z (Steer/All)</option>
                    <option value="Bridgestone R150">Bridgestone R150 (All Position)</option>
                    <option value="GT Radial Giti GAR820">GT Radial Giti GAR820 (Regional)</option>
                    <option value="Goodyear Marathon LHS">Goodyear Marathon LHS (Highway)</option>
                    <option value="Gajah Tunggal Super Lug">Gajah Tunggal Super Lug (Traction)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Nomor Seri DOT *</label>
                  <input
                    type="text"
                    required
                    value={tireForm.serial}
                    onChange={(e) => setTireForm({ ...tireForm, serial: e.target.value })}
                    placeholder="Contoh: DOT MC-440-2024"
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Tebal Alur Awal *</label>
                  <input
                    type="text"
                    required
                    value={tireForm.tread}
                    onChange={(e) => setTireForm({ ...tireForm, tread: e.target.value })}
                    placeholder="Contoh: 14.0 mm"
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Tekanan Target *</label>
                  <input
                    type="text"
                    required
                    value={tireForm.psi}
                    onChange={(e) => setTireForm({ ...tireForm, psi: e.target.value })}
                    placeholder="Contoh: 125 PSI"
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Odometer Awal *</label>
                  <input
                    type="text"
                    required
                    value={tireForm.odo}
                    onChange={(e) => setTireForm({ ...tireForm, odo: e.target.value })}
                    placeholder="Contoh: 0 km"
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTireModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="tire-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Pasang Ban ke Axle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Catat Log Mutasi */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">post_add</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Catat Log Mutasi Komponen</h3>
                  <p className="text-xs text-on-surface-variant">Input transaksi rotasi, pergantian, atau perbaikan ban/aki.</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="log-form" onSubmit={handleAddLog} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">No. Lambung Armada Bus *</label>
                <input
                  type="text"
                  required
                  value={logForm.busId}
                  onChange={(e) => setLogForm({ ...logForm, busId: e.target.value })}
                  placeholder="Contoh: TY-082"
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Jenis Transaksi *</label>
                <input
                  type="text"
                  required
                  value={logForm.transaction}
                  onChange={(e) => setLogForm({ ...logForm, transaction: e.target.value })}
                  placeholder="Contoh: Ganti Aki Baru / Rotasi Silang Roda"
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Serial Komponen Terlibat *</label>
                <input
                  type="text"
                  required
                  value={logForm.serial}
                  onChange={(e) => setLogForm({ ...logForm, serial: e.target.value })}
                  placeholder="Contoh: GS-HD-2409-8819A atau DOT 93 U7 4122"
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Nama Mekanik Pelaksana *</label>
                <input
                  type="text"
                  required
                  value={logForm.mechanic}
                  onChange={(e) => setLogForm({ ...logForm, mechanic: e.target.value })}
                  placeholder="Contoh: Hendra Saputra"
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="log-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan Transaksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

