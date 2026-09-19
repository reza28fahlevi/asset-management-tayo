import React, { useState } from 'react';
import { initialPools, initialDepos, initialTrayeks } from '../data/mockPools';
import { PoolData, DepoData, TrayekData } from '../types';

export const MasterPoolScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pool' | 'depo' | 'trayek'>('pool');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State Data
  const [pools, setPools] = useState<PoolData[]>(initialPools);
  const [depos, setDepos] = useState<DepoData[]>(initialDepos);
  const [trayeks, setTrayeks] = useState<TrayekData[]>(initialTrayeks);

  // Modal Visibility States
  const [showPoolModal, setShowPoolModal] = useState<boolean>(false);
  const [showDepoModal, setShowDepoModal] = useState<boolean>(false);
  const [showTrayekModal, setShowTrayekModal] = useState<boolean>(false);

  // Form State: Pool Baru
  const [poolForm, setPoolForm] = useState<Omit<PoolData, 'id'>>({
    name: '',
    code: '',
    city: '',
    address: '',
    capacity: 30,
    occupied: 0,
    washBays: 2,
    mechanicBays: 3,
    picName: '',
    phone: '',
    status: 'Aktif'
  });

  // Form State: Depo Baru
  const [depoForm, setDepoForm] = useState<Omit<DepoData, 'id'>>({
    name: '',
    code: '',
    city: '',
    depoType: 'Logistik & Suku Cadang',
    areaSize: '1.500 m²',
    rackCount: 24,
    mechanicsCount: 10,
    picName: '',
    phone: '',
    status: 'Operasional 24 Jam'
  });

  // Form State: Trayek Baru
  const [trayekForm, setTrayekForm] = useState<Omit<TrayekData, 'id'>>({
    routeCode: '',
    origin: '',
    destination: '',
    corridor: '',
    distanceKm: 500,
    estDuration: '8 - 9 Jam',
    fleetCount: 10,
    fareRange: 'Rp 300.000 - Rp 450.000',
    skKemenhub: '',
    status: 'Aktif Resmi'
  });

  // Filter Handlers
  const filteredPools = pools.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.picName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDepos = depos.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.depoType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.picName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrayeks = trayeks.filter(
    (t) =>
      t.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.corridor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skKemenhub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submit Handlers
  const handleAddPool = (e: React.FormEvent) => {
    e.preventDefault();
    const newPool: PoolData = {
      ...poolForm,
      id: `POOL-${String(pools.length + 1).padStart(3, '0')}`
    };
    setPools([newPool, ...pools]);
    setShowPoolModal(false);
    setPoolForm({
      name: '',
      code: '',
      city: '',
      address: '',
      capacity: 30,
      occupied: 0,
      washBays: 2,
      mechanicBays: 3,
      picName: '',
      phone: '',
      status: 'Aktif'
    });
    alert(`Pool ${newPool.name} berhasil ditambahkan!`);
  };

  const handleAddDepo = (e: React.FormEvent) => {
    e.preventDefault();
    const newDepo: DepoData = {
      ...depoForm,
      id: `DPO-${String(depos.length + 1).padStart(3, '0')}`
    };
    setDepos([newDepo, ...depos]);
    setShowDepoModal(false);
    setDepoForm({
      name: '',
      code: '',
      city: '',
      depoType: 'Logistik & Suku Cadang',
      areaSize: '1.500 m²',
      rackCount: 24,
      mechanicsCount: 10,
      picName: '',
      phone: '',
      status: 'Operasional 24 Jam'
    });
    alert(`Depo ${newDepo.name} berhasil ditambahkan!`);
  };

  const handleAddTrayek = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrayek: TrayekData = {
      ...trayekForm,
      id: `TRK-${String(trayeks.length + 1).padStart(3, '0')}`
    };
    setTrayeks([newTrayek, ...trayeks]);
    setShowTrayekModal(false);
    setTrayekForm({
      routeCode: '',
      origin: '',
      destination: '',
      corridor: '',
      distanceKm: 500,
      estDuration: '8 - 9 Jam',
      fleetCount: 10,
      fareRange: 'Rp 300.000 - Rp 450.000',
      skKemenhub: '',
      status: 'Aktif Resmi'
    });
    alert(`Jaringan trayek ${newTrayek.routeCode} berhasil didaftarkan!`);
  };

  // Delete Handlers
  const handleDeletePool = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus ${name} dari daftar pool?`)) {
      setPools(pools.filter((p) => p.id !== id));
    }
  };

  const handleDeleteDepo = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus ${name} dari daftar depo?`)) {
      setDepos(depos.filter((d) => d.id !== id));
    }
  };

  const handleDeleteTrayek = (id: string, code: string) => {
    if (window.confirm(`Yakin ingin menghapus trayek ${code}?`)) {
      setTrayeks(trayeks.filter((t) => t.id !== id));
    }
  };

  const currentTabAction = {
    pool: {
      label: 'Tambah Pool Baru',
      icon: 'domain_add',
      modal: () => setShowPoolModal(true),
    },
    depo: {
      label: 'Tambah Depo Baru',
      icon: 'add_business',
      modal: () => setShowDepoModal(true),
    },
    trayek: {
      label: 'Tambah Trayek Baru',
      icon: 'add_road',
      modal: () => setShowTrayekModal(true),
    },
  }[activeTab];

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-primary text-xs uppercase font-bold tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">alt_route</span>
            <span>Modul 02.4 • Jaringan Depo, Pool & Koridor Trayek</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Master Pool, Depo & Jaringan Trayek</h1>
          <p className="text-xs text-on-surface-variant">
            Pusat manajemen terpadu lokasi fisik pool stabling armada, depo workshop logistik suku cadang, serta izin trayek AKAP Kemenhub RI.
          </p>
        </div>
      </div>

      {/* Tabs Navigation & Search Toolbar */}
      <div className="bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => {
              setActiveTab('pool');
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pool'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">domain</span>
            <span>Pool Stabling Armada</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'pool' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'
              }`}
            >
              {pools.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('depo');
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'depo'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">store</span>
            <span>Depo & Workshop</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'depo' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'
              }`}
            >
              {depos.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('trayek');
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'trayek'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">alt_route</span>
            <span>Jaringan Trayek & Rute</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'trayek' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'
              }`}
            >
              {trayeks.length}
            </span>
          </button>
        </div>

        {/* Toolbar Right Side: Search + Dynamic Add Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[18px]">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'pool'
                  ? 'Cari nama pool, kota, PIC...'
                  : activeTab === 'depo'
                  ? 'Cari depo, tipe, kota...'
                  : 'Cari kode rute, kota, via...'
              }
              className="w-full bg-surface-container-low text-xs rounded-lg pl-8 pr-3 py-2 border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={currentTabAction.modal}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title={currentTabAction.label}
          >
            <span className="material-symbols-outlined text-[18px]">{currentTabAction.icon}</span>
            <span>{currentTabAction.label}</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: POOL STABLING ================= */}
      {activeTab === 'pool' && (
        <div className="space-y-6">
          {/* Quick Metrics Pool */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Pool Aktif</span>
              <div className="text-2xl font-bold text-on-surface mt-1">{pools.length} <span className="text-xs font-normal text-on-surface-variant">Lokasi</span></div>
              <span className="text-[11px] text-emerald-600 font-medium">Jawa & Banten</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Kapasitas Slot</span>
              <div className="text-2xl font-bold text-primary mt-1">
                {pools.reduce((acc, p) => acc + p.capacity, 0)} <span className="text-xs font-normal text-on-surface-variant">Slot Bus</span>
              </div>
              <span className="text-[11px] text-on-surface-variant">Maksimal Stabling Fisik</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Slot Terisi Saat Ini</span>
              <div className="text-2xl font-bold text-on-surface mt-1">
                {pools.reduce((acc, p) => acc + p.occupied, 0)} <span className="text-xs font-normal text-on-surface-variant">Bus</span>
              </div>
              <span className="text-[11px] text-primary font-semibold">
                Rerata Okupansi{' '}
                {(
                  (pools.reduce((acc, p) => acc + p.occupied, 0) /
                    Math.max(1, pools.reduce((acc, p) => acc + p.capacity, 0))) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Fasilitas Workshop</span>
              <div className="text-2xl font-bold text-on-surface mt-1">
                {pools.reduce((acc, p) => acc + p.mechanicBays, 0)} <span className="text-xs font-normal text-on-surface-variant">Bay Mekanik</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">
                {pools.reduce((acc, p) => acc + p.washBays, 0)} Bay Cuci Hidrolik
              </span>
            </div>
          </div>

          {/* DataTable Pool */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Daftar Pool Stabling Fisik Armada</h3>
                <span className="text-xs text-on-surface-variant">Monitoring kapasitas slot parkir bus, fasilitas pencucian, dan mekanik bay.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-on-surface-variant">{filteredPools.length} Data Ditampilkan</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                    <th className="py-3 px-4">Kode & Nama Pool</th>
                    <th className="py-3 px-4">Kota / Alamat</th>
                    <th className="py-3 px-4">Kapasitas Stabling</th>
                    <th className="py-3 px-4">Fasilitas Bay</th>
                    <th className="py-3 px-4">Penanggung Jawab (PIC)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredPools.length > 0 ? (
                    filteredPools.map((pool) => {
                      const occupancyPercent = Math.min(100, Math.round((pool.occupied / pool.capacity) * 100));
                      return (
                        <tr key={pool.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2 py-1 rounded-md bg-blue-50 text-primary font-mono font-bold text-[11px]">
                                {pool.code}
                              </span>
                              <div>
                                <span className="font-bold text-on-surface block text-sm">{pool.name}</span>
                                <span className="text-[11px] text-on-surface-variant">{pool.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <span className="font-semibold text-on-surface block">{pool.city}</span>
                            <span className="text-[11px] text-on-surface-variant truncate block">{pool.address}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="font-bold text-on-surface">
                                {pool.occupied} / {pool.capacity} <span className="text-[11px] text-on-surface-variant font-normal">Slot</span>
                              </span>
                              <span className="font-bold text-primary text-[11px]">{occupancyPercent}%</span>
                            </div>
                            <div className="w-32 bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  occupancyPercent > 85 ? 'bg-error' : occupancyPercent > 60 ? 'bg-primary' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${occupancyPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                              {pool.capacity - pool.occupied} Slot Kosong
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 text-[11px] text-on-surface">
                                <span className="material-symbols-outlined text-[14px] text-primary">local_car_wash</span>
                                {pool.washBays} Bay Cuci
                              </span>
                              <span className="block text-[11px] text-on-surface-variant">
                                🛠️ {pool.mechanicBays} Bay Mekanik
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-on-surface block">{pool.picName}</span>
                            <span className="text-[11px] font-mono text-primary">{pool.phone}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                pool.status === 'Aktif'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : pool.status === 'Penuh'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-error'
                              }`}
                            >
                              {pool.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleDeletePool(pool.id, pool.name)}
                              className="p-1.5 text-outline hover:text-error hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Pool"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                        Tidak ada data pool yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: DEPO & WORKSHOP ================= */}
      {activeTab === 'depo' && (
        <div className="space-y-6">
          {/* Quick Metrics Depo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Depo Sentral</span>
              <div className="text-2xl font-bold text-on-surface mt-1">{depos.length} <span className="text-xs font-normal text-on-surface-variant">Fasilitas</span></div>
              <span className="text-[11px] text-primary font-medium">Penyangga Suku Cadang</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Area Gudang</span>
              <div className="text-2xl font-bold text-primary mt-1">5.450 <span className="text-xs font-normal text-on-surface-variant">m²</span></div>
              <span className="text-[11px] text-on-surface-variant">Kapasitas Penyimpanan</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Rak Suku Cadang</span>
              <div className="text-2xl font-bold text-on-surface mt-1">
                {depos.reduce((acc, d) => acc + d.rackCount, 0)} <span className="text-xs font-normal text-on-surface-variant">Rak</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Terorganisir barcode/QR</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Tenaga Teknisi / Mekanik</span>
              <div className="text-2xl font-bold text-on-surface mt-1">
                {depos.reduce((acc, d) => acc + d.mechanicsCount, 0)} <span className="text-xs font-normal text-on-surface-variant">Mekanik</span>
              </div>
              <span className="text-[11px] text-primary font-medium">Bersertifikasi Pabrikan</span>
            </div>
          </div>

          {/* DataTable Depo */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Daftar Depo Logistik & Workshop Sentral</h3>
                <span className="text-xs text-on-surface-variant">Fasilitas logistik penyuplai suku cadang, overhaul mesin, dan perbaikan bodi karoseri.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-on-surface-variant">{filteredDepos.length} Depo Terdaftar</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                    <th className="py-3 px-4">Kode & Nama Depo</th>
                    <th className="py-3 px-4">Spesialisasi & Tipe</th>
                    <th className="py-3 px-4">Lokasi & Luas Area</th>
                    <th className="py-3 px-4">Kapasitas Rak & Tim</th>
                    <th className="py-3 px-4">Kepala Depo (PIC)</th>
                    <th className="py-3 px-4 text-center">Status Operasional</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredDepos.length > 0 ? (
                    filteredDepos.map((depo) => (
                      <tr key={depo.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-1 rounded-md bg-secondary-fixed text-primary font-mono font-bold text-[11px]">
                              {depo.code}
                            </span>
                            <div>
                              <span className="font-bold text-on-surface block text-sm">{depo.name}</span>
                              <span className="text-[11px] text-on-surface-variant">{depo.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-primary">
                            {depo.depoType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-on-surface block">{depo.city}</span>
                          <span className="text-[11px] text-on-surface-variant font-mono">Luas: {depo.areaSize}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-on-surface block">{depo.rackCount} Rak Penyimpanan</span>
                            <span className="text-[11px] text-primary font-semibold">{depo.mechanicsCount} Teknisi / Mekanik</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-on-surface block">{depo.picName}</span>
                          <span className="text-[11px] font-mono text-primary">{depo.phone}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {depo.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteDepo(depo.id, depo.name)}
                            className="p-1.5 text-outline hover:text-error hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Depo"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                        Tidak ada data depo yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: JARINGAN TRAYEK ================= */}
      {activeTab === 'trayek' && (
        <div className="space-y-6">
          {/* Quick Metrics Trayek */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Trayek Terdaftar</span>
              <div className="text-2xl font-bold text-on-surface mt-1">{trayeks.length} <span className="text-xs font-normal text-on-surface-variant">Rute</span></div>
              <span className="text-[11px] text-emerald-600 font-medium">Izin Kemenhub Lengkap</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Total Armada Terploting</span>
              <div className="text-2xl font-bold text-primary mt-1">
                {trayeks.reduce((acc, t) => acc + t.fleetCount, 0)} <span className="text-xs font-normal text-on-surface-variant">Unit Bus</span>
              </div>
              <span className="text-[11px] text-on-surface-variant">Melayani ritase aktif</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Rerata Jarak Koridor</span>
              <div className="text-2xl font-bold text-on-surface mt-1">
                {Math.round(trayeks.reduce((acc, t) => acc + t.distanceKm, 0) / Math.max(1, trayeks.length))}{' '}
                <span className="text-xs font-normal text-on-surface-variant">KM / Ritase</span>
              </div>
              <span className="text-[11px] text-primary font-medium">Lintas Trans-Jawa</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Kepatuhan Regulasi SK</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">100%</div>
              <span className="text-[11px] text-emerald-600 font-medium">Terkoneksi SPIONAM</span>
            </div>
          </div>

          {/* DataTable Trayek */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Daftar Jaringan Trayek & Rute Operasional AKAP</h3>
                <span className="text-xs text-on-surface-variant">Inventaris izin rute trayek antar kota antar provinsi, koridor jalan tol, serta batas tarif.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-on-surface-variant">{filteredTrayeks.length} Trayek Aktif</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                    <th className="py-3 px-4">Kode & Rute Trayek</th>
                    <th className="py-3 px-4">Koridor / Jalur Lintas</th>
                    <th className="py-3 px-4">Jarak & Estimasi</th>
                    <th className="py-3 px-4">Armada & Tarif</th>
                    <th className="py-3 px-4">Izin SK Kemenhub RI</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredTrayeks.length > 0 ? (
                    filteredTrayeks.map((trayek) => (
                      <tr key={trayek.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-1 rounded-md bg-blue-50 text-primary font-mono font-bold text-[11px]">
                              {trayek.routeCode}
                            </span>
                            <div>
                              <div className="font-bold text-on-surface text-sm flex items-center gap-1.5">
                                <span>{trayek.origin}</span>
                                <span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
                                <span>{trayek.destination}</span>
                              </div>
                              <span className="text-[11px] text-on-surface-variant">{trayek.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="text-on-surface font-medium leading-snug block">{trayek.corridor}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-on-surface text-sm block">{trayek.distanceKm} KM</span>
                          <span className="text-[11px] text-on-surface-variant block">Waktu: {trayek.estDuration}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-primary block">{trayek.fleetCount} Bus Dialokasikan</span>
                          <span className="text-[11px] text-on-surface font-medium block">{trayek.fareRange}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] font-semibold text-on-surface block">{trayek.skKemenhub}</span>
                          <span className="text-[10px] text-emerald-600 font-bold block">✓ Terverifikasi DJDAT</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {trayek.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteTrayek(trayek.id, trayek.routeCode)}
                            className="p-1.5 text-outline hover:text-error hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Trayek"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                        Tidak ada data trayek yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: FORM INPUT POOL BARU ================= */}
      {showPoolModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">domain</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Registrasi Pool Stabling Baru</h3>
                  <p className="text-xs text-on-surface-variant">Masukkan informasi lokasi fisik, kapasitas slot parkir bus, dan fasilitas.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPoolModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form id="pool-form" onSubmit={handleAddPool} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Nama Pool Stabling</label>
                  <input
                    required
                    value={poolForm.name}
                    onChange={(e) => setPoolForm({ ...poolForm, name: e.target.value })}
                    placeholder="Contoh: Pool Semarang Banyumanik"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kode Pool</label>
                  <input
                    required
                    value={poolForm.code}
                    onChange={(e) => setPoolForm({ ...poolForm, code: e.target.value.toUpperCase() })}
                    placeholder="Contoh: POL-SMG"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Kota / Wilayah</label>
                  <input
                    required
                    value={poolForm.city}
                    onChange={(e) => setPoolForm({ ...poolForm, city: e.target.value })}
                    placeholder="Semarang, Jateng"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Total Kapasitas Slot</label>
                  <input
                    type="number"
                    required
                    value={poolForm.capacity}
                    onChange={(e) => setPoolForm({ ...poolForm, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  required
                  value={poolForm.address}
                  onChange={(e) => setPoolForm({ ...poolForm, address: e.target.value })}
                  placeholder="Jl. Perintis Kemerdekaan No. 12, Banyumanik..."
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Jalur Cuci Armada</label>
                  <input
                    type="number"
                    value={poolForm.washBays}
                    onChange={(e) => setPoolForm({ ...poolForm, washBays: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pit Mekanik / Servis</label>
                  <input
                    type="number"
                    value={poolForm.mechanicBays}
                    onChange={(e) => setPoolForm({ ...poolForm, mechanicBays: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Nama Kepala Pool (PIC)</label>
                  <input
                    required
                    value={poolForm.picName}
                    onChange={(e) => setPoolForm({ ...poolForm, picName: e.target.value })}
                    placeholder="Nama PIC"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kontak Telepon / WA</label>
                  <input
                    required
                    value={poolForm.phone}
                    onChange={(e) => setPoolForm({ ...poolForm, phone: e.target.value })}
                    placeholder="(024) 747-8891"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>
            </form>

            {/* Footer Modal - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPoolModal(false)}
                className="px-4 py-2 bg-surface-container rounded-lg font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                form="pool-form"
                className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                Simpan Pool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: FORM INPUT DEPO BARU ================= */}
      {showDepoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">warehouse</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Registrasi Depo & Workshop Baru</h3>
                  <p className="text-xs text-on-surface-variant">Input fasilitas pusat logistik suku cadang dan overhaul kendaraan berat.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDepoModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form id="depo-form" onSubmit={handleAddDepo} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Nama Depo Fasilitas</label>
                  <input
                    required
                    value={depoForm.name}
                    onChange={(e) => setDepoForm({ ...depoForm, name: e.target.value })}
                    placeholder="Contoh: Depo Sentral Semarang"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kode Depo</label>
                  <input
                    required
                    value={depoForm.code}
                    onChange={(e) => setDepoForm({ ...depoForm, code: e.target.value.toUpperCase() })}
                    placeholder="Contoh: DPO-SMG-01"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Spesialisasi Depo</label>
                  <select
                    value={depoForm.depoType}
                    onChange={(e) => setDepoForm({ ...depoForm, depoType: e.target.value as DepoData['depoType'] })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="Logistik & Suku Cadang">Logistik & Suku Cadang</option>
                    <option value="Workshop & Overhaul">Workshop & Overhaul</option>
                    <option value="Karoseri & Repair Bodi">Karoseri & Repair Bodi</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kota / Lokasi</label>
                  <input
                    required
                    value={depoForm.city}
                    onChange={(e) => setDepoForm({ ...depoForm, city: e.target.value })}
                    placeholder="Semarang, Jateng"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Luas Area</label>
                  <input
                    required
                    value={depoForm.areaSize}
                    onChange={(e) => setDepoForm({ ...depoForm, areaSize: e.target.value })}
                    placeholder="3.200 m²"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Jumlah Rak</label>
                  <input
                    type="number"
                    required
                    value={depoForm.rackCount}
                    onChange={(e) => setDepoForm({ ...depoForm, rackCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Jumlah Mekanik</label>
                  <input
                    type="number"
                    required
                    value={depoForm.mechanicsCount}
                    onChange={(e) => setDepoForm({ ...depoForm, mechanicsCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Kepala Depo (Foreman)</label>
                  <input
                    required
                    value={depoForm.picName}
                    onChange={(e) => setDepoForm({ ...depoForm, picName: e.target.value })}
                    placeholder="Nama Kepala Depo"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kontak Telepon</label>
                  <input
                    required
                    value={depoForm.phone}
                    onChange={(e) => setDepoForm({ ...depoForm, phone: e.target.value })}
                    placeholder="(024) 850-2219"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Status Operasional</label>
                <select
                  value={depoForm.status}
                  onChange={(e) => setDepoForm({ ...depoForm, status: e.target.value as DepoData['status'] })}
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                >
                  <option value="Operasional 24 Jam">Operasional 24 Jam</option>
                  <option value="Shift Terjadwal">Shift Terjadwal</option>
                  <option value="Renovasi">Renovasi</option>
                </select>
              </div>
            </form>

            {/* Footer Modal - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDepoModal(false)}
                className="px-4 py-2 bg-surface-container rounded-lg font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                form="depo-form"
                className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                Simpan Depo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: FORM INPUT TRAYEK BARU ================= */}
      {showTrayekModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">alt_route</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Pendaftaran Jaringan Trayek Baru</h3>
                  <p className="text-xs text-on-surface-variant">Registrasi rute AKAP, izin SK Kemenhub RI, dan koridor jalan tol.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTrayekModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form id="trayek-form" onSubmit={handleAddTrayek} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Kode Trayek</label>
                <input
                  required
                  value={trayekForm.routeCode}
                  onChange={(e) => setTrayekForm({ ...trayekForm, routeCode: e.target.value.toUpperCase() })}
                  placeholder="Contoh: TRY-JKT-SMG-05"
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Titik Keberangkatan (Origin)</label>
                  <input
                    required
                    value={trayekForm.origin}
                    onChange={(e) => setTrayekForm({ ...trayekForm, origin: e.target.value })}
                    placeholder="Jakarta (Pulogebang)"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Titik Tujuan (Destination)</label>
                  <input
                    required
                    value={trayekForm.destination}
                    onChange={(e) => setTrayekForm({ ...trayekForm, destination: e.target.value })}
                    placeholder="Semarang (Banyumanik)"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Koridor Jalan Tol / Arteri</label>
                <input
                  required
                  value={trayekForm.corridor}
                  onChange={(e) => setTrayekForm({ ...trayekForm, corridor: e.target.value })}
                  placeholder="Tol Trans Jawa (Cipali — Palimanan — Krapyak)"
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Jarak (Km)</label>
                  <input
                    type="number"
                    required
                    value={trayekForm.distanceKm}
                    onChange={(e) => setTrayekForm({ ...trayekForm, distanceKm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Estimasi Waktu</label>
                  <input
                    required
                    value={trayekForm.estDuration}
                    onChange={(e) => setTrayekForm({ ...trayekForm, estDuration: e.target.value })}
                    placeholder="6.5 Jam"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Alokasi Armada</label>
                  <input
                    type="number"
                    required
                    value={trayekForm.fleetCount}
                    onChange={(e) => setTrayekForm({ ...trayekForm, fleetCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Rentang Tarif Tiket</label>
                  <input
                    required
                    value={trayekForm.fareRange}
                    onChange={(e) => setTrayekForm({ ...trayekForm, fareRange: e.target.value })}
                    placeholder="Rp 240.000 - Rp 380.000"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Nomor SK Izin Kemenhub</label>
                  <input
                    required
                    value={trayekForm.skKemenhub}
                    onChange={(e) => setTrayekForm({ ...trayekForm, skKemenhub: e.target.value })}
                    placeholder="SK.1092/AJ.205/DJPD/2024"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Status Trayek</label>
                <select
                  value={trayekForm.status}
                  onChange={(e) => setTrayekForm({ ...trayekForm, status: e.target.value as TrayekData['status'] })}
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                >
                  <option value="Aktif Resmi">Aktif Resmi</option>
                  <option value="Musiman">Musiman (Lebaran / Nataru)</option>
                  <option value="Tahap Evaluasi">Tahap Evaluasi</option>
                </select>
              </div>
            </form>

            {/* Footer Modal - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTrayekModal(false)}
                className="px-4 py-2 bg-surface-container rounded-lg font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                form="trayek-form"
                className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                Simpan Trayek
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
