import React, { useState, useMemo } from 'react';
import { mockHandoverRecords, mockPoolFleetStatus } from '../data/mockHandover';
import { HandoverRecordItem } from '../types';

export const DispatchSerahTerimaScreen: React.FC = () => {
  // Main Data States
  const [records, setRecords] = useState<HandoverRecordItem[]>(mockHandoverRecords);
  const [pools, setPools] = useState(mockPoolFleetStatus);

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState<'bastk' | 'reconciliation' | 'pool'>('bastk');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modal Visibility States
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState<boolean>(false);
  const [showMutationModal, setShowMutationModal] = useState<boolean>(false);
  const [showPrintBASTKModal, setShowPrintBASTKModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<HandoverRecordItem | null>(null);

  // Quick bus inventory for selection
  const busFleetOptions = [
    { id: 'TY-088', plate: 'B 7942 KGA', chassis: 'Scania K410IB 6x2*4 Opticruise', type: 'Double Decker 34 Seat' },
    { id: 'TY-044', plate: 'L 7801 UA', chassis: 'Mercedes-Benz OH 1626 L Air Suspension', type: 'Executive 28 Seat' },
    { id: 'TY-104', plate: 'B 7201 UGA', chassis: 'Scania K410IB 6x2*4 Opticruise', type: 'Sleeper Suite 22 Seat' },
    { id: 'TY-015', plate: 'B 7102 SGA', chassis: 'Volvo B11R 430HP 6x2', type: 'Double Decker 42 Seat' },
    { id: 'TY-021', plate: 'AD 1880 CF', chassis: 'Hino RM280 Space Frame', type: 'Super Executive 28 Seat' },
    { id: 'TY-067', plate: 'B 7331 TGA', chassis: 'Mercedes-Benz O 500 RS 1836', type: 'Executive Plus 30 Seat' }
  ];

  // Available Pools
  const poolOptions = [
    'Pool Pusat Pulogebang (Jakarta Timur)',
    'Pool Surabaya Waru (Sidoarjo)',
    'Pool Solo Tirtonadi (Surakarta)',
    'Pool Tangerang Poris Plawad',
    'Pool Yogyakarta Giwangan',
    'Pool Malang Arjosari'
  ];

  // ================= 1. Form Check-In State =================
  const [checkInForm, setCheckInForm] = useState({
    bastkNumber: `BASTK-2024-${String(records.length + 989)}`,
    busId: 'TY-088',
    plate: 'B 7942 KGA',
    chassis: 'Scania K410IB 6x2*4 Opticruise',
    originPool: 'Pool Surabaya Waru (Sidoarjo)',
    destinationPool: 'Pool Pusat Pulogebang (Jakarta Timur)',
    date: new Date().toISOString().slice(0, 10),
    time: '08:30 WIB',
    driverName: 'Bambang Sutrisno',
    coDriverName: 'Agus Prasetyo',
    dispatcherName: 'Rudi Haryanto (Dispatcher Ramp)',
    canbusOdometer: 218488,
    physicalOdometer: 218490,
    fuelLevelPercent: 35,
    fuelLiters: 140,
    adBlueLevel: '75% (Aman)',
    cabinCleanliness: 'Standar' as 'Sangat Bersih' | 'Standar' | 'Kotor (Perlu Cuci)',
    toiletStatus: 'Perlu Kuras & Isi Air' as 'Bersih & Air Penuh' | 'Perlu Kuras & Isi Air' | 'Tidak Ada Toilet',
    safetyItemsComplete: true,
    documentsComplete: true,
    passengerAmenitiesCount: '34 Selimut & 34 Headset',
    driverComplaint: '',
    handoverStatus: 'Masuk Cuci & Sanitasi' as 'Ready / Siap Jalan' | 'Masuk Cuci & Sanitasi' | 'Rujuk Workshop (SPK)',
    notes: 'Armada tiba di ramp kedatangan sesuai jadwal.'
  });

  // Calculate Check-In Odometer Diff
  const checkInDiff = checkInForm.physicalOdometer - checkInForm.canbusOdometer;

  // Handle bus select change in Check-In
  const handleCheckInBusChange = (busId: string) => {
    const selected = busFleetOptions.find((b) => b.id === busId);
    if (selected) {
      setCheckInForm({
        ...checkInForm,
        busId: selected.id,
        plate: selected.plate,
        chassis: selected.chassis
      });
    }
  };

  // Submit Check-In Form
  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();

    let statusBadge = 'bg-blue-100 text-blue-800 border border-blue-200';
    if (checkInForm.handoverStatus === 'Ready / Siap Jalan') {
      statusBadge = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    } else if (checkInForm.handoverStatus === 'Rujuk Workshop (SPK)') {
      statusBadge = 'bg-red-100 text-error border border-red-200';
    }

    const newRecord: HandoverRecordItem = {
      id: `HND-${String(records.length + 1).padStart(3, '0')}`,
      bastkNumber: checkInForm.bastkNumber,
      busId: checkInForm.busId,
      plate: checkInForm.plate,
      chassis: checkInForm.chassis,
      type: 'Check-In (Tiba di Pool)',
      date: checkInForm.date,
      time: checkInForm.time,
      originPool: checkInForm.originPool,
      destinationPool: checkInForm.destinationPool,
      driverName: checkInForm.driverName,
      coDriverName: checkInForm.coDriverName,
      dispatcherName: checkInForm.dispatcherName,
      canbusOdometer: Number(checkInForm.canbusOdometer),
      physicalOdometer: Number(checkInForm.physicalOdometer),
      odometerDiff: checkInDiff,
      fuelLevelPercent: Number(checkInForm.fuelLevelPercent),
      fuelLiters: Number(checkInForm.fuelLiters),
      adBlueLevel: checkInForm.adBlueLevel,
      cabinCleanliness: checkInForm.cabinCleanliness,
      toiletStatus: checkInForm.toiletStatus,
      safetyItemsComplete: checkInForm.safetyItemsComplete,
      documentsComplete: checkInForm.documentsComplete,
      passengerAmenitiesCount: checkInForm.passengerAmenitiesCount,
      handoverStatus: checkInForm.handoverStatus,
      statusBadge,
      driverComplaint: checkInForm.driverComplaint || undefined,
      notes: checkInForm.notes
    };

    setRecords([newRecord, ...records]);
    setShowCheckInModal(false);
    triggerToast(`BASTK Check-In ${newRecord.busId} (${newRecord.bastkNumber}) berhasil divalidasi & disimpan.`);
  };

  // ================= 2. Form Check-Out State =================
  const [checkOutForm, setCheckOutForm] = useState({
    bastkNumber: `BASTK-OUT-2024-${String(records.length + 412)}`,
    spjNumber: `SPJ-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    busId: 'TY-104',
    plate: 'B 7201 UGA',
    chassis: 'Scania K410IB 6x2*4 Opticruise',
    originPool: 'Pool Pusat Pulogebang (Jakarta Timur)',
    destinationPool: 'Pool Surabaya Waru (Sidoarjo)',
    departureDate: new Date().toISOString().slice(0, 10),
    departureTime: '15:30 WIB',
    driverName: 'Ahmad Zaelani',
    coDriverName: 'Wahyu Tri',
    dispatcherName: 'Rudi Haryanto (Dispatcher Ramp)',
    initialOdometer: 145220,
    fuelLevelPercent: 100,
    fuelLiters: 400,
    adBlueLevel: '90%',
    cabinCleanliness: 'Sangat Bersih' as 'Sangat Bersih' | 'Standar' | 'Kotor (Perlu Cuci)',
    toiletStatus: 'Bersih & Air Penuh' as 'Bersih & Air Penuh' | 'Perlu Kuras & Isi Air' | 'Tidak Ada Toilet',
    safetyItemsComplete: true,
    documentsComplete: true,
    passengerAmenitiesCount: '32 Selimut Laundry & Bantal',
    notes: 'Surat Perintah Jalan (SPJ) dan manifest penumpang 32 orang terverifikasi lengkap.'
  });

  const handleCheckOutBusChange = (busId: string) => {
    const selected = busFleetOptions.find((b) => b.id === busId);
    if (selected) {
      setCheckOutForm({
        ...checkOutForm,
        busId: selected.id,
        plate: selected.plate,
        chassis: selected.chassis
      });
    }
  };

  // Submit Check-Out Form
  const handleSaveCheckOut = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: HandoverRecordItem = {
      id: `HND-${String(records.length + 1).padStart(3, '0')}`,
      bastkNumber: checkOutForm.bastkNumber,
      busId: checkOutForm.busId,
      plate: checkOutForm.plate,
      chassis: checkOutForm.chassis,
      type: 'Check-Out (Keberangkatan SPJ)',
      date: checkOutForm.departureDate,
      time: checkOutForm.departureTime,
      originPool: checkOutForm.originPool,
      destinationPool: checkOutForm.destinationPool,
      driverName: checkOutForm.driverName,
      coDriverName: checkOutForm.coDriverName,
      dispatcherName: checkOutForm.dispatcherName,
      canbusOdometer: Number(checkOutForm.initialOdometer),
      physicalOdometer: Number(checkOutForm.initialOdometer),
      odometerDiff: 0,
      fuelLevelPercent: Number(checkOutOutPercentSafe(checkOutForm.fuelLevelPercent)),
      fuelLiters: Number(checkOutForm.fuelLiters),
      adBlueLevel: checkOutForm.adBlueLevel,
      cabinCleanliness: checkOutForm.cabinCleanliness,
      toiletStatus: checkOutForm.toiletStatus,
      safetyItemsComplete: checkOutForm.safetyItemsComplete,
      documentsComplete: checkOutForm.documentsComplete,
      passengerAmenitiesCount: checkOutForm.passengerAmenitiesCount,
      handoverStatus: 'Ready / Siap Jalan',
      statusBadge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      notes: `${checkOutForm.notes} (No. SPJ: ${checkOutForm.spjNumber})`
    };

    setRecords([newRecord, ...records]);
    setShowCheckOutModal(false);
    triggerToast(`Dispatch Keberangkatan ${newRecord.busId} (${checkOutForm.spjNumber}) resmi diberangkatkan.`);
  };

  const checkOutOutPercentSafe = (val: number) => Math.min(100, Math.max(0, val));

  // ================= 3. Form Mutasi Antar-Pool =================
  const [mutationForm, setMutationForm] = useState({
    mutationNumber: `MUT-2024-${String(records.length + 32)}`,
    busId: 'TY-015',
    plate: 'B 7102 SGA',
    chassis: 'Volvo B11R 430HP 6x2',
    originPool: 'Pool Pusat Pulogebang (Jakarta Timur)',
    destinationPool: 'Pool Solo Tirtonadi (Surakarta)',
    transferReason: 'Pemerataan armada sleeper bus rute Solo-Jakarta',
    driverName: 'Joko Santoso',
    dispatcherName: 'Rudi Haryanto',
    date: new Date().toISOString().slice(0, 10),
    time: '11:00 WIB',
    currentOdometer: 312892,
    fuelLevelPercent: 65,
    fuelLiters: 260,
    notes: 'Relokasi aset operasional antar pool, surat jalan mutasi resmi terlampir.'
  });

  const handleMutationBusChange = (busId: string) => {
    const selected = busFleetOptions.find((b) => b.id === busId);
    if (selected) {
      setMutationForm({
        ...mutationForm,
        busId: selected.id,
        plate: selected.plate,
        chassis: selected.chassis
      });
    }
  };

  const handleSaveMutation = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: HandoverRecordItem = {
      id: `HND-${String(records.length + 1).padStart(3, '0')}`,
      bastkNumber: mutationForm.mutationNumber,
      busId: mutationForm.busId,
      plate: mutationForm.plate,
      chassis: mutationForm.chassis,
      type: 'Mutasi Antar-Pool',
      date: mutationForm.date,
      time: mutationForm.time,
      originPool: mutationForm.originPool,
      destinationPool: mutationForm.destinationPool,
      driverName: mutationForm.driverName,
      dispatcherName: mutationForm.dispatcherName,
      canbusOdometer: Number(mutationForm.currentOdometer),
      physicalOdometer: Number(mutationForm.currentOdometer),
      odometerDiff: 0,
      fuelLevelPercent: Number(mutationForm.fuelLevelPercent),
      fuelLiters: Number(mutationForm.fuelLiters),
      cabinCleanliness: 'Sangat Bersih',
      toiletStatus: 'Bersih & Air Penuh',
      safetyItemsComplete: true,
      documentsComplete: true,
      passengerAmenitiesCount: 'Standar Mutasi',
      handoverStatus: 'Perjalanan Antar-Pool',
      statusBadge: 'bg-purple-100 text-purple-800 border border-purple-200',
      notes: `Alasan: ${mutationForm.transferReason}. ${mutationForm.notes}`
    };

    setRecords([newRecord, ...records]);
    setPools((prev) =>
      prev.map((p) => {
        if (p.poolName === mutationForm.destinationPool) {
          return { ...p, totalUnits: p.totalUnits + 1, readyUnits: p.readyUnits + 1 };
        }
        if (p.poolName === mutationForm.originPool) {
          return { ...p, totalUnits: Math.max(0, p.totalUnits - 1) };
        }
        return p;
      })
    );
    setShowMutationModal(false);
    triggerToast(`Mutasi armada ${newRecord.busId} ke ${newRecord.destinationPool} tersimpan.`);
  };

  // Open BASTK Physical Document Modal
  const handleOpenPrintModal = (record: HandoverRecordItem) => {
    setSelectedRecord(record);
    setShowPrintBASTKModal(true);
  };

  // ================= Kalkulasi Metrik Global =================
  const metrics = useMemo(() => {
    const totalTransactions = records.length;
    const safeOdoCount = records.filter((r) => Math.abs(r.odometerDiff) <= 5).length;
    const washCount = records.filter((r) => r.handoverStatus === 'Masuk Cuci & Sanitasi').length;
    const workshopCount = records.filter((r) => r.handoverStatus === 'Rujuk Workshop (SPK)').length;
    const safeOdoPercent = totalTransactions > 0 ? ((safeOdoCount / totalTransactions) * 100).toFixed(1) : '100';

    return { totalTransactions, safeOdoCount, washCount, workshopCount, safeOdoPercent };
  }, [records]);

  // Filter Data Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.bastkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.busId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.originPool.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.destinationPool.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'all' || r.type === filterType;
      const matchesStatus = filterStatus === 'all' || r.handoverStatus === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [records, searchQuery, filterType, filterStatus]);

  // Reconciliation Audit List (calculated diffs)
  const reconciliationAuditList = useMemo(() => {
    return records.map((r) => {
      const absDiff = Math.abs(r.odometerDiff);
      let diffStatus: 'Aman (Normal)' | 'Perhatian (Deviasi Kecil)' | 'Waspada (Indikasi Manipulasi)' = 'Aman (Normal)';
      let diffBadge = 'bg-emerald-100 text-emerald-800 border border-emerald-200';

      if (absDiff > 15) {
        diffStatus = 'Waspada (Indikasi Manipulasi)';
        diffBadge = 'bg-red-100 text-error border border-red-200';
      } else if (absDiff > 5) {
        diffStatus = 'Perhatian (Deviasi Kecil)';
        diffBadge = 'bg-amber-100 text-amber-800 border border-amber-200';
      }

      return {
        ...r,
        absDiff,
        diffStatus,
        diffBadge
      };
    });
  }, [records]);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Utama & Tombol Aksi Dinamis Sesuai Tab Aktif */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-on-surface-variant mb-1">
            <span>Operasional & Ramp Dispatch</span>
            <span>•</span>
            <span className="text-primary font-bold">Modul 1.2: Serah Terima & Odometer Telematika</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Dispatch, Serah Terima Antar-Pool & Log Odometer
          </h1>
          <p className="text-xs text-on-surface-variant">
            Pencatatan BASTK resmi, rekonsiliasi telematika Odometer CAN-bus vs fisik, verifikasi kelaikan cepat, dan alokasi armada antar-pool.
          </p>
        </div>

        {/* Action Button: Dinamis sesuai tab yang sedang aktif */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'bastk' && (
            <>
              <button
                onClick={() => setShowCheckOutModal(true)}
                className="px-3.5 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px]">output</span>
                + Dispatch Check-Out (SPJ)
              </button>
              <button
                onClick={() => setShowCheckInModal(true)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">input</span>
                + Check-In Armada (Tiba di Pool)
              </button>
            </>
          )}

          {activeTab === 'reconciliation' && (
            <button
              onClick={() => {
                setShowCheckInModal(true);
                triggerToast('Gunakan form input Check-In untuk memvalidasi rekonsiliasi odometer fisik vs CAN-bus.');
              }}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              + Audit Rekonsiliasi Odometer
            </button>
          )}

          {activeTab === 'pool' && (
            <button
              onClick={() => setShowMutationModal(true)}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              + Mutasi Armada Antar-Pool
            </button>
          )}
        </div>
      </div>

      {/* Kartu Ringkasan Metrik KPI Serah Terima */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total Transaksi BASTK */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-outline block font-semibold">Total Transaksi BASTK</span>
            <div className="text-2xl font-bold text-on-surface mt-1">{metrics.totalTransactions} Transaksi</div>
            <span className="text-[11px] text-on-surface-variant">Check-In, Check-Out & Mutasi</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
        </div>

        {/* Metrik 2: Kepatuhan Odometer CAN-bus */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-outline block font-semibold">Rekonsiliasi Odo Aman</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.safeOdoPercent}%</div>
            <span className="text-[11px] text-emerald-600 font-medium">Deviasi toleransi ≤ 5 KM ({metrics.safeOdoCount} unit)</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">speed</span>
          </div>
        </div>

        {/* Metrik 3: Masuk Antrean Cuci */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-outline block font-semibold">Masuk Cuci & Sanitasi</span>
            <div className="text-2xl font-bold text-blue-700 mt-1">{metrics.washCount} Armada</div>
            <span className="text-[11px] text-blue-600 font-medium">Pembersihan kabin & kuras toilet</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">local_car_wash</span>
          </div>
        </div>

        {/* Metrik 4: Rujuk Workshop SPK */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-outline block font-semibold">Rujuk Workshop (SPK)</span>
            <div className="text-2xl font-bold text-error mt-1">{metrics.workshopCount} Armada</div>
            <span className="text-[11px] text-error font-medium">Ada keluhan teknis dari driver</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-100 text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">build_circle</span>
          </div>
        </div>
      </div>

      {/* Navigasi Sub-Tab */}
      <div className="flex border-b border-surface-container gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('bastk')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors relative ${
            activeTab === 'bastk'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          Log Transaksi BASTK Serah Terima
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-surface-container font-mono">
            {records.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors relative ${
            activeTab === 'reconciliation'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">sensors</span>
          Monitoring Rekonsiliasi Odometer CAN-bus
        </button>

        <button
          onClick={() => setActiveTab('pool')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors relative ${
            activeTab === 'pool'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">hub</span>
          Distribusi & Ketersediaan Armada per Pool
        </button>
      </div>

      {/* ================= TAB 1: LOG TRANSAKSI BASTK ================= */}
      {activeTab === 'bastk' && (
        <div className="space-y-4">
          {/* Baris Filter & Pencarian */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full md:w-auto flex-1">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari BASTK, No. Lambung, Plat, Driver, Pool..."
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 text-xs focus:outline-none focus:border-primary"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[18px]">
                  search
                </span>
              </div>

              {/* Filter Tipe Transaksi */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="py-2 px-3 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 text-xs cursor-pointer font-medium"
              >
                <option value="all">Semua Tipe Transaksi</option>
                <option value="Check-In (Tiba di Pool)">Check-In (Tiba di Pool)</option>
                <option value="Check-Out (Keberangkatan SPJ)">Check-Out (Keberangkatan SPJ)</option>
                <option value="Mutasi Antar-Pool">Mutasi Antar-Pool</option>
              </select>

              {/* Filter Status Serah Terima */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-2 px-3 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 text-xs cursor-pointer font-medium"
              >
                <option value="all">Semua Status Armada</option>
                <option value="Ready / Siap Jalan">Ready / Siap Jalan</option>
                <option value="Masuk Cuci & Sanitasi">Masuk Cuci & Sanitasi</option>
                <option value="Rujuk Workshop (SPK)">Rujuk Workshop (SPK)</option>
                <option value="Perjalanan Antar-Pool">Perjalanan Antar-Pool</option>
              </select>
            </div>

            <div className="text-on-surface-variant text-[11px] shrink-0 font-medium">
              Menampilkan <span className="font-bold text-on-surface">{filteredRecords.length}</span> dari {records.length} berkas BASTK
            </div>
          </div>

          {/* Tabel Log BASTK */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                    <th className="py-3 px-4">No. BASTK & Waktu</th>
                    <th className="py-3 px-4">Armada & Sasis</th>
                    <th className="py-3 px-4">Tipe & Rute Pool</th>
                    <th className="py-3 px-4">Driver & Dispatcher</th>
                    <th className="py-3 px-4 text-center">Odometer & Deviasi</th>
                    <th className="py-3 px-4">BBM & Toilet</th>
                    <th className="py-3 px-4 text-center">Status / Tindak Lanjut</th>
                    <th className="py-3 px-4 text-center">Aksi BASTK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[36px] text-outline block mb-1">
                          folder_off
                        </span>
                        Tidak ada catatan BASTK yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                        {/* No BASTK & Tanggal */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-primary block">{item.bastkNumber}</span>
                          <span className="text-[11px] text-on-surface font-semibold">{item.date}</span>
                          <span className="text-[10px] text-outline block">{item.time}</span>
                        </td>

                        {/* Armada & Sasis */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-bold text-xs">
                              {item.busId}
                            </span>
                            <span className="font-bold text-on-surface">{item.plate}</span>
                          </div>
                          {item.chassis && (
                            <span className="text-[11px] text-on-surface-variant block truncate max-w-[200px]">
                              {item.chassis}
                            </span>
                          )}
                        </td>

                        {/* Tipe Transaksi & Pool */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${
                              item.type.includes('Check-In')
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : item.type.includes('Check-Out')
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {item.type}
                          </span>
                          <div className="text-[11px] text-on-surface font-medium flex items-center gap-1">
                            <span className="text-outline truncate max-w-[100px]">{item.originPool.split('(')[0]}</span>
                            <span className="material-symbols-outlined text-[12px] text-outline">arrow_forward</span>
                            <span className="font-semibold truncate max-w-[100px]">{item.destinationPool.split('(')[0]}</span>
                          </div>
                        </td>

                        {/* Driver & Dispatcher */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-on-surface font-semibold">
                            <span className="material-symbols-outlined text-[14px] text-outline">badge</span>
                            <span>{item.driverName}</span>
                          </div>
                          {item.coDriverName && (
                            <span className="text-[10px] text-on-surface-variant block">Co: {item.coDriverName}</span>
                          )}
                          <span className="text-[10px] text-outline block mt-0.5">PIC: {item.dispatcherName}</span>
                        </td>

                        {/* Odometer & Deviasi */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="font-mono font-bold text-on-surface">
                            {item.physicalOdometer.toLocaleString('id-ID')} KM
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              CAN: {item.canbusOdometer.toLocaleString('id-ID')}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                                Math.abs(item.odometerDiff) <= 5
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-error'
                              }`}
                            >
                              {item.odometerDiff > 0 ? `+${item.odometerDiff}` : item.odometerDiff} KM
                            </span>
                          </div>
                        </td>

                        {/* BBM & Toilet */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-primary">local_gas_station</span>
                            <span className="font-bold text-primary font-mono">{item.fuelLiters} L ({item.fuelLevelPercent}%)</span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant block">
                            {item.toiletStatus}
                          </span>
                        </td>

                        {/* Status Serah Terima */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${item.statusBadge}`}>
                            {item.handoverStatus}
                          </span>
                          {item.driverComplaint && (
                            <span className="block text-[10px] text-error font-medium mt-1 truncate max-w-[150px]" title={item.driverComplaint}>
                              ⚠ {item.driverComplaint}
                            </span>
                          )}
                        </td>

                        {/* Aksi BASTK */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleOpenPrintModal(item)}
                            className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg text-xs font-semibold flex items-center gap-1 mx-auto cursor-pointer transition-colors shadow-2xs border border-outline-variant/30"
                          >
                            <span className="material-symbols-outlined text-[15px]">print</span>
                            Cetak BASTK
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: REKONSILIASI ODOMETER CAN-BUS ================= */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          {/* Banner Edukasi & Prosedur Audit Telematika */}
          <div className="bg-gradient-to-r from-blue-900/10 via-primary/5 to-transparent p-5 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase">
                  SOP Audit Telematika IoT
                </span>
                <span className="text-xs font-bold text-on-surface">Validasi Deviasi Odometer GPS CAN-bus vs Dashboard Fisik</span>
              </div>
              <p className="text-xs text-on-surface-variant max-w-2xl">
                Setiap armada bus AKAP yang check-in diwajibkan membandingkan angka speedometer fisik dashboard dengan data telematika FMS CAN-bus Scania/Mercedes/Hino. Toleransi standar adalah <strong>≤ 5 KM</strong>. Deviasi di atas 15 KM wajib diinvestigasi untuk mencegah pemakaian armada tanpa izin atau manipulasi odometer.
              </p>
            </div>
            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Validasi Check-In Baru
            </button>
          </div>

          {/* Tabel Monitoring Audit Odometer */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-4 border-b border-surface-container flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Matriks Log Audit Deviasi Odometer</h3>
                <p className="text-xs text-on-surface-variant">Hasil perbandingan data telematika CAN-bus ECU vs input visual fisik dispatcher ramp.</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-surface-container text-xs font-mono font-bold text-on-surface">
                {reconciliationAuditList.length} Unit Diaudit
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                    <th className="py-3 px-4">No. Lambung & Plat</th>
                    <th className="py-3 px-4">Pool Verifikasi</th>
                    <th className="py-3 px-4 font-mono text-right">Odo CAN-bus ECU</th>
                    <th className="py-3 px-4 font-mono text-right">Odo Fisik Dashboard</th>
                    <th className="py-3 px-4 font-mono text-center">Selisih Deviasi</th>
                    <th className="py-3 px-4 text-center">Status Integritas</th>
                    <th className="py-3 px-4">Tindak Lanjut Dispatcher</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {reconciliationAuditList.map((aud) => (
                    <tr key={aud.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-primary text-white font-mono font-bold text-xs">
                            {aud.busId}
                          </span>
                          <div>
                            <span className="font-bold text-on-surface block">{aud.plate}</span>
                            <span className="text-[10px] text-outline">{aud.chassis}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-on-surface">
                        <span>{aud.destinationPool}</span>
                        <span className="text-[10px] text-outline block">{aud.date} • {aud.time}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-primary">
                        {aud.canbusOdometer.toLocaleString('id-ID')} KM
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-on-surface">
                        {aud.physicalOdometer.toLocaleString('id-ID')} KM
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${aud.absDiff <= 5 ? 'text-emerald-700 bg-emerald-50' : 'text-error bg-red-50'}`}>
                          {aud.odometerDiff > 0 ? `+${aud.odometerDiff}` : aud.odometerDiff} KM
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${aud.diffBadge}`}>
                          {aud.diffStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-on-surface-variant">
                        {aud.absDiff <= 5 ? (
                          <span className="text-emerald-700 font-medium">✓ Lulus verifikasi, siap alokasi jalur.</span>
                        ) : (
                          <span className="text-error font-medium">⚠ Cek sensor kecepatan & kalibrasi tachograph.</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenPrintModal(aud)}
                          className="px-2 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-semibold text-primary cursor-pointer transition-colors"
                        >
                          Lihat Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: DISTRIBUSI ARMADA PER POOL ================= */}
      {activeTab === 'pool' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-on-surface">Ketersediaan & Kapasitas Parkir Ramp per Pool</h3>
              <p className="text-xs text-on-surface-variant">
                Pantau kapasitas slot parkir pool, ketersediaan unit siap dinas (Ready), antrean cuci, dan unit rujukan bengkel.
              </p>
            </div>
            <button
              onClick={() => setShowMutationModal(true)}
              className="px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              + Mutasi / Relokasi Armada
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pools.map((p, idx) => {
              const occupancyPercent = Math.round((p.totalUnits / p.capacity) * 100);

              return (
                <div
                  key={idx}
                  className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-base text-on-surface">{p.poolName}</h4>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px] text-outline">person</span>
                        PIC: {p.pic}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
                      {p.totalUnits} / {p.capacity} Unit
                    </span>
                  </div>

                  {/* Progress Bar Okupansi */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Okupansi Slot Parkir</span>
                      <span className="font-mono font-bold text-on-surface">{occupancyPercent}% Terisi</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancyPercent >= 90
                            ? 'bg-error'
                            : occupancyPercent >= 75
                            ? 'bg-amber-500'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Rincian Status Unit di Pool */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-surface-container">
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wider">Siap Jalan</span>
                      <span className="text-lg font-black text-emerald-700">{p.readyUnits}</span>
                      <span className="text-[10px] text-emerald-600 block">Unit Ready</span>
                    </div>
                    <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                      <span className="text-[10px] text-blue-800 font-bold block uppercase tracking-wider">Antre Cuci</span>
                      <span className="text-lg font-black text-blue-700">{p.washUnits}</span>
                      <span className="text-[10px] text-blue-600 block">Sanitasi & Kuras</span>
                    </div>
                    <div className="p-2.5 bg-red-50 rounded-lg border border-red-100">
                      <span className="text-[10px] text-error font-bold block uppercase tracking-wider">Di Bengkel</span>
                      <span className="text-lg font-black text-error">{p.workshopUnits}</span>
                      <span className="text-[10px] text-red-600 block">SPK Servis</span>
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setMutationForm({
                          ...mutationForm,
                          destinationPool: p.poolName
                        });
                        setShowMutationModal(true);
                      }}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Relokasi Armada ke Pool Ini</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FORM CHECK-IN (BASTK TIBA DI POOL) */}
      {/* Sesuai standar modal: Sticky Header + Scrollable Form + Sticky Footer max-h-[92vh] */}
      {/* ========================================================================= */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden animate-scale-up">
            {/* Sticky Header */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">input</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Form Check-In BASTK (Tiba di Pool)</h3>
                  <p className="text-xs text-on-surface-variant">
                    Verifikasi kedatangan armada, rekonsiliasi odometer CAN-bus vs fisik, BBM, dan kelaikan fasilitas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="checkin-form" onSubmit={handleSaveCheckIn} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {/* Seksi 1: Administrasi & Identitas Bus */}
              <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">
                  1. Administrasi & Identitas Armada
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">No. BASTK (Otomatis) *</label>
                    <input
                      required
                      value={checkInForm.bastkNumber}
                      onChange={(e) => setCheckInForm({ ...checkInForm, bastkNumber: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pilih Armada Bus *</label>
                    <select
                      value={checkInForm.busId}
                      onChange={(e) => handleCheckInBusChange(e.target.value)}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                    >
                      {busFleetOptions.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} - {b.plate} ({b.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Polisi (Plat)</label>
                    <input
                      disabled
                      value={checkInForm.plate}
                      className="w-full p-2.5 bg-surface-container text-on-surface rounded-lg border border-outline-variant/20 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pool Asal Keberangkatan *</label>
                    <select
                      value={checkInForm.originPool}
                      onChange={(e) => setCheckInForm({ ...checkInForm, originPool: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    >
                      {poolOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pool Tujuan (Ramp Penerimaan) *</label>
                    <select
                      value={checkInForm.destinationPool}
                      onChange={(e) => setCheckInForm({ ...checkInForm, destinationPool: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    >
                      {poolOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tanggal Tiba *</label>
                    <input
                      type="date"
                      required
                      value={checkInForm.date}
                      onChange={(e) => setCheckInForm({ ...checkInForm, date: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Waktu Tiba (WIB) *</label>
                    <input
                      required
                      value={checkInForm.time}
                      onChange={(e) => setCheckInForm({ ...checkInForm, time: e.target.value })}
                      placeholder="Contoh: 08:30 WIB"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Driver Utama *</label>
                    <input
                      required
                      value={checkInForm.driverName}
                      onChange={(e) => setCheckInForm({ ...checkInForm, driverName: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Co-Driver / Kru</label>
                    <input
                      value={checkInForm.coDriverName}
                      onChange={(e) => setCheckInForm({ ...checkInForm, coDriverName: e.target.value })}
                      placeholder="Nama Co-Driver"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 2: Rekonsiliasi Telematika & Odometer CAN-bus */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary block text-xs uppercase tracking-wide">
                    2. Rekonsiliasi Odometer Telematika CAN-bus vs Fisik
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      Math.abs(checkInDiff) <= 5
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-error'
                    }`}
                  >
                    Deviasi: {checkInDiff > 0 ? `+${checkInDiff}` : checkInDiff} KM ({Math.abs(checkInDiff) <= 5 ? 'Aman' : 'Perlu Investigasi'})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                    <label className="text-[11px] text-on-surface-variant block font-semibold mb-1">
                      GPS Telematics CAN-bus (ECU Scania/Mercy)
                    </label>
                    <input
                      type="number"
                      required
                      value={checkInForm.canbusOdometer}
                      onChange={(e) => setCheckInForm({ ...checkInForm, canbusOdometer: parseInt(e.target.value, 10) || 0 })}
                      className="w-full font-mono text-base font-bold text-primary bg-transparent focus:outline-none"
                    />
                    <span className="text-[10px] text-outline block mt-1">Otomatis tersinkron dari modul FMS gateway</span>
                  </div>

                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-primary/40 ring-2 ring-primary/10">
                    <label className="text-[11px] text-primary block font-bold mb-1">
                      Input Odometer Fisik (Dashboard Bus) *
                    </label>
                    <input
                      type="number"
                      required
                      value={checkInForm.physicalOdometer}
                      onChange={(e) => setCheckInForm({ ...checkInForm, physicalOdometer: parseInt(e.target.value, 10) || 0 })}
                      className="w-full font-mono text-base font-bold text-on-surface bg-transparent focus:outline-none"
                    />
                    <span className="text-[10px] text-on-surface-variant block mt-1">Dicatat langsung oleh dispatcher di ramp</span>
                  </div>
                </div>
              </div>

              {/* Seksi 3: Sisa Bahan Bakar & AdBlue */}
              <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">
                  3. Bahan Bakar Solar & AdBlue
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Sisa Solar (%) *</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={checkInForm.fuelLevelPercent}
                      onChange={(e) => {
                        const pct = parseInt(e.target.value, 10) || 0;
                        setCheckInForm({
                          ...checkInForm,
                          fuelLevelPercent: pct,
                          fuelLiters: Math.round((pct / 100) * 400)
                        });
                      }}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Estimasi Sisa Solar (Liter)</label>
                    <input
                      type="number"
                      value={checkInForm.fuelLiters}
                      onChange={(e) => setCheckInForm({ ...checkInForm, fuelLiters: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold text-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Level AdBlue (Euro 5/6)</label>
                    <select
                      value={checkInForm.adBlueLevel}
                      onChange={(e) => setCheckInForm({ ...checkInForm, adBlueLevel: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    >
                      <option value="90% (Penuh)">90% (Penuh)</option>
                      <option value="75% (Aman)">75% (Aman)</option>
                      <option value="40% (Cukup)">40% (Cukup)</option>
                      <option value="15% (Perlu Top-up)">15% (Perlu Top-up)</option>
                      <option value="N/A (Euro 3/4)">N/A (Euro 3/4)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seksi 4: Checklist Kelaikan Cepat & Fasilitas Kabin */}
              <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">
                  4. Kelaikan Cepat & Fasilitas Kabin
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Kondisi Kebersihan Kabin</label>
                    <select
                      value={checkInForm.cabinCleanliness}
                      onChange={(e) => setCheckInForm({ ...checkInForm, cabinCleanliness: e.target.value as any })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    >
                      <option value="Sangat Bersih">Sangat Bersih</option>
                      <option value="Standar">Standar</option>
                      <option value="Kotor (Perlu Cuci)">Kotor (Perlu Cuci)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Sanitasi & Ketersediaan Air Toilet</label>
                    <select
                      value={checkInForm.toiletStatus}
                      onChange={(e) => setCheckInForm({ ...checkInForm, toiletStatus: e.target.value as any })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    >
                      <option value="Bersih & Air Penuh">Bersih & Air Penuh</option>
                      <option value="Perlu Kuras & Isi Air">Perlu Kuras & Isi Air</option>
                      <option value="Tidak Ada Toilet">Tidak Ada Toilet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkInForm.documentsComplete}
                      onChange={(e) => setCheckInForm({ ...checkInForm, documentsComplete: e.target.checked })}
                      className="rounded text-primary focus:ring-0 w-4 h-4"
                    />
                    <span className="font-semibold text-on-surface">Dokumen STNK Asli & Buku Uji KIR Fisik Lengkap</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkInForm.safetyItemsComplete}
                      onChange={(e) => setCheckInForm({ ...checkInForm, safetyItemsComplete: e.target.checked })}
                      className="rounded text-primary focus:ring-0 w-4 h-4"
                    />
                    <span className="font-semibold text-on-surface">Perlengkapan APAR, P3K & Palu Pemecah Kaca Lengkap</span>
                  </label>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Jumlah Pengembalian Fasilitas Penumpang</label>
                  <input
                    value={checkInForm.passengerAmenitiesCount}
                    onChange={(e) => setCheckInForm({ ...checkInForm, passengerAmenitiesCount: e.target.value })}
                    placeholder="Contoh: 34 Selimut & 34 Headset lengkap"
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-medium"
                  />
                </div>
              </div>

              {/* Seksi 5: Keluhan Pengemudi & Status Tindak Lanjut */}
              <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">
                  5. Keluhan Teknis Driver & Disposisi Armada
                </span>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">
                    Keluhan / Masukan Teknis Pengemudi (Mesin, Rem, AC, Kaki-kaki)
                  </label>
                  <textarea
                    rows={2}
                    value={checkInForm.driverComplaint}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCheckInForm({
                        ...checkInForm,
                        driverComplaint: val,
                        handoverStatus: val.trim().length > 0 ? 'Rujuk Workshop (SPK)' : checkInForm.handoverStatus
                      });
                    }}
                    placeholder="Kosongkan jika tidak ada keluhan teknis dari pengemudi..."
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-medium"
                  />
                  <span className="text-[10px] text-on-surface-variant block mt-1">
                    * Jika terdapat keluhan teknis, sistem otomatis merekomendasikan status <strong>Rujuk Workshop (SPK)</strong>.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Status Disposisi Armada *</label>
                    <select
                      value={checkInForm.handoverStatus}
                      onChange={(e) => setCheckInForm({ ...checkInForm, handoverStatus: e.target.value as any })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                    >
                      <option value="Masuk Cuci & Sanitasi">Masuk Cuci & Sanitasi</option>
                      <option value="Ready / Siap Jalan">Ready / Siap Jalan</option>
                      <option value="Rujuk Workshop (SPK)">Rujuk Workshop (SPK)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Dispatcher Ramp Penerima</label>
                    <input
                      required
                      value={checkInForm.dispatcherName}
                      onChange={(e) => setCheckInForm({ ...checkInForm, dispatcherName: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Catatan Tambahan</label>
                  <input
                    value={checkInForm.notes}
                    onChange={(e) => setCheckInForm({ ...checkInForm, notes: e.target.value })}
                    placeholder="Contoh: Antrean cuci nomor 3, bus tiba tepat waktu"
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCheckInModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="checkin-form"
                className="px-5 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Validasi & Simpan BASTK Check-In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FORM CHECK-OUT (DISPATCH KEBERANGKATAN SPJ) */}
      {/* ========================================================================= */}
      {showCheckOutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden animate-scale-up">
            {/* Sticky Header */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">output</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Form Dispatch Check-Out (Keberangkatan SPJ)</h3>
                  <p className="text-xs text-on-surface-variant">
                    Penerbitan BASTK pelepasan unit dinas jalan, verifikasi SPJ, manifest, dan kesiapan armada.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckOutModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="checkout-form" onSubmit={handleSaveCheckOut} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {/* Seksi 1: Surat Jalan & Armada */}
              <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">
                  1. Surat Perintah Jalan (SPJ) & Armada Berangkat
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">No. BASTK Keluar *</label>
                    <input
                      required
                      value={checkOutForm.bastkNumber}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, bastkNumber: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor SPJ Resmi *</label>
                    <input
                      required
                      value={checkOutForm.spjNumber}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, spjNumber: e.target.value })}
                      placeholder="Contoh: SPJ-2024-9102"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold text-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pilih Armada Bus Siap *</label>
                    <select
                      value={checkOutForm.busId}
                      onChange={(e) => handleCheckOutBusChange(e.target.value)}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                    >
                      {busFleetOptions.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} - {b.plate} ({b.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pool Keberangkatan (Asal) *</label>
                    <select
                      value={checkOutForm.originPool}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, originPool: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    >
                      {poolOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pool Tujuan Akhir *</label>
                    <select
                      value={checkOutForm.destinationPool}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, destinationPool: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    >
                      {poolOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tanggal Berangkat *</label>
                    <input
                      type="date"
                      required
                      value={checkOutForm.departureDate}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, departureDate: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Jam Jadwal Rilis *</label>
                    <input
                      required
                      value={checkOutForm.departureTime}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, departureTime: e.target.value })}
                      placeholder="Contoh: 15:30 WIB"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Driver Utama 1 *</label>
                    <input
                      required
                      value={checkOutForm.driverName}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, driverName: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Driver Cadangan 2</label>
                    <input
                      value={checkOutForm.coDriverName}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, coDriverName: e.target.value })}
                      placeholder="Nama Driver 2"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 2: Odometer Awal & Bahan Bakar Siap Jalan */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-3">
                <span className="font-bold text-emerald-800 block text-xs uppercase tracking-wide">
                  2. Odometer Awal & Kondisi Bahan Bakar Berangkat
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Odometer Awal Keberangkatan (KM) *</label>
                    <input
                      type="number"
                      required
                      value={checkOutForm.initialOdometer}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, initialOdometer: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold text-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Kondisi BBM Solar (%) *</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={checkOutForm.fuelLevelPercent}
                      onChange={(e) => {
                        const pct = parseInt(e.target.value, 10) || 0;
                        setCheckOutForm({
                          ...checkOutForm,
                          fuelLevelPercent: pct,
                          fuelLiters: Math.round((pct / 100) * 400)
                        });
                      }}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Solar Terisi (Liter)</label>
                    <input
                      type="number"
                      value={checkOutForm.fuelLiters}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, fuelLiters: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 3: Checklist Kesiapan Jalan */}
              <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">
                  3. Checklist Dokumen Jalan & Fasilitas Penumpang
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkOutForm.documentsComplete}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, documentsComplete: e.target.checked })}
                      className="rounded text-primary focus:ring-0 w-4 h-4"
                    />
                    <span className="font-semibold text-on-surface">SPJ Fisik, STNK, KIR & KP Trayek Lengkap</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkOutForm.safetyItemsComplete}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, safetyItemsComplete: e.target.checked })}
                      className="rounded text-primary focus:ring-0 w-4 h-4"
                    />
                    <span className="font-semibold text-on-surface">APAR Aktif, Ban Cadangan & Toolkit Tersedia</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Fasilitas Penumpang Siap</label>
                    <input
                      value={checkOutForm.passengerAmenitiesCount}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, passengerAmenitiesCount: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Dispatcher Pelepas Ramp</label>
                    <input
                      required
                      value={checkOutForm.dispatcherName}
                      onChange={(e) => setCheckOutForm({ ...checkOutForm, dispatcherName: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Catatan Dispatch</label>
                  <input
                    value={checkOutForm.notes}
                    onChange={(e) => setCheckOutForm({ ...checkOutForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCheckOutModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="checkout-form"
                className="px-5 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                Rilis & Berangkatkan Armada (SPJ)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: FORM MUTASI ANTAR-POOL */}
      {/* ========================================================================= */}
      {showMutationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden animate-scale-up">
            {/* Sticky Header */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Form Mutasi & Relokasi Armada Antar-Pool</h3>
                  <p className="text-xs text-on-surface-variant">
                    Penerbitan surat mutasi fisik untuk perbantuan armada antarkota, rotasi rute, atau servis besar.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMutationModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="mutation-form" onSubmit={handleSaveMutation} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">No. Surat Mutasi *</label>
                    <input
                      required
                      value={mutationForm.mutationNumber}
                      onChange={(e) => setMutationForm({ ...mutationForm, mutationNumber: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Armada yang Dipindahkan *</label>
                    <select
                      value={mutationForm.busId}
                      onChange={(e) => handleMutationBusChange(e.target.value)}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                    >
                      {busFleetOptions.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} - {b.plate} ({b.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Polisi</label>
                    <input
                      disabled
                      value={mutationForm.plate}
                      className="w-full p-2.5 bg-surface-container text-on-surface rounded-lg border border-outline-variant/20 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pool Asal (Pengirim) *</label>
                    <select
                      value={mutationForm.originPool}
                      onChange={(e) => setMutationForm({ ...mutationForm, originPool: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    >
                      {poolOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pool Tujuan (Penerima) *</label>
                    <select
                      value={mutationForm.destinationPool}
                      onChange={(e) => setMutationForm({ ...mutationForm, destinationPool: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    >
                      {poolOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Alasan Relokasi / Mutasi *</label>
                  <input
                    required
                    value={mutationForm.transferReason}
                    onChange={(e) => setMutationForm({ ...mutationForm, transferReason: e.target.value })}
                    placeholder="Contoh: Pemenuhan lonjakan arus balik di Solo"
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Driver Pengantar *</label>
                    <input
                      required
                      value={mutationForm.driverName}
                      onChange={(e) => setMutationForm({ ...mutationForm, driverName: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Odometer Saat Berangkat (KM)</label>
                    <input
                      type="number"
                      value={mutationForm.currentOdometer}
                      onChange={(e) => setMutationForm({ ...mutationForm, currentOdometer: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">PIC Dispatcher</label>
                    <input
                      required
                      value={mutationForm.dispatcherName}
                      onChange={(e) => setMutationForm({ ...mutationForm, dispatcherName: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Catatan Mutasi</label>
                  <input
                    value={mutationForm.notes}
                    onChange={(e) => setMutationForm({ ...mutationForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowMutationModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="mutation-form"
                className="px-5 py-2 rounded-lg bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Simpan & Terbitkan Surat Mutasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DETAIL & CETAK BASTK FISIK (OFFICIAL HANDOVER CERTIFICATE) */}
      {/* ========================================================================= */}
      {showPrintBASTKModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden animate-scale-up">
            {/* Sticky Header */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">print</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Pratinjau Fisik Berita Acara Serah Terima Kendaraan</h3>
                  <p className="text-xs text-on-surface-variant font-mono">
                    {selectedRecord.bastkNumber} • {selectedRecord.busId} ({selectedRecord.plate})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintBASTKModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Printable Document Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs bg-white text-slate-900 font-sans">
              {/* Kop Surat Resmi */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">PT TAYO TRANS NUSANTARA</h2>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Divisi Operasional & Manajemen Armada Bus Antarkota Antarprovinsi (AKAP)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Kantor Pusat: Gedung Terminal Terpadu Pulogebang Lt. 3, Cakung, Jakarta Timur • Telp: (021) 4870-9821
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-xs">
                    FORM-OPS-BASTK-01
                  </span>
                </div>
              </div>

              {/* Judul Dokumen */}
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold uppercase tracking-wider underline text-slate-900">
                  BERITA ACARA SERAH TERIMA KENDARAAN (BASTK)
                </h3>
                <p className="font-mono text-xs text-slate-600">
                  Nomor Registrasi: <strong>{selectedRecord.bastkNumber}</strong>
                </p>
              </div>

              {/* Paragraf Pembuka */}
              <p className="leading-relaxed text-slate-700">
                Pada hari ini, tanggal <strong>{selectedRecord.date}</strong> pukul <strong>{selectedRecord.time}</strong>, bertempat di <strong>{selectedRecord.destinationPool}</strong>, telah dilakukan serah terima fisik armada bus dengan rincian data sebagai berikut:
              </p>

              {/* Tabel Data Armada & Pengemudi */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-600 w-1/4">No. Lambung Armada</td>
                      <td className="py-2 px-3 font-bold font-mono text-slate-900 w-1/4">{selectedRecord.busId}</td>
                      <td className="py-2 px-3 font-semibold text-slate-600 w-1/4">Nomor Polisi (Plat)</td>
                      <td className="py-2 px-3 font-bold font-mono text-slate-900 w-1/4">{selectedRecord.plate}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-600">Tipe Sasis & Mesin</td>
                      <td className="py-2 px-3 text-slate-800" colSpan={3}>{selectedRecord.chassis || 'Scania K410IB 6x2*4'}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-600">Pool Asal</td>
                      <td className="py-2 px-3 text-slate-800">{selectedRecord.originPool}</td>
                      <td className="py-2 px-3 font-semibold text-slate-600">Pool Penerima</td>
                      <td className="py-2 px-3 text-slate-800">{selectedRecord.destinationPool}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-600">Nama Pengemudi Utama</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{selectedRecord.driverName}</td>
                      <td className="py-2 px-3 font-semibold text-slate-600">Co-Driver / Kru</td>
                      <td className="py-2 px-3 text-slate-800">{selectedRecord.coDriverName || '-'}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-600">Dispatcher Penerima</td>
                      <td className="py-2 px-3 font-bold text-slate-900" colSpan={3}>{selectedRecord.dispatcherName}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tabel Verifikasi Fisik & Telematika */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Hasil Rekonsiliasi Telematika & Verifikasi Fisik
                </h4>
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-600 w-1/3">Odometer CAN-bus Telematics</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{selectedRecord.canbusOdometer.toLocaleString('id-ID')} KM</td>
                        <td className="py-2 px-3 text-slate-500 text-[10px]">Data ECU IoT Server</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-600">Odometer Fisik Dashboard</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{selectedRecord.physicalOdometer.toLocaleString('id-ID')} KM</td>
                        <td className="py-2 px-3 text-slate-500 text-[10px]">Pengecekan visual ramp</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-600">Selisih Deviasi Odometer</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">
                          {selectedRecord.odometerDiff > 0 ? `+${selectedRecord.odometerDiff}` : selectedRecord.odometerDiff} KM
                        </td>
                        <td className="py-2 px-3 font-semibold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${Math.abs(selectedRecord.odometerDiff) <= 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {Math.abs(selectedRecord.odometerDiff) <= 5 ? 'Toleransi Wajar (≤ 5 KM)' : 'Perlu Investigasi Deviasi'}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-600">Kondisi Bahan Bakar Solar</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900" colSpan={2}>
                          {selectedRecord.fuelLiters} Liter ({selectedRecord.fuelLevelPercent}%) • AdBlue: {selectedRecord.adBlueLevel || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-600">Dokumen STNK & Uji KIR Fisik</td>
                        <td className="py-2 px-3 font-semibold text-slate-900" colSpan={2}>
                          {selectedRecord.documentsComplete ? '✓ Lengkap & Sah di Dashboard' : '✗ Tidak Lengkap (Catat Berita Acara)'}
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-600">Peralatan Tanggap Darurat & Safety</td>
                        <td className="py-2 px-3 font-semibold text-slate-900" colSpan={2}>
                          {selectedRecord.safetyItemsComplete ? '✓ APAR, P3K & Palu Pemecah Kaca Lengkap' : '✗ Peralatan Darurat Kurang'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-600">Fasilitas Penumpang & Sanitasi</td>
                        <td className="py-2 px-3 text-slate-800" colSpan={2}>
                          {selectedRecord.passengerAmenitiesCount} • Toilet: {selectedRecord.toiletStatus} • Kabin: {selectedRecord.cabinCleanliness}
                        </td>
                      </tr>
                      {selectedRecord.driverComplaint && (
                        <tr className="bg-red-50 text-red-900">
                          <td className="py-2 px-3 font-bold">Keluhan Teknis Pengemudi</td>
                          <td className="py-2 px-3 font-semibold" colSpan={2}>
                            ⚠ {selectedRecord.driverComplaint}
                          </td>
                        </tr>
                      )}
                      <tr className="bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-600">Status Disposisi Akhir</td>
                        <td className="py-2 px-3 font-bold text-slate-900" colSpan={2}>
                          {selectedRecord.handoverStatus}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Blok Tanda Tangan Resmi (Driver & Dispatcher) */}
              <div className="pt-6">
                <p className="text-[11px] text-slate-600 mb-6">
                  Demikian Berita Acara Serah Terima Kendaraan ini dibuat dengan sebenarnya dalam rangkap 2 (dua) untuk dipergunakan sebagaimana mestinya.
                </p>

                <div className="grid grid-cols-2 gap-8 text-center pt-2">
                  <div className="space-y-16">
                    <div>
                      <span className="text-[11px] text-slate-600 block">Yang Menyerahkan,</span>
                      <span className="font-bold text-slate-900">Pengemudi / Kru Bus</span>
                    </div>
                    <div>
                      <div className="w-48 border-b border-slate-900 mx-auto" />
                      <span className="font-bold text-slate-900 block mt-1">({selectedRecord.driverName})</span>
                      <span className="text-[10px] text-slate-500">NIK / ID Driver</span>
                    </div>
                  </div>

                  <div className="space-y-16">
                    <div>
                      <span className="text-[11px] text-slate-600 block">Yang Menerima,</span>
                      <span className="font-bold text-slate-900">Dispatcher Ramp Pool</span>
                    </div>
                    <div>
                      <div className="w-48 border-b border-slate-900 mx-auto" />
                      <span className="font-bold text-slate-900 block mt-1">({selectedRecord.dispatcherName})</span>
                      <span className="text-[10px] text-slate-500">Cap & Tanda Tangan Pool</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                onClick={() => setShowPrintBASTKModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold cursor-pointer transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  triggerToast(`Mencetak dokumen fisik BASTK ${selectedRecord.bastkNumber}...`);
                  window.print();
                }}
                className="px-5 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                Cetak / Download PDF BASTK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
