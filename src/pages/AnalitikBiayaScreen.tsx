import React, { useState, useMemo } from 'react';
import { mockCostRecords, mockRebodySimulations } from '../data/mockCostAnalytics';
import { FleetCostRecord, RebodySimulationItem } from '../types';

// Helper format Rupiah
const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

export const AnalitikBiayaScreen: React.FC = () => {
  // Main Data States
  const [costRecords, setCostRecords] = useState<FleetCostRecord[]>(mockCostRecords);
  const [simulations, setSimulations] = useState<RebodySimulationItem[]>(mockRebodySimulations);

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState<'biaya' | 'simulasi' | 'struktur'>('biaya');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterEfficiency, setFilterEfficiency] = useState<'all' | 'Efisien' | 'Normal' | 'Boros (Perlu Evaluasi)'>('all');

  // Modal Visibility States
  const [showSimulationModal, setShowSimulationModal] = useState<boolean>(false);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ================= Form States =================

  // 1. Form Simulasi Peremajaan (Re-Body vs Beli Baru)
  const [simForm, setSimForm] = useState({
    busId: 'TY-044',
    plate: 'L 7801 UA',
    chassis: 'Mercedes-Benz OH 1626 L Air Suspension',
    chassisYear: 2017,
    currentOdometer: 742000,
    targetKaroseri: 'Adiputro - Jetbus 5 MHD Single Glass',
    rebodyCost: 780000000,
    engineRefreshCost: 120000000,
    newBusCost: 2450000000,
    extendedLifeYears: 6,
    analyst: 'Faisal Rahman (Fleet Financial Analyst)',
    notes: 'Kajian kelayakan teknis dan penghematan modal capex operasional.'
  });

  // 2. Form Pencatatan Realisasi Biaya Operasional Armada
  const [expenseForm, setExpenseForm] = useState({
    busId: 'TY-082',
    plate: 'B 7199 UGA',
    route: 'Jakarta - Surabaya (Via Tol Trans Jawa)',
    period: 'September 2024',
    distanceKm: 12500,
    fuelCost: 39000000,
    fuelLiters: 3680,
    partsCost: 10500000,
    serviceCost: 3800000,
    tireCost: 4500000,
    tollCost: 10000000,
    crewCost: 11250000,
    notes: 'Pencatatan realisasi biaya bulanan.'
  });

  // ================= Calculated Fields for Forms =================

  // Simulasi Re-Body Real-time Calculations
  const simTotalCapex = Number(simForm.rebodyCost) + Number(simForm.engineRefreshCost);
  const simCapexSaving = Number(simForm.newBusCost) - simTotalCapex;
  const simSavingPercent = simForm.newBusCost > 0 ? ((simCapexSaving / simForm.newBusCost) * 100).toFixed(1) : '0';
  const simEstCostPerKm = Math.round(5650 + (simTotalCapex / (Number(simForm.extendedLifeYears) * 150000)));
  const simRoiMonths = Math.round((simTotalCapex / (simCapexSaving / (Number(simForm.extendedLifeYears) * 12))));

  // Expense Form Real-time Calculations
  const expTotalCost =
    Number(expenseForm.fuelCost) +
    Number(expenseForm.partsCost) +
    Number(expenseForm.serviceCost) +
    Number(expenseForm.tireCost) +
    Number(expenseForm.tollCost) +
    Number(expenseForm.crewCost);

  const expCostPerKm = expenseForm.distanceKm > 0 ? Math.round(expTotalCost / Number(expenseForm.distanceKm)) : 0;
  const expFuelRatio = expenseForm.fuelLiters > 0 ? (Number(expenseForm.distanceKm) / Number(expenseForm.fuelLiters)).toFixed(2) : '0';

  // ================= Handlers =================

  // Buka Modal Simulasi Re-Body untuk Armada Tertentu dari Tabel
  const handleOpenSimForBus = (record: FleetCostRecord) => {
    setSimForm({
      ...simForm,
      busId: record.busId,
      plate: record.plate,
      notes: `Simulasi kelayakan peremajaan armada ${record.busId} karena biaya riil saat ini mencapai ${formatRupiah(record.costPerKm)}/KM.`
    });
    setShowSimulationModal(true);
  };

  // Submit Simulasi Re-Body
  const handleSaveSimulation = (e: React.FormEvent) => {
    e.preventDefault();

    let recommendation: 'Sangat Direkomendasikan Re-Body' | 'Layak Re-Body' | 'Disarankan Beli Baru' = 'Layak Re-Body';
    if (simCapexSaving >= 1400000000 && simEstCostPerKm < 6500) {
      recommendation = 'Sangat Direkomendasikan Re-Body';
    } else if (simCapexSaving < 800000000) {
      recommendation = 'Disarankan Beli Baru';
    }

    const newSim: RebodySimulationItem = {
      id: `SIM-${String(simulations.length + 1).padStart(3, '0')}`,
      busId: simForm.busId,
      plate: simForm.plate,
      chassis: simForm.chassis,
      chassisYear: Number(simForm.chassisYear),
      currentOdometer: Number(simForm.currentOdometer),
      targetKaroseri: simForm.targetKaroseri,
      rebodyCost: Number(simForm.rebodyCost),
      engineRefreshCost: Number(simForm.engineRefreshCost),
      totalRebodyCapex: simTotalCapex,
      newBusCost: Number(simForm.newBusCost),
      capexSaving: simCapexSaving,
      extendedLifeYears: Number(simForm.extendedLifeYears),
      estCostPerKm: simEstCostPerKm,
      recommendation,
      roiMonths: Math.max(6, simRoiMonths),
      analyst: simForm.analyst,
      simulationDate: new Date().toISOString().slice(0, 10),
      notes: simForm.notes
    };

    setSimulations([newSim, ...simulations]);
    setShowSimulationModal(false);
    setActiveTab('simulasi');
    triggerToast(`Studi kelayakan Re-Body untuk ${newSim.busId} tersimpan (Hemat Capex: ${formatRupiah(newSim.capexSaving)}).`);
  };

  // Submit Pencatatan Biaya Operasional
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();

    let efficiencyStatus: 'Efisien' | 'Normal' | 'Boros (Perlu Evaluasi)' = 'Normal';
    let efficiencyBadge = 'bg-blue-100 text-blue-800 border border-blue-200';

    if (expCostPerKm < 6200) {
      efficiencyStatus = 'Efisien';
      efficiencyBadge = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    } else if (expCostPerKm > 7500) {
      efficiencyStatus = 'Boros (Perlu Evaluasi)';
      efficiencyBadge = 'bg-red-100 text-error border border-red-200';
    }

    const newRecord: FleetCostRecord = {
      id: `CST-${String(costRecords.length + 1).padStart(3, '0')}`,
      busId: expenseForm.busId,
      plate: expenseForm.plate,
      route: expenseForm.route,
      period: expenseForm.period,
      distanceKm: Number(expenseForm.distanceKm),
      fuelCost: Number(expenseForm.fuelCost),
      fuelLiters: Number(expenseForm.fuelLiters),
      partsCost: Number(expenseForm.partsCost),
      serviceCost: Number(expenseForm.serviceCost),
      tireCost: Number(expenseForm.tireCost),
      tollCost: Number(expenseForm.tollCost),
      crewCost: Number(expenseForm.crewCost),
      totalCost: expTotalCost,
      costPerKm: expCostPerKm,
      fuelConsumptionRatio: `1 : ${expFuelRatio} km/L`,
      efficiencyStatus,
      efficiencyBadge,
      notes: expenseForm.notes
    };

    setCostRecords([newRecord, ...costRecords]);
    setShowExpenseModal(false);
    triggerToast(`Biaya operasional armada ${newRecord.busId} berhasil dicatat (${formatRupiah(newRecord.costPerKm)}/KM).`);
  };

  // ================= Kalkulasi Metrik Global =================
  const metrics = useMemo(() => {
    const totalDist = costRecords.reduce((sum, r) => sum + r.distanceKm, 0);
    const totalCost = costRecords.reduce((sum, r) => sum + r.totalCost, 0);
    const totalFuel = costRecords.reduce((sum, r) => sum + r.fuelCost, 0);
    const avgCostPerKm = totalDist > 0 ? Math.round(totalCost / totalDist) : 0;
    const fuelSharePercent = totalCost > 0 ? ((totalFuel / totalCost) * 100).toFixed(1) : '0';
    const evaluateUnits = costRecords.filter((r) => r.efficiencyStatus === 'Boros (Perlu Evaluasi)').length;

    return { totalDist, totalCost, totalFuel, avgCostPerKm, fuelSharePercent, evaluateUnits };
  }, [costRecords]);

  // Filter Data Biaya Armada
  const filteredRecords = useMemo(() => {
    return costRecords.filter((r) => {
      const matchesSearch =
        r.busId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.route.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEfficiency =
        filterEfficiency === 'all' || r.efficiencyStatus === filterEfficiency;

      return matchesSearch && matchesEfficiency;
    });
  }, [costRecords, searchQuery, filterEfficiency]);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Utama & Tombol Aksi Finansial */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-on-surface-variant mb-1">
            <span>Tata Kelola & Finansial</span>
            <span>•</span>
            <span className="text-primary font-bold">Analitik Biaya & Siklus Hidup (TCO)</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Analitik Biaya per KM & Kelayakan Re-Body</h1>
          <p className="text-xs text-on-surface-variant">
            Evaluasi efisiensi biaya riil per kilometer tempuh armada dan kajian kelayakan investasi peremajaan (Re-Body vs Beli Baru).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Catat Biaya Operasional */}
          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3.5 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            + Catat Biaya Operasional
          </button>

          {/* Tombol Simulasi Re-Body */}
          <button
            onClick={() => setShowSimulationModal(true)}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
            + Simulasi Hitung Re-Body
          </button>
        </div>
      </div>

      {/* Kartu Ringkasan Metrik Finansial (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant uppercase font-bold">Avg Fleet Cost / KM</span>
            <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-1">
            {formatRupiah(metrics.avgCostPerKm)}{' '}
            <span className="text-xs font-normal text-on-surface-variant">/ KM</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Benchmark SLA: Rp 6.400/KM</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant uppercase font-bold">Akumulasi OPEX YTD</span>
            <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-1">
            Rp {(metrics.totalCost / 1000000000).toFixed(2)} Miliar
          </div>
          <span className="text-[11px] text-primary font-semibold">
            Total Tempuh {(metrics.totalDist / 1000).toFixed(1)}K KM
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant uppercase font-bold">Porsi BBM Solar</span>
            <span className="material-symbols-outlined text-amber-600 text-[20px]">local_gas_station</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-1">
            {metrics.fuelSharePercent}% <span className="text-xs font-normal text-on-surface-variant">dari Total OPEX</span>
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">Komponen Biaya Terbesar</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant uppercase font-bold">Unit Perlu Evaluasi</span>
            <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          </div>
          <div className="text-2xl font-bold text-error mt-1">{metrics.evaluateUnits} Unit</div>
          <span className="text-[11px] text-error font-semibold">Biaya &gt; Rp 7.500/KM (Kandidat Re-Body)</span>
        </div>
      </div>

      {/* Navigasi Sub-Tab Analitik */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('biaya')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'biaya'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">table_chart</span>
          Biaya Riil per KM & Analisis Armada ({costRecords.length})
        </button>

        <button
          onClick={() => setActiveTab('simulasi')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'simulasi'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calculate</span>
          Simulasi Peremajaan (Re-Body vs Baru) ({simulations.length})
        </button>

        <button
          onClick={() => setActiveTab('struktur')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'struktur'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">pie_chart</span>
          Struktur Komponen Biaya & TCO Benchmark
        </button>
      </div>

      {/* ================= TAB 1: BIAYA RIIL PER KM ================= */}
      {activeTab === 'biaya' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {/* Bar Pencarian & Filter */}
          <div className="p-4 bg-surface-container-low flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-surface-container">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor lambung, plat, atau rute trayek..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-surface-container p-0.5 rounded-lg">
                <button
                  onClick={() => setFilterEfficiency('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterEfficiency === 'all' ? 'bg-primary text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Semua ({costRecords.length})
                </button>
                <button
                  onClick={() => setFilterEfficiency('Efisien')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterEfficiency === 'Efisien' ? 'bg-emerald-700 text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Efisien
                </button>
                <button
                  onClick={() => setFilterEfficiency('Normal')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterEfficiency === 'Normal' ? 'bg-blue-700 text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setFilterEfficiency('Boros (Perlu Evaluasi)')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterEfficiency === 'Boros (Perlu Evaluasi)' ? 'bg-error text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Boros ({metrics.evaluateUnits})
                </button>
              </div>
            </div>
          </div>

          {/* Datatable Realisasi Biaya */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                  <th className="py-3 px-4">Armada & Rute Trayek</th>
                  <th className="py-3 px-4 text-center">Jarak Tempuh</th>
                  <th className="py-3 px-4 text-right">Beban BBM Solar</th>
                  <th className="py-3 px-4 text-right">Servis & Sparepart</th>
                  <th className="py-3 px-4 text-right">Tol, Ban & Crew</th>
                  <th className="py-3 px-4 text-right">Total Biaya</th>
                  <th className="py-3 px-4 text-center">Cost per KM</th>
                  <th className="py-3 px-4 text-center">Efisiensi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-surface-container-low/50 transition-colors ${
                      r.efficiencyStatus === 'Boros (Perlu Evaluasi)' ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary text-sm">{r.busId}</span>
                        <span className="font-bold text-on-surface">{r.plate}</span>
                      </div>
                      <span className="text-[11px] text-outline block mt-0.5">{r.route}</span>
                      <span className="text-[10px] text-on-surface-variant block font-mono">Periode: {r.period}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="font-bold text-on-surface block text-sm">{r.distanceKm.toLocaleString('id-ID')} KM</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">{r.fuelConsumptionRatio}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className="font-semibold text-on-surface block">{formatRupiah(r.fuelCost)}</span>
                      <span className="text-[10px] text-on-surface-variant block">{r.fuelLiters.toLocaleString('id-ID')} Liter Solar</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className="font-semibold text-on-surface block">{formatRupiah(r.partsCost + r.serviceCost)}</span>
                      <span className="text-[10px] text-on-surface-variant block">Part: {formatRupiah(r.partsCost)}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className="font-semibold text-on-surface block">{formatRupiah(r.tollCost + r.tireCost + r.crewCost)}</span>
                      <span className="text-[10px] text-on-surface-variant block">Tol: {formatRupiah(r.tollCost)}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-on-surface text-sm">
                      {formatRupiah(r.totalCost)}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <span
                        className={`text-sm font-bold block ${
                          r.costPerKm > 7500 ? 'text-error' : r.costPerKm < 6200 ? 'text-emerald-700' : 'text-primary'
                        }`}
                      >
                        {formatRupiah(r.costPerKm)}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">/ KM</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.efficiencyBadge}`}>
                        {r.efficiencyStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenSimForBus(r)}
                        className="px-2.5 py-1 bg-surface-container hover:bg-primary hover:text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">calculate</span>
                        Simulasi Re-Body
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: DAFTAR SIMULASI RE-BODY ================= */}
      {activeTab === 'simulasi' && (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-4 bg-surface-container-low flex justify-between items-center border-b border-surface-container">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Kajian Kelayakan Peremajaan Armada (Re-Body Karoseri)</h3>
                <p className="text-xs text-on-surface-variant">Studi komparasi investasi Capex Re-Body sasis eksisting versus pengadaan unit bus baru.</p>
              </div>
              <button
                onClick={() => setShowSimulationModal(true)}
                className="px-3.5 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                + Buat Kajian Simulasi Baru
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                    <th className="py-3 px-4">No. Kajian & Tanggal</th>
                    <th className="py-3 px-4">Armada & Tipe Sasis</th>
                    <th className="py-3 px-4">Bodi Karoseri Target</th>
                    <th className="py-3 px-4 text-right">Total Capex Re-Body</th>
                    <th className="py-3 px-4 text-right">Harga Unit Baru</th>
                    <th className="py-3 px-4 text-right">Hemat Capex</th>
                    <th className="py-3 px-4 text-center">Perpanjangan & ROI</th>
                    <th className="py-3 px-4 text-center">Rekomendasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {simulations.map((sim) => (
                    <tr key={sim.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-primary block">{sim.id}</span>
                        <span className="text-[11px] text-on-surface-variant">{sim.simulationDate}</span>
                        <span className="text-[10px] text-outline block">{sim.analyst}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary">{sim.busId}</span>
                          <span className="font-bold text-on-surface">{sim.plate}</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant block">{sim.chassis} ({sim.chassisYear})</span>
                        <span className="text-[10px] text-outline block font-mono">Odo: {sim.currentOdometer.toLocaleString('id-ID')} KM</span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-on-surface">
                        <span className="block text-primary">{sim.targetKaroseri}</span>
                        {sim.notes && <span className="text-[10px] text-on-surface-variant block font-normal mt-0.5">{sim.notes}</span>}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-on-surface block text-sm">{formatRupiah(sim.totalRebodyCapex)}</span>
                        <span className="text-[10px] text-on-surface-variant block">Bodi: {formatRupiah(sim.rebodyCost)}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-on-surface-variant">
                        {formatRupiah(sim.newBusCost)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-emerald-700 block text-sm">+{formatRupiah(sim.capexSaving)}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          Hemat {((sim.capexSaving / sim.newBusCost) * 100).toFixed(1)}% Capex
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-primary block">+{sim.extendedLifeYears} Tahun Operasi</span>
                        <span className="text-[11px] text-on-surface-variant font-mono">Payback: {sim.roiMonths} Bulan</span>
                        <span className="text-[10px] text-emerald-700 block font-mono">Est Cost: {formatRupiah(sim.estCostPerKm)}/KM</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            sim.recommendation.includes('Sangat')
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : sim.recommendation.includes('Layak')
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {sim.recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: STRUKTUR KOMPONEN BIAYA ================= */}
      {activeTab === 'struktur' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-outline tracking-wider">Opsi 1: Pembelian Unit Baru Lengkap</span>
              <span className="material-symbols-outlined text-outline">shopping_bag</span>
            </div>
            <div className="text-3xl font-bold text-on-surface">Rp 2,45 Miliar</div>
            <p className="text-xs text-on-surface-variant">Investasi pengadaan sasis baru + karoseri baru grade eksekutif bus AKAP.</p>

            <div className="text-xs text-on-surface-variant space-y-2 pt-3 border-t border-surface-container">
              <div className="flex justify-between"><span>Beban Depresiasi / Tahun</span><span className="font-bold text-on-surface">Rp 400 Juta/Thn</span></div>
              <div className="flex justify-between"><span>Estimasi Biaya Operasional / KM</span><span className="font-bold text-emerald-700">Rp 5.650 / KM</span></div>
              <div className="flex justify-between"><span>Masa Pakai Efektif</span><span className="font-bold text-on-surface">8 - 10 Tahun</span></div>
              <div className="flex justify-between"><span>Pemanfaatan Modal (Capex)</span><span className="font-bold text-on-surface">100% Modal Tunai / Leasing</span></div>
            </div>
          </div>

          <div className="bg-blue-50/60 p-5 rounded-xl shadow-sm border-2 border-primary/30 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-primary tracking-wider">Opsi 2: Re-Body Karoseri Baru (Rekomendasi)</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">Teruji Efisien</span>
            </div>
            <div className="text-3xl font-bold text-primary">Rp 900 Juta</div>
            <p className="text-xs text-on-surface-variant">Mempertahankan sasis utama yang sehat, mengganti total cangkang bodi, kaca, AC, dan interior baru.</p>

            <div className="text-xs text-on-surface-variant space-y-2 pt-3 border-t border-blue-200">
              <div className="flex justify-between"><span>Beban Depresiasi / Tahun</span><span className="font-bold text-emerald-700">Rp 150 Juta/Thn (-62.5%)</span></div>
              <div className="flex justify-between"><span>Perpanjangan Usia Operasional</span><span className="font-bold text-primary">+ 5 s/d 7 Tahun Operasi</span></div>
              <div className="flex justify-between"><span>Penghematan Modal (Capex Saving)</span><span className="font-bold text-emerald-700">Hemat Rp 1,55 Miliar / Unit</span></div>
              <div className="flex justify-between"><span>Titik Impas (Payback Period)</span><span className="font-bold text-emerald-700">14 - 18 Bulan Operasi</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MODAL SIMULASI PEREMAJAAN (RE-BODY VS BARU)                            */}
      {/* ========================================================================= */}
      {showSimulationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">calculate</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Simulasi Kelayakan Re-Body Karoseri vs Beli Baru</h3>
                  <p className="text-xs text-on-surface-variant">Analisis TCO, penghematan capex modal, dan proyeksi biaya per KM armada.</p>
                </div>
              </div>
              <button
                onClick={() => setShowSimulationModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="rebody-sim-form" onSubmit={handleSaveSimulation} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {/* Seksi Identitas Armada Target */}
              <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">1. Identitas Armada Bus Target</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">No. Lambung Armada *</label>
                    <input
                      required
                      value={simForm.busId}
                      onChange={(e) => setSimForm({ ...simForm, busId: e.target.value })}
                      placeholder="Contoh: TY-044"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Polisi (Plat) *</label>
                    <input
                      required
                      value={simForm.plate}
                      onChange={(e) => setSimForm({ ...simForm, plate: e.target.value })}
                      placeholder="Contoh: L 7801 UA"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tahun Produksi Sasis *</label>
                    <input
                      type="number"
                      required
                      value={simForm.chassisYear}
                      onChange={(e) => setSimForm({ ...simForm, chassisYear: parseInt(e.target.value, 10) || 2017 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-center font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tipe Sasis Kendaraan</label>
                    <select
                      value={simForm.chassis}
                      onChange={(e) => setSimForm({ ...simForm, chassis: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    >
                      <option value="Mercedes-Benz OH 1626 L Air Suspension">Mercedes-Benz OH 1626 L Air Suspension</option>
                      <option value="Scania K410IB 6x2*4 Opticruise">Scania K410IB 6x2*4 Opticruise</option>
                      <option value="Hino RM280 Space Frame">Hino RM280 Space Frame</option>
                      <option value="Hino RK8 R260 Leaf Spring">Hino RK8 R260 Leaf Spring</option>
                      <option value="Volvo B11R 430HP 6x2">Volvo B11R 430HP 6x2</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Odometer Tempuh Saat Ini (KM)</label>
                    <input
                      type="number"
                      value={simForm.currentOdometer}
                      onChange={(e) => setSimForm({ ...simForm, currentOdometer: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi Biaya Re-body */}
              <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">2. Biaya Re-Body Karoseri Baru</span>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Pilihan Karoseri & Varian Bodi *</label>
                  <select
                    value={simForm.targetKaroseri}
                    onChange={(e) => setSimForm({ ...simForm, targetKaroseri: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                  >
                    <option value="Adiputro - Jetbus 5 MHD Single Glass">Adiputro - Jetbus 5 MHD Single Glass</option>
                    <option value="Adiputro - Jetbus 5 SHD Double Glass">Adiputro - Jetbus 5 SHD Double Glass</option>
                    <option value="Laksana - Legacy SR3 Suites Class (Sleeper)">Laksana - Legacy SR3 Suites Class (Sleeper)</option>
                    <option value="Laksana - Legacy SR3 Neo HD Prime">Laksana - Legacy SR3 Neo HD Prime</option>
                    <option value="Tentrem - Avante H8 Grand Captain">Tentrem - Avante H8 Grand Captain</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Biaya Bodi Baru (Rp) *</label>
                    <input
                      type="number"
                      required
                      value={simForm.rebodyCost}
                      onChange={(e) => setSimForm({ ...simForm, rebodyCost: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold text-right"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Refresh Mesin/Kaki2 (Rp)</label>
                    <input
                      type="number"
                      value={simForm.engineRefreshCost}
                      onChange={(e) => setSimForm({ ...simForm, engineRefreshCost: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tambahan Usia (Tahun) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={simForm.extendedLifeYears}
                      onChange={(e) => setSimForm({ ...simForm, extendedLifeYears: parseInt(e.target.value, 10) || 5 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi Komparasi Beli Baru & Kalkulator Finansial */}
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border-2 border-primary/40 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">3. Hasil Komparasi & Kalkulasi Finansial</span>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Estimasi Harga Pembelian Unit Baru Lengkap (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={simForm.newBusCost}
                    onChange={(e) => setSimForm({ ...simForm, newBusCost: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold text-right"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-center">
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant block font-medium">Total Capex Re-Body</span>
                    <span className="font-bold text-sm text-primary block mt-0.5">{formatRupiah(simTotalCapex)}</span>
                  </div>

                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[10px] text-emerald-700 block font-bold">Hemat Modal (Saving)</span>
                    <span className="font-bold text-sm text-emerald-700 block mt-0.5">+{formatRupiah(simCapexSaving)}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{simSavingPercent}% Lebih Hemat</span>
                  </div>

                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant block font-medium">Payback / Titik Impas</span>
                    <span className="font-bold text-sm text-on-surface block mt-0.5">{Math.max(6, simRoiMonths)} Bulan</span>
                    <span className="text-[10px] text-on-surface-variant">Est: {formatRupiah(simEstCostPerKm)}/KM</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Analis Finansial PIC *</label>
                  <input
                    required
                    value={simForm.analyst}
                    onChange={(e) => setSimForm({ ...simForm, analyst: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Catatan Tambahan Kelayakan</label>
                  <input
                    value={simForm.notes}
                    onChange={(e) => setSimForm({ ...simForm, notes: e.target.value })}
                    placeholder="Sasis sehat tanpa retak, konversi sleeper class..."
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSimulationModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="rebody-sim-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan Hasil Kajian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL PENCATATAN REALISASI BIAYA OPERASIONAL                          */}
      {/* ========================================================================= */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Pencatatan Biaya Operasional Riil Armada</h3>
                  <p className="text-xs text-on-surface-variant">Input komponen beban biaya perjalanan dan hitung biaya riil per KM tempuh.</p>
                </div>
              </div>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="expense-log-form" onSubmit={handleSaveExpense} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Nomor Lambung Armada *</label>
                  <input
                    required
                    value={expenseForm.busId}
                    onChange={(e) => setExpenseForm({ ...expenseForm, busId: e.target.value })}
                    placeholder="Contoh: TY-082"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Nomor Polisi (Plat) *</label>
                  <input
                    required
                    value={expenseForm.plate}
                    onChange={(e) => setExpenseForm({ ...expenseForm, plate: e.target.value })}
                    placeholder="Contoh: B 7199 UGA"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Periode Pelaporan *</label>
                  <input
                    required
                    value={expenseForm.period}
                    onChange={(e) => setExpenseForm({ ...expenseForm, period: e.target.value })}
                    placeholder="Contoh: September 2024"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Rute Trayek Utama *</label>
                  <input
                    required
                    value={expenseForm.route}
                    onChange={(e) => setExpenseForm({ ...expenseForm, route: e.target.value })}
                    placeholder="Contoh: Jakarta - Surabaya (Tol Trans Jawa)"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Total Jarak Tempuh Aktual (KM) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expenseForm.distanceKm}
                    onChange={(e) => setExpenseForm({ ...expenseForm, distanceKm: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Rincian Komponen Biaya */}
              <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">Rincian Komponen Beban Biaya (IDR)</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Biaya BBM Solar (Rp) *</label>
                    <input
                      type="number"
                      required
                      value={expenseForm.fuelCost}
                      onChange={(e) => setExpenseForm({ ...expenseForm, fuelCost: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Konsumsi Solar (Liter)</label>
                    <input
                      type="number"
                      value={expenseForm.fuelLiters}
                      onChange={(e) => setExpenseForm({ ...expenseForm, fuelLiters: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Biaya Suku Cadang Gudang (Rp)</label>
                    <input
                      type="number"
                      value={expenseForm.partsCost}
                      onChange={(e) => setExpenseForm({ ...expenseForm, partsCost: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Biaya Jasa Servis Mekanik (Rp)</label>
                    <input
                      type="number"
                      value={expenseForm.serviceCost}
                      onChange={(e) => setExpenseForm({ ...expenseForm, serviceCost: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Biaya Alokasi Ban (Rp)</label>
                    <input
                      type="number"
                      value={expenseForm.tireCost}
                      onChange={(e) => setExpenseForm({ ...expenseForm, tireCost: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tarif Tol & Retribusi (Rp)</label>
                    <input
                      type="number"
                      value={expenseForm.tollCost}
                      onChange={(e) => setExpenseForm({ ...expenseForm, tollCost: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Uang Jalan / Gaji Kru (Rp)</label>
                    <input
                      type="number"
                      value={expenseForm.crewCost}
                      onChange={(e) => setExpenseForm({ ...expenseForm, crewCost: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                </div>

                {/* Ringkasan Real-Time */}
                <div className="p-3 bg-surface-container rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-on-surface-variant block font-medium">Total Biaya Operasional:</span>
                    <span className="font-bold text-sm font-mono text-on-surface">{formatRupiah(expTotalCost)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-on-surface-variant block font-medium">Kalkulasi Biaya per KM:</span>
                    <span
                      className={`font-bold text-base font-mono ${
                        expCostPerKm > 7500 ? 'text-error' : expCostPerKm < 6200 ? 'text-emerald-700' : 'text-primary'
                      }`}
                    >
                      {formatRupiah(expCostPerKm)} / KM
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Catatan Tambahan Operasional</label>
                <input
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  placeholder="Kondisi jalur macet, kenaikan harga solar dexlite, perbaikan darurat..."
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="expense-log-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan Biaya Operasional
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
