import React, { useState } from 'react';
import { mockBuses, mockServiceHistory } from '../data/mockFleet';
import { BusAsset, ServiceRecord } from '../types';

export const MasterArmadaScreen: React.FC = () => {
  const [buses, setBuses] = useState<BusAsset[]>(mockBuses);
  const [selectedBus, setSelectedBus] = useState<string>("T-015");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editBus, setEditBus] = useState<BusAsset | null>(null);

  // State untuk Modal Histori Servis
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>("");
  const [historyCategory, setHistoryCategory] = useState<string>("all");

  const [newBus, setNewBus] = useState({
    id: "",
    plate: "",
    chassis: "Mercedes-Benz OH 1626 L Air Suspension",
    body: "Adiputro - Jetbus 5 MHD/SHD"
  });

  const activeBus = buses.find((b) => b.id === selectedBus) || buses[0];
  const filtered = buses.filter((b) =>
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.chassis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ambil histori servis untuk unit yang sedang aktif
  const currentHistory: ServiceRecord[] = mockServiceHistory[activeBus.id] || [
    {
      id: `SRV-${activeBus.id}-01`,
      busId: activeBus.id,
      spkNumber: "SPK-2024-0891",
      date: "14 Okt 2024",
      odometer: activeBus.odo,
      category: "Preventive Maintenance",
      description: "Servis Berkala Rutin: Pengecekan Sistem Pneumatik, Ganti Oli Mesin & Filter Udara",
      partsReplaced: ["Oli Mesin Heavy Duty 15W-40", "Filter Oli Utama", "Air Filter Element"],
      workshop: `${activeBus.pool} - Bay 01`,
      mechanic: "Hendra Saputra",
      cost: "Rp 3.450.000",
      status: "Selesai",
      statusBadge: "bg-emerald-100 text-emerald-800"
    }
  ];

  const filteredHistory = currentHistory.filter((item) => {
    const matchesSearch =
      item.spkNumber.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.description.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.mechanic.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.partsReplaced.some((p) => p.toLowerCase().includes(historySearch.toLowerCase()));

    const matchesCategory = historyCategory === "all" || item.category === historyCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BusAsset = {
      id: newBus.id || `T-${Math.floor(100 + Math.random() * 900)}`,
      plate: newBus.plate || "B 7000 TAY",
      year: new Date().getFullYear().toString(),
      color: "Biru Putih",
      chassis: newBus.chassis,
      vin: "VIN" + Math.random().toString(36).substring(2, 12).toUpperCase(),
      engine: "ENG-" + Math.floor(100000 + Math.random() * 900000),
      body: newBus.body,
      type: "Executive (30 Seat)",
      layout: "2-2 Deck",
      odo: "0 Km",
      pool: "Pool Pusat Pulogebang",
      status: "Ready",
      statusClass: "bg-emerald-100 text-emerald-800"
    };

    setBuses([created, ...buses]);
    setSelectedBus(created.id);
    setShowAddModal(false);
    setNewBus({ id: "", plate: "", chassis: "Mercedes-Benz OH 1626 L Air Suspension", body: "Adiputro - Jetbus 5 MHD/SHD" });
    alert(`Armada baru ${created.id} (${created.plate}) berhasil didaftarkan!`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBus) return;

    let statusClass = "bg-emerald-100 text-emerald-800";
    if (editBus.status === "On-Trip") statusClass = "bg-blue-100 text-blue-800";
    else if (editBus.status === "Standby") statusClass = "bg-amber-100 text-amber-800";
    else if (editBus.status === "Under Maintenance") statusClass = "bg-orange-100 text-orange-800";

    const updatedBus: BusAsset = {
      ...editBus,
      statusClass
    };

    setBuses(buses.map((b) => (b.id === updatedBus.id ? updatedBus : b)));
    setShowEditModal(false);
    alert(`Profil armada ${updatedBus.id} (${updatedBus.plate}) berhasil diperbarui!`);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-primary text-xs uppercase font-bold tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">directions_bus</span>
            <span>Modul 02 • Inventaris & Rolling Stock AKAP</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Master Data Armada & Sasis</h1>
          <p className="text-xs text-on-surface-variant">Manajemen registrasi sasis heavy-duty, karoseri bodi, konfigurasi kursi, dan status operasional.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Tambah Unit Armada Baru
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant">Total Terdaftar</span>
            <div className="text-2xl font-bold text-on-surface mt-1">148 <span className="text-xs font-normal text-on-surface-variant">Bus</span></div>
            <span className="text-[11px] text-emerald-600 font-medium">132 Siap Jalan</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">airport_shuttle</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-on-surface-variant">Karoseri Terbanyak</span>
          <div className="text-sm font-bold text-on-surface mt-1">Adiputro Jetbus 5</div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: "39%" }}></div>
          </div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">58 Unit (39%)</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-on-surface-variant">Powertrain Utama</span>
          <div className="text-sm font-bold text-on-surface mt-1">Mercedes-Benz OH</div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: "52%" }}></div>
          </div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">78 Unit (52%)</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant">Rerata Utilisasi</span>
            <div className="text-2xl font-bold text-on-surface mt-1">18.420 <span className="text-xs font-normal text-on-surface-variant">KM/bln</span></div>
            <span className="text-[11px] text-emerald-600 font-medium">+6.4% Efisiensi</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">speed</span>
          </div>
        </div>
      </div>

      {/* Table & Detail Preview Bento */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-surface-container">
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[18px]">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nopol, lambung, chassis..."
                  className="w-full bg-surface-container-lowest text-xs rounded-lg pl-8 pr-3 py-1.5 border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                />
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Klik baris untuk preview spesifikasi</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                    <th className="py-3 px-4">No. Lambung / Plat</th>
                    <th className="py-3 px-4">Sasis & Powertrain</th>
                    <th className="py-3 px-4">Karoseri</th>
                    <th className="py-3 px-4">Odo & Lokasi</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filtered.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBus(b.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedBus === b.id ? "bg-blue-50/60 font-semibold" : "hover:bg-surface-container-low/60"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-9 h-9 rounded-lg bg-blue-100 text-primary flex items-center justify-center font-bold text-xs">
                            {b.id}
                          </span>
                          <div>
                            <span className="font-bold text-on-surface block">{b.plate}</span>
                            <span className="text-[11px] text-on-surface-variant">{b.year} • {b.color}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-on-surface block">{b.chassis}</span>
                        <span className="font-mono text-[10px] text-on-surface-variant">{b.vin}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span>{b.body}</span>
                        <span className="text-[10px] text-outline block">{b.type}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-on-surface">{b.odo}</span>
                        <span className="text-[10px] text-primary block font-sans">{b.pool}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.statusClass}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Quick Preview Panel */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <span className="text-xs uppercase font-bold text-primary tracking-wider">Quick Preview Sasis</span>
            <span className="font-mono font-bold bg-primary text-white text-xs px-2 py-0.5 rounded">{activeBus.id}</span>
          </div>

          <div className="relative w-full h-36 rounded-lg overflow-hidden bg-surface-container">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80"
              alt="Bus preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Siap Dispatch
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-on-surface">{activeBus.plate}</h3>
            <p className="text-xs text-on-surface-variant">{activeBus.body}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-surface-container-low">
            <div>
              <span className="text-on-surface-variant block text-[11px]">Tipe Sasis</span>
              <span className="font-semibold text-on-surface">{activeBus.chassis}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[11px]">Tangki BBM</span>
              <span className="font-semibold text-on-surface">400 L BioSolar</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[11px]">Nomor Mesin</span>
              <span className="font-mono text-[10px] font-semibold text-on-surface truncate block">{activeBus.engine}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[11px]">Odo Berjalan</span>
              <span className="font-bold text-primary font-mono">{activeBus.odo}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase text-on-surface-variant tracking-wider block mb-1.5">Fasilitas Kabin</span>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-on-surface">Toilet Duduk</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-on-surface">Legrest Electric</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-on-surface">WiFi On-board</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-on-surface">AC Denso Clean</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                setHistorySearch("");
                setHistoryCategory("all");
                setShowHistoryModal(true);
              }}
              className="flex-1 py-2 rounded bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              Histori Servis
            </button>
            <button
              onClick={() => {
                setEditBus({ ...activeBus });
                setShowEditModal(true);
              }}
              className="flex-1 py-2 rounded bg-primary text-white hover:bg-primary-hover text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Ubah Profil
            </button>
          </div>
        </div>
      </div>

      {/* Modal Histori Servis Unit */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">build_circle</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-on-surface">Buku Servis & Riwayat Pemeliharaan</h3>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-primary text-white font-bold">{activeBus.id}</span>
                    <span className="text-xs font-semibold text-on-surface-variant">({activeBus.plate})</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {activeBus.chassis} • {activeBus.body} • Odometer: <span className="font-mono font-bold text-primary">{activeBus.odo}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Quick Stats Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span className="text-[11px] text-on-surface-variant block">Total Riwayat Servis</span>
                  <span className="text-xl font-bold text-on-surface mt-0.5 block">{currentHistory.length} SPK</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span className="text-[11px] text-on-surface-variant block">Servis Terakhir</span>
                  <span className="text-sm font-bold text-primary mt-1 block font-mono">
                    {currentHistory[0]?.date || "-"}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span className="text-[11px] text-on-surface-variant block">Bengkel Terakhir</span>
                  <span className="text-xs font-semibold text-on-surface mt-1 truncate block">
                    {currentHistory[0]?.workshop.split(" - ")[0] || "-"}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span className="text-[11px] text-on-surface-variant block">Status Garansi / Klaim</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif Terproteksi
                  </span>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 text-xs">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">search</span>
                  <input
                    type="text"
                    placeholder="Cari SPK, keluhan teknis, mekanik, suku cadang..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-on-surface-variant font-medium whitespace-nowrap">Filter Kategori:</span>
                  <select
                    value={historyCategory}
                    onChange={(e) => setHistoryCategory(e.target.value)}
                    className="p-2 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Preventive Maintenance">Preventive Maintenance</option>
                    <option value="Pneumatic & Brake">Pneumatic & Brake</option>
                    <option value="Transmission & Drivetrain">Transmission & Drivetrain</option>
                    <option value="Electrical & AC">Electrical & AC</option>
                  </select>
                </div>
              </div>

              {/* Datatable Histori Servis */}
              <div className="overflow-x-auto border border-outline-variant/20 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant uppercase font-semibold border-b border-surface-container">
                      <th className="py-3 px-3.5">No SPK & Tgl</th>
                      <th className="py-3 px-3.5">Kategori Servis</th>
                      <th className="py-3 px-3.5">Uraian Pengerjaan</th>
                      <th className="py-3 px-3.5">Suku Cadang Diganti</th>
                      <th className="py-3 px-3.5">Bengkel & Mekanik</th>
                      <th className="py-3 px-3.5 text-right">Biaya Total</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                        <td className="py-3 px-3.5">
                          <span className="font-mono font-bold text-primary block">{item.spkNumber}</span>
                          <span className="text-[11px] text-on-surface-variant block mt-0.5">{item.date}</span>
                          <span className="text-[10px] font-mono text-outline block">Odo: {item.odometer}</span>
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container text-on-surface inline-block">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 max-w-xs">
                          <span className="font-medium text-on-surface block line-clamp-2">{item.description}</span>
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {item.partsReplaced.map((part, pIdx) => (
                              <span key={pIdx} className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] text-on-surface-variant border border-outline-variant/10">
                                {part}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="font-medium text-on-surface block">{item.workshop}</span>
                          <span className="text-[11px] text-on-surface-variant block mt-0.5">Mekanik: {item.mechanic}</span>
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-on-surface">
                          {item.cost}
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.statusBadge}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-3xl text-outline mb-1 block">search_off</span>
                          Tidak ditemukan catatan riwayat servis yang sesuai dengan kata kunci filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">
                Menampilkan <span className="font-bold text-on-surface">{filteredHistory.length}</span> dari {currentHistory.length} catatan servis.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover shadow-sm transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Profil Armada */}
      {showEditModal && editBus && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">directions_bus</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-on-surface">Ubah Profil Armada</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary text-white font-bold">{editBus.id}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Perbarui spesifikasi teknis sasis, karoseri, status operasional, dan lokasi pool.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form id="edit-armada-form" onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {/* Grup 1: Identitas & Registrasi */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">1. Identitas & Legalitas Registrasi</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Plat Polisi</label>
                    <input
                      required
                      value={editBus.plate}
                      onChange={(e) => setEditBus({ ...editBus, plate: e.target.value })}
                      placeholder="Contoh: B 7123 VGA"
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tahun Pembuatan</label>
                    <input
                      type="number"
                      required
                      value={editBus.year}
                      onChange={(e) => setEditBus({ ...editBus, year: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Warna Livery</label>
                    <input
                      required
                      value={editBus.color}
                      onChange={(e) => setEditBus({ ...editBus, color: e.target.value })}
                      placeholder="Contoh: Electric Navy"
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Grup 2: Spesifikasi Teknis Sasis & Mesin */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">2. Spesifikasi Sasis & Mesin</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Chassis Platform</label>
                    <input
                      required
                      value={editBus.chassis}
                      onChange={(e) => setEditBus({ ...editBus, chassis: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Bodi Karoseri</label>
                    <input
                      required
                      value={editBus.body}
                      onChange={(e) => setEditBus({ ...editBus, body: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Rangka (VIN)</label>
                    <input
                      required
                      value={editBus.vin}
                      onChange={(e) => setEditBus({ ...editBus, vin: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Mesin</label>
                    <input
                      required
                      value={editBus.engine}
                      onChange={(e) => setEditBus({ ...editBus, engine: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Grup 3: Layanan & Konfigurasi Kabin */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">3. Layanan Kelas & Konfigurasi Kursi</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Kelas Layanan</label>
                    <input
                      required
                      value={editBus.type}
                      onChange={(e) => setEditBus({ ...editBus, type: e.target.value })}
                      placeholder="Contoh: Sleeper Suite (22 Seat)"
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Layout Kursi</label>
                    <input
                      required
                      value={editBus.layout}
                      onChange={(e) => setEditBus({ ...editBus, layout: e.target.value })}
                      placeholder="Contoh: 1-1 Capsule Deck"
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Grup 4: Lokasi & Status Operasional */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">4. Status & Lokasi Penempatan</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Odometer (Km)</label>
                    <input
                      required
                      value={editBus.odo}
                      onChange={(e) => setEditBus({ ...editBus, odo: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Lokasi Pool / Pos</label>
                    <input
                      required
                      value={editBus.pool}
                      onChange={(e) => setEditBus({ ...editBus, pool: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Status Operasi</label>
                    <select
                      value={editBus.status}
                      onChange={(e) => {
                        const val = e.target.value as BusAsset['status'];
                        let sClass = 'bg-emerald-100 text-emerald-800';
                        if (val === 'On-Trip') sClass = 'bg-blue-100 text-blue-800';
                        if (val === 'Standby') sClass = 'bg-amber-100 text-amber-800';
                        if (val === 'Under Maintenance') sClass = 'bg-orange-100 text-orange-800';
                        setEditBus({ ...editBus, status: val, statusClass: sClass });
                      }}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Ready">Ready (Siap Operasi)</option>
                      <option value="On-Trip">On-Trip (Sedang Jalan)</option>
                      <option value="Standby">Standby (Cadangan Pool)</option>
                      <option value="Under Maintenance">Under Maintenance (Perawatan)</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg font-semibold text-on-surface transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                form="edit-armada-form"
                className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrasi Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">directions_bus</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Registrasi Armada Baru</h3>
                  <p className="text-xs text-on-surface-variant">Tambahkan unit armada bus baru ke sistem inventaris.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="add-bus-form" onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Nomor Lambung</label>
                  <input
                    required
                    value={newBus.id}
                    onChange={(e) => setNewBus({ ...newBus, id: e.target.value })}
                    placeholder="Contoh: T-150"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Plat Polisi</label>
                  <input
                    required
                    value={newBus.plate}
                    onChange={(e) => setNewBus({ ...newBus, plate: e.target.value })}
                    placeholder="Contoh: B 7999 TAY"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-on-surface">Sasis Pabrikan</label>
                <select
                  value={newBus.chassis}
                  onChange={(e) => setNewBus({ ...newBus, chassis: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                >
                  <option>Mercedes-Benz OH 1626 L Air Suspension</option>
                  <option>Scania K410IB 6x2*4 Opticruise</option>
                  <option>Hino RM280 Space Frame</option>
                  <option>Volvo B11R 430HP</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-on-surface">Pabrikan Karoseri</label>
                <select
                  value={newBus.body}
                  onChange={(e) => setNewBus({ ...newBus, body: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                >
                  <option>Adiputro - Jetbus 5 MHD/SHD</option>
                  <option>Laksana - Legacy SR3 Suites Class</option>
                  <option>Tentrem - Avante H8 / D2</option>
                </select>
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-surface-container rounded-lg font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="add-bus-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
