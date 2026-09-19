import React, { useState, useMemo } from 'react';
import { mockBuses } from '../data/mockFleet';
import { mockParts } from '../data/mockInventory';
import {
  MaintenanceSPKItem,
  SPKPartRequisition,
  SPKStatus,
  SPKPriority,
  SPKMaintenanceType,
  SPKSubsystem,
} from '../types';

// Initial Mock SPK Data
const initialSPKs: MaintenanceSPKItem[] = [
  {
    id: 'SPK-2024-1108',
    spkNumber: 'SPK-2024-1108',
    date: '18 Okt 2024, 08:30 WIB',
    targetDate: '19 Okt 2024, 12:00 WIB',
    busId: 'TY-082',
    plate: 'B 7942 KGA',
    chassis: 'Hino RM280 Space Frame ABS',
    odometer: '142.100 Km',
    pool: 'Pulogebang (Jkt)',
    bay: 'Bay 03 (Heavy Repair)',
    source: 'Ramp Check Pre-Trip',
    refNumber: 'INSP-20241018-TY082',
    maintenanceType: 'Corrective Repair',
    subsystem: 'Pengereman & Pneumatik',
    priority: 'Kritis (Grounded)',
    complaint: 'Kebocoran katup relay pneumatic & sensor ABS roda belakang kanan menyala terus saat pengereman.',
    plannedAction: 'Penggantian Relay Valve WABCO, pembersihan sensor speed ABS, dan bleeding jalur angin pengereman.',
    foreman: 'Bambang Supriyanto',
    leadMechanic: 'Slamet Widodo',
    assistantMechanic: 'Dedi Kurniawan',
    estimatedHours: 6,
    progressPercent: 35,
    status: 'Menunggu Part',
    parts: [
      {
        id: 'PART-01',
        partName: 'Relay Valve WABCO Pneumatic 973011',
        sku: 'ADR-WBC-011',
        quantity: 1,
        unit: 'Pcs',
        unitPrice: 1850000,
        isAvailable: false,
      },
      {
        id: 'PART-02',
        partName: 'Sensor ABS Speed Sensor Rear Wheel',
        sku: 'ELE-ABS-099',
        quantity: 1,
        unit: 'Pcs',
        unitPrice: 650000,
        isAvailable: true,
      },
    ],
    laborCost: 450000,
    partsCost: 2500000,
    totalCost: 2950000,
    notes: 'Unit dinyatakan Grounded pada ramp check pagi. Spare part relay valve sedang dijemput dari gudang pusat.',
  },
  {
    id: 'SPK-2024-1104',
    spkNumber: 'SPK-2024-1104',
    date: '17 Okt 2024, 14:15 WIB',
    targetDate: '18 Okt 2024, 18:00 WIB',
    busId: 'TY-043',
    plate: 'L 7801 UA',
    chassis: 'Mercedes-Benz OH 1626 L',
    odometer: '80.450 Km',
    pool: 'Medaeng SBY',
    bay: 'Pit Stop 01 (Kaki-Kaki & Kopling)',
    source: 'Servis Berkala (PM)',
    refNumber: 'PM-80K-TY043',
    maintenanceType: 'Preventive Maintenance',
    subsystem: 'Transmisi & Kopling',
    priority: 'Normal',
    complaint: 'Paket Servis Rutin 80K KM: Penggantian kampas kopling (Clutch Disc & Cover) dan flush oli retarder.',
    plannedAction: 'Bongkar transmisi ZF Ecolife, pasang Clutch Disc & Pressure Plate baru, ganti fluida oli transmisi sintetis.',
    foreman: 'Gunawan Prasetyo',
    leadMechanic: 'Hendra Saputra',
    assistantMechanic: 'Agus Prayitno',
    estimatedHours: 8,
    progressPercent: 70,
    status: 'Dikerjakan',
    parts: [
      {
        id: 'PART-03',
        partName: 'Kampas Kopling Clutch Disc MB OH 1626',
        sku: 'CLT-MB-1626',
        quantity: 1,
        unit: 'Set',
        unitPrice: 2850000,
        isAvailable: true,
      },
      {
        id: 'PART-04',
        partName: 'Oli Transmisi Sintetis Heavy Duty',
        sku: 'OIL-TRN-7590',
        quantity: 12,
        unit: 'Liter',
        unitPrice: 95000,
        isAvailable: true,
      },
    ],
    laborCost: 750000,
    partsCost: 3990000,
    totalCost: 4740000,
    notes: 'Proses perakitan kembali plat penekan kopling. Target uji dyno sore ini.',
  },
  {
    id: 'SPK-2024-1110',
    spkNumber: 'SPK-2024-1110',
    date: '18 Okt 2024, 07:00 WIB',
    targetDate: '18 Okt 2024, 15:00 WIB',
    busId: 'T-015',
    plate: 'B 7123 VGA',
    chassis: 'Mercedes-Benz OH 1626 L',
    odometer: '84.320 Km',
    pool: 'Pulogebang (Jkt)',
    bay: 'Bay 02 (PM & Pelumas)',
    source: 'Servis Berkala (PM)',
    refNumber: 'PM-RUTIN-T015',
    maintenanceType: 'Preventive Maintenance',
    subsystem: 'Mesin & Bahan Bakar',
    priority: 'Normal',
    complaint: 'Ganti Oli Mesin Delvac MX 15W-40, ganti Filter Oli MB, dan ganti Filter Separator Solar Racor 1000FH.',
    plannedAction: 'Kuras oli mesin, ganti elemen filter oli dan solar, cek kebocoran seal carter, dan reset service indicator.',
    foreman: 'Bambang Supriyanto',
    leadMechanic: 'Rudi Santoso',
    estimatedHours: 3,
    progressPercent: 90,
    status: 'Uji Kelaikan',
    parts: [
      {
        id: 'PART-05',
        partName: 'Oli Delvac MX 15W-40 (Drum)',
        sku: 'OIL-DLV-1540',
        quantity: 28,
        unit: 'Liter',
        unitPrice: 46500,
        isAvailable: true,
      },
      {
        id: 'PART-06',
        partName: 'Filter Oli Mesin OM906LA MB',
        sku: 'FLT-MB-906',
        quantity: 1,
        unit: 'Pcs',
        unitPrice: 320000,
        isAvailable: true,
      },
      {
        id: 'PART-07',
        partName: 'Filter Solar Separator Racor 1000FH',
        sku: 'FLT-RCR-1000',
        quantity: 1,
        unit: 'Pcs',
        unitPrice: 420000,
        isAvailable: true,
      },
    ],
    laborCost: 350000,
    partsCost: 2042000,
    totalCost: 2392000,
    notes: 'Pekerjaan selesai, sedang dilakukan pengecekan tekanan kompresi dan warm-up engine oleh QC.',
  },
  {
    id: 'SPK-2024-1102',
    spkNumber: 'SPK-2024-1102',
    date: '18 Okt 2024, 09:15 WIB',
    targetDate: '19 Okt 2024, 17:00 WIB',
    busId: 'T-044',
    plate: 'L 7801 UA',
    chassis: 'Mercedes-Benz O 500 RS 1836',
    odometer: '312.800 Km',
    pool: 'Pulogebang (Jkt)',
    bay: 'Bay 01 (Overhaul & Suspensi)',
    source: 'Keluhan Driver',
    refNumber: 'LAP-DRV-044',
    maintenanceType: 'Corrective Repair',
    subsystem: 'Suspensi & Kaki-Kaki',
    priority: 'Tinggi',
    complaint: 'Ketinggian bodi bus miring ke kiri belakang saat parkir semalaman. Indikasi kebocoran pada Balon Air Suspension.',
    plannedAction: 'Inspeksi balon air suspension kiri belakang, cek selang pneumatic leveling valve, ganti bellow jika ada keretakan karet.',
    foreman: 'Bambang Supriyanto',
    leadMechanic: 'Slamet Widodo',
    estimatedHours: 5,
    progressPercent: 15,
    status: 'Antrean',
    parts: [
      {
        id: 'PART-08',
        partName: 'Balon Air Suspension Bellow 941 MB',
        sku: 'SUS-CNT-941',
        quantity: 1,
        unit: 'Pcs',
        unitPrice: 1750000,
        isAvailable: true,
      },
    ],
    laborCost: 400000,
    partsCost: 1750000,
    totalCost: 2150000,
    notes: 'Unit dijadwalkan masuk Bay 01 pukul 13:00 WIB setelah selesai giliran unit T-015.',
  },
  {
    id: 'SPK-2024-1095',
    spkNumber: 'SPK-2024-1095',
    date: '16 Okt 2024, 10:00 WIB',
    targetDate: '17 Okt 2024, 16:00 WIB',
    busId: 'T-102',
    plate: 'AD 1880 CF',
    chassis: 'Hino RM280 Space Frame',
    odometer: '142.100 Km',
    pool: 'Solo Tirtonadi',
    bay: 'Bay 04 (AC & Kelistrikan)',
    source: 'Breakdown Jalur',
    refNumber: 'BD-SOLO-102',
    maintenanceType: 'Corrective Repair',
    subsystem: 'Kelistrikan, AC & Instrument',
    priority: 'Normal',
    complaint: 'Pengisian baterai drop (indikator aki menyala saat bus jalan). Alternator panas berlebih.',
    plannedAction: 'Overhaul Alternator 24V 150A, ganti bearing rotor, carbon brush, dan pasang Vanbelt AC/Alternator baru.',
    foreman: 'Budi Santoso',
    leadMechanic: 'Agus Prasetya',
    estimatedHours: 6,
    progressPercent: 100,
    status: 'Selesai',
    parts: [
      {
        id: 'PART-09',
        partName: 'Carbon Brush & Rectifier Kit Alternator 24V',
        sku: 'ELE-ALT-024',
        quantity: 1,
        unit: 'Set',
        unitPrice: 550000,
        isAvailable: true,
      },
      {
        id: 'PART-10',
        partName: 'Vanbelt Alternator Hino J08E',
        sku: 'BLT-HN-008',
        quantity: 2,
        unit: 'Pcs',
        unitPrice: 165000,
        isAvailable: true,
      },
    ],
    laborCost: 450000,
    partsCost: 880000,
    totalCost: 1330000,
    notes: 'Selesai dan telah dilakukan test tegangan stabil di 27.8 Volt. Unit telah dirilis siap jalan.',
    completionNotes: 'QC Passed by Joko Widodo (Lead QC). Output alternator 28V 140A prima.',
  },
];

export const PerawatanSPKScreen: React.FC = () => {
  // Data State
  const [spkList, setSpkList] = useState<MaintenanceSPKItem[]>(initialSPKs);
  const [activeTab, setActiveTab] = useState<'bay_kanban' | 'all_table' | 'sop_catalog'>('bay_kanban');

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [poolFilter, setPoolFilter] = useState<string>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [selectedSPK, setSelectedSPK] = useState<MaintenanceSPKItem | null>(null);

  // Form State: Penerbitan SPK Baru
  const [formBusId, setFormBusId] = useState<string>('TY-082');
  const [formSource, setFormSource] = useState<MaintenanceSPKItem['source']>('Ramp Check Pre-Trip');
  const [formRefNumber, setFormRefNumber] = useState<string>('INSP-20241018-01');
  const [formMaintenanceType, setFormMaintenanceType] = useState<SPKMaintenanceType>('Corrective Repair');
  const [formSubsystem, setFormSubsystem] = useState<SPKSubsystem>('Pengereman & Pneumatik');
  const [formPriority, setFormPriority] = useState<SPKPriority>('Kritis (Grounded)');
  const [formOdometer, setFormOdometer] = useState<string>('142.100 Km');
  const [formPool, setFormPool] = useState<string>('Pulogebang (Jkt)');
  const [formBay, setFormBay] = useState<string>('Bay 03 (Heavy Repair)');
  const [formTargetDate, setFormTargetDate] = useState<string>('19 Okt 2024, 15:00 WIB');
  const [formComplaint, setFormComplaint] = useState<string>('Tekanan kompresor udara tidak stabil dan terdengar desis kebocoran pada valve.');
  const [formPlannedAction, setFormPlannedAction] = useState<string>('Pemeriksaan valve manifold, uji kebocoran air brake soap bubble test, dan penggantian seal/part.');
  const [formForeman, setFormForeman] = useState<string>('Bambang Supriyanto');
  const [formLeadMechanic, setFormLeadMechanic] = useState<string>('Slamet Widodo');
  const [formAssistantMechanic, setFormAssistantMechanic] = useState<string>('Dedi Kurniawan');
  const [formEstimatedHours, setFormEstimatedHours] = useState<number>(4);
  const [formLaborCost, setFormLaborCost] = useState<number>(400000);
  const [formNotes, setFormNotes] = useState<string>('Prioritaskan pengerjaan agar unit dapat dirilis sebelum jadwal keberangkatan malam.');

  // Part Requisition dynamic rows in form
  const [formParts, setFormParts] = useState<SPKPartRequisition[]>([
    {
      id: 'P-NEW-1',
      partName: 'Air Dryer Cartridge Pneumatic',
      sku: 'ADR-WBC-011',
      quantity: 1,
      unit: 'Pcs',
      unitPrice: 890000,
      isAvailable: true,
    },
  ]);

  // Form input part fields
  const [selectedPartSku, setSelectedPartSku] = useState<string>(mockParts[0]?.sku || '');
  const [partQty, setPartQty] = useState<number>(1);

  // Progress Update Modal State
  const [progressValue, setProgressValue] = useState<number>(50);
  const [progressStatus, setProgressStatus] = useState<SPKStatus>('Dikerjakan');
  const [progressNotes, setProgressNotes] = useState<string>('');

  // Handle bus change in form
  const handleBusSelect = (busId: string) => {
    setFormBusId(busId);
    const bus = mockBuses.find((b) => b.id === busId);
    if (bus) {
      setFormOdometer(bus.odo);
      setFormPool(bus.pool.includes('Pool') ? bus.pool : `Pool ${bus.pool}`);
    }
  };

  // Add Part to Form Table
  const handleAddPart = () => {
    const partObj = mockParts.find((p) => p.sku === selectedPartSku);
    if (!partObj) return;

    // Parse price number
    const numericPrice = parseInt(partObj.price.replace(/[^0-9]/g, ''), 10) || 0;

    const newPart: SPKPartRequisition = {
      id: `P-REQ-${Date.now()}`,
      partName: partObj.name,
      sku: partObj.sku,
      quantity: partQty,
      unit: partObj.stock.includes('L') ? 'Liter' : partObj.stock.includes('Set') ? 'Set' : 'Pcs',
      unitPrice: numericPrice,
      isAvailable: !partObj.isCrit,
    };

    setFormParts([...formParts, newPart]);
    setPartQty(1);
  };

  // Remove Part from Form Table
  const handleRemovePart = (id: string) => {
    setFormParts(formParts.filter((p) => p.id !== id));
  };

  // Calculate totals
  const totalPartsCost = useMemo(() => {
    return formParts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
  }, [formParts]);

  const grandTotalCost = useMemo(() => {
    return totalPartsCost + (Number(formLaborCost) || 0);
  }, [totalPartsCost, formLaborCost]);

  // Format IDR Currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Submit New SPK
  const handleCreateSPK = (e: React.FormEvent) => {
    e.preventDefault();
    const bus = mockBuses.find((b) => b.id === formBusId) || mockBuses[0];
    const generatedSpkNum = `SPK-${new Date().getFullYear()}-${Math.floor(1100 + Math.random() * 900)}`;

    const newSpk: MaintenanceSPKItem = {
      id: generatedSpkNum,
      spkNumber: generatedSpkNum,
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      targetDate: formTargetDate,
      busId: bus.id,
      plate: bus.plate,
      chassis: bus.chassis,
      odometer: formOdometer,
      pool: formPool,
      bay: formBay,
      source: formSource,
      refNumber: formRefNumber || undefined,
      maintenanceType: formMaintenanceType,
      subsystem: formSubsystem,
      priority: formPriority,
      complaint: formComplaint,
      plannedAction: formPlannedAction,
      foreman: formForeman,
      leadMechanic: formLeadMechanic,
      assistantMechanic: formAssistantMechanic || undefined,
      estimatedHours: formEstimatedHours,
      progressPercent: 0,
      status: 'Antrean',
      parts: formParts,
      laborCost: formLaborCost,
      partsCost: totalPartsCost,
      totalCost: grandTotalCost,
      notes: formNotes,
    };

    setSpkList([newSpk, ...spkList]);
    setShowAddModal(false);
    setSelectedSPK(newSpk);

    alert(`Surat Perintah Kerja (SPK) Berhasil Diterbitkan!\nNomor: ${generatedSpkNum}\nUnit: ${bus.id} (${bus.plate})\nDialokasikan ke: ${formBay}`);
  };

  // Open progress update modal
  const openProgressModal = (spk: MaintenanceSPKItem) => {
    setSelectedSPK(spk);
    setProgressValue(spk.progressPercent);
    setProgressStatus(spk.status);
    setProgressNotes(spk.completionNotes || spk.notes || '');
    setShowProgressModal(true);
  };

  // Save Progress Update
  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSPK) return;

    const updatedList = spkList.map((item) => {
      if (item.id === selectedSPK.id) {
        return {
          ...item,
          progressPercent: progressValue,
          status: progressStatus,
          completionNotes: progressStatus === 'Selesai' ? progressNotes : item.completionNotes,
          notes: progressNotes || item.notes,
        };
      }
      return item;
    });

    setSpkList(updatedList);
    setShowProgressModal(false);
    alert(`Status SPK ${selectedSPK.spkNumber} berhasil diperbarui menjadi "${progressStatus}" (${progressValue}%).`);
  };

  // Open Print Modal
  const openPrintModal = (spk: MaintenanceSPKItem) => {
    setSelectedSPK(spk);
    setShowPrintModal(true);
  };

  // Filtered SPK List
  const filteredSPK = useMemo(() => {
    return spkList.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        item.spkNumber.toLowerCase().includes(q) ||
        item.busId.toLowerCase().includes(q) ||
        item.plate.toLowerCase().includes(q) ||
        item.chassis.toLowerCase().includes(q) ||
        item.complaint.toLowerCase().includes(q) ||
        item.leadMechanic.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || item.priority.toLowerCase().includes(priorityFilter.toLowerCase());
      const matchPool = poolFilter === 'all' || item.pool.toLowerCase().includes(poolFilter.toLowerCase());

      return matchQuery && matchStatus && matchPriority && matchPool;
    });
  }, [spkList, searchQuery, statusFilter, priorityFilter, poolFilter]);

  // Workshop Summary Metrics
  const metrics = useMemo(() => {
    const total = spkList.length;
    const critical = spkList.filter((s) => s.priority === 'Kritis (Grounded)' && s.status !== 'Selesai').length;
    const inProgress = spkList.filter((s) => s.status === 'Dikerjakan').length;
    const waitingPart = spkList.filter((s) => s.status === 'Menunggu Part').length;
    const completed = spkList.filter((s) => s.status === 'Selesai').length;
    return { total, critical, inProgress, waitingPart, completed };
  }, [spkList]);

  return (
    <div className="flex flex-col w-full space-y-6 pb-12">
      {/* Header & Page Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-container pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">build_circle</span>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Work Order SPK & Preventive Maintenance</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Sistem penerbitan Surat Perintah Kerja (SPK), manajemen antrean bay bengkel, pengalokasian mekanik, dan permohonan suku cadang PO Bus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            + Terbitkan SPK Baru
          </button>
        </div>
      </div>

      {/* Workshop Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">assignment</span>
          </div>
          <div>
            <span className="text-[11px] text-on-surface-variant block font-medium">Total SPK Aktif</span>
            <span className="text-xl font-black text-on-surface">{metrics.total} SPK</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-xl border border-red-200 dark:border-red-900/40 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">car_crash</span>
          </div>
          <div>
            <span className="text-[11px] text-error block font-bold">Kritis (Grounded)</span>
            <span className="text-xl font-black text-error">{metrics.critical} Unit</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-xl border border-blue-200 dark:border-blue-900/40 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">engineering</span>
          </div>
          <div>
            <span className="text-[11px] text-blue-700 block font-medium">Sedang Dikerjakan</span>
            <span className="text-xl font-black text-blue-900 dark:text-blue-200">{metrics.inProgress} Bay</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-xl border border-amber-200 dark:border-amber-900/40 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">pending_actions</span>
          </div>
          <div>
            <span className="text-[11px] text-amber-700 block font-medium">Menunggu Part (WAPV)</span>
            <span className="text-xl font-black text-amber-900 dark:text-amber-200">{metrics.waitingPart} SPK</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">task_alt</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-700 block font-medium">Selesai (Closed)</span>
            <span className="text-xl font-black text-emerald-800 dark:text-emerald-300">{metrics.completed} SPK</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs & Quick Filters */}
      <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container pb-3">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/20 self-start">
            <button
              onClick={() => setActiveTab('bay_kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bay_kanban'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_kanban</span>
              Papan Antrean Workshop ({metrics.total - metrics.completed} Aktif)
            </button>

            <button
              onClick={() => setActiveTab('all_table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all_table'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              Daftar Seluruh SPK ({spkList.length})
            </button>

            <button
              onClick={() => setActiveTab('sop_catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sop_catalog'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Katalog Servis & SOP
            </button>
          </div>

          {/* Quick Stats Indicator */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Workshop Terhubung: <strong>Pool Pulogebang, Solo & SBY</strong></span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Cari No SPK, Armada, Keluhan, Mekanik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Status Pengerjaan</option>
              <option value="Antrean">Antrean (Pending)</option>
              <option value="Dikerjakan">Dikerjakan (In-Progress)</option>
              <option value="Menunggu Part">Menunggu Part (WAPV)</option>
              <option value="Uji Kelaikan">Uji Kelaikan (QC/Test)</option>
              <option value="Selesai">Selesai (Closed)</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full p-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Tingkat Prioritas</option>
              <option value="kritis">Kritis (Grounded)</option>
              <option value="tinggi">Tinggi</option>
              <option value="normal">Normal / Sedang</option>
              <option value="rendah">Rendah</option>
            </select>
          </div>

          <div>
            <select
              value={poolFilter}
              onChange={(e) => setPoolFilter(e.target.value)}
              className="w-full p-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Workshop Pool</option>
              <option value="pulogebang">Pool Pulogebang (Jkt)</option>
              <option value="medaeng">Pool Medaeng (SBY)</option>
              <option value="solo">Pool Solo Tirtonadi</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: KANBAN PAPAN ANTREAN BAY ================= */}
      {activeTab === 'bay_kanban' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Kolom 1: Antrean (Pending) */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <h3 className="text-xs font-black text-on-surface uppercase tracking-wider">Antrean Masuk Bay</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                  {filteredSPK.filter((s) => s.status === 'Antrean').length}
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1">
                {filteredSPK
                  .filter((s) => s.status === 'Antrean')
                  .map((spk) => (
                    <SPKCard
                      key={spk.id}
                      spk={spk}
                      onUpdateProgress={() => openProgressModal(spk)}
                      onPrint={() => openPrintModal(spk)}
                    />
                  ))}
                {filteredSPK.filter((s) => s.status === 'Antrean').length === 0 && (
                  <div className="py-8 text-center text-xs text-on-surface-variant/60 italic">
                    Tidak ada antrean pending.
                  </div>
                )}
              </div>
            </div>

            {/* Kolom 2: Menunggu Part (WAPV) */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-amber-200 dark:border-amber-900/30 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">Menunggu Part (WAPV)</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {filteredSPK.filter((s) => s.status === 'Menunggu Part').length}
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1">
                {filteredSPK
                  .filter((s) => s.status === 'Menunggu Part')
                  .map((spk) => (
                    <SPKCard
                      key={spk.id}
                      spk={spk}
                      onUpdateProgress={() => openProgressModal(spk)}
                      onPrint={() => openPrintModal(spk)}
                    />
                  ))}
                {filteredSPK.filter((s) => s.status === 'Menunggu Part').length === 0 && (
                  <div className="py-8 text-center text-xs text-on-surface-variant/60 italic">
                    Semua spare part tersedia di gudang.
                  </div>
                )}
              </div>
            </div>

            {/* Kolom 3: Dikerjakan (In-Progress) */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-blue-200 dark:border-blue-900/30 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                  <h3 className="text-xs font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider">Dikerjakan Mekanik</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {filteredSPK.filter((s) => s.status === 'Dikerjakan').length}
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1">
                {filteredSPK
                  .filter((s) => s.status === 'Dikerjakan')
                  .map((spk) => (
                    <SPKCard
                      key={spk.id}
                      spk={spk}
                      onUpdateProgress={() => openProgressModal(spk)}
                      onPrint={() => openPrintModal(spk)}
                    />
                  ))}
                {filteredSPK.filter((s) => s.status === 'Dikerjakan').length === 0 && (
                  <div className="py-8 text-center text-xs text-on-surface-variant/60 italic">
                    Tidak ada pekerjaan aktif saat ini.
                  </div>
                )}
              </div>
            </div>

            {/* Kolom 4: Uji Kelaikan (QC) & Selesai */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-emerald-200 dark:border-emerald-900/30 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">Uji QC & Selesai</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {filteredSPK.filter((s) => s.status === 'Uji Kelaikan' || s.status === 'Selesai').length}
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1">
                {filteredSPK
                  .filter((s) => s.status === 'Uji Kelaikan' || s.status === 'Selesai')
                  .map((spk) => (
                    <SPKCard
                      key={spk.id}
                      spk={spk}
                      onUpdateProgress={() => openProgressModal(spk)}
                      onPrint={() => openPrintModal(spk)}
                    />
                  ))}
                {filteredSPK.filter((s) => s.status === 'Uji Kelaikan' || s.status === 'Selesai').length === 0 && (
                  <div className="py-8 text-center text-xs text-on-surface-variant/60 italic">
                    Belum ada unit yang masuk tahap QC.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: DATATABLE LENGKAP ================= */}
      {activeTab === 'all_table' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant uppercase font-semibold border-b border-surface-container">
                  <th className="py-3 px-4">No SPK & Tgl</th>
                  <th className="py-3 px-4">Armada & Lokasi Bay</th>
                  <th className="py-3 px-4">Keluhan & Lingkup Servis</th>
                  <th className="py-3 px-4">Mekanik & Sub-Sistem</th>
                  <th className="py-3 px-4">Prioritas</th>
                  <th className="py-3 px-4">Estimasi Biaya</th>
                  <th className="py-3 px-4">Progres & Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredSPK.map((spk) => (
                  <tr key={spk.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-primary block">{spk.spkNumber}</span>
                      <span className="text-[11px] text-on-surface-variant block">{spk.date}</span>
                      <span className="text-[10px] text-outline">Ref: {spk.source}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-on-surface">{spk.busId}</span>
                        <span className="text-[11px] font-mono text-on-surface-variant">({spk.plate})</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant block">{spk.chassis}</span>
                      <span className="text-[10px] font-semibold text-primary block mt-0.5">
                        📍 {spk.bay} ({spk.pool})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-on-surface block line-clamp-1">{spk.complaint}</span>
                      <span className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{spk.plannedAction}</span>
                      <span className="text-[10px] text-outline block mt-0.5">Odo: {spk.odometer}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-on-surface block">🛠️ {spk.leadMechanic}</span>
                      <span className="text-[10px] text-on-surface-variant block">Foreman: {spk.foreman}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant inline-block mt-1">
                        {spk.subsystem}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={spk.priority} />
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold font-mono text-on-surface block">{formatRupiah(spk.totalCost)}</span>
                      <span className="text-[10px] text-on-surface-variant block">
                        Part: {formatRupiah(spk.partsCost)} • Jasa: {formatRupiah(spk.laborCost)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={spk.status} />
                      <div className="w-24 bg-surface-container-high rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            spk.status === 'Selesai'
                              ? 'bg-emerald-500'
                              : spk.status === 'Menunggu Part'
                              ? 'bg-amber-500'
                              : 'bg-primary'
                          }`}
                          style={{ width: `${spk.progressPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-outline block mt-0.5">{spk.progressPercent}% selesai</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openProgressModal(spk)}
                          title="Update Progres & Status"
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                        <button
                          onClick={() => openPrintModal(spk)}
                          title="Cetak Lembar SPK"
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSPK.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2 block">content_paste_off</span>
                      Tidak ada data Surat Perintah Kerja (SPK) yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: KATALOG SERVIS & STANDAR SOP ================= */}
      {activeTab === 'sop_catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
                Standar Paket Preventive Maintenance (PM) Armada AKAP
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Jadwal servis berkala preventif wajib dilaksanakan berdasarkan interval odometer untuk mencegah breakdown di jalan tol dan mempertahankan garansi pabrikan chasis (Mercedes-Benz, Scania, Hino).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-primary">PM 10K - 20K Km (Minor Service)</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px]">Bay 02</span>
                  </div>
                  <ul className="list-disc list-inside text-on-surface-variant space-y-1 text-[11px]">
                    <li>Ganti Oli Mesin Sintetis (24L - 28L)</li>
                    <li>Ganti Filter Oli Utama & Filter Solar Atas</li>
                    <li>Pembersihan Elemen Filter Udara & Grease Chassis Nipple</li>
                    <li>Pemeriksaan Tekanan Barometer Rem Udara & Water Drain Tank</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-blue-700">PM 40K - 60K Km (Intermediate)</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">Bay 02 / 03</span>
                  </div>
                  <ul className="list-disc list-inside text-on-surface-variant space-y-1 text-[11px]">
                    <li>Paket Servis 10K Km lengkap</li>
                    <li>Ganti Filter Separator Solar Racor 1000FH & Air Dryer Desiccant</li>
                    <li>Penggantian Oli Transmisi & Oli Gardan (Differential)</li>
                    <li>Inspeksi Ketebalan Kampas Rem & Slack Adjuster</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-purple-700">PM 80K - 100K Km (Major Overhaul)</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px]">Pit Stop 01</span>
                  </div>
                  <ul className="list-disc list-inside text-on-surface-variant space-y-1 text-[11px]">
                    <li>Penggantian Kampas Kopling (Clutch Disc & Cover)</li>
                    <li>Flush Cairan Retarder & Ganti Coolant Radiator Heavy Duty</li>
                    <li>Inspeksi Balon Air Suspension, Shock Absorber & Kingpin</li>
                    <li>Kalibrasi Sensor ABS & Diagnostic Scan Scanner OBD</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-error">Protokol Penanganan Grounded</span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-error text-[10px]">SPK Kritis</span>
                  </div>
                  <ul className="list-disc list-inside text-on-surface-variant space-y-1 text-[11px]">
                    <li>Unit yang gagal Ramp Check Pre-Trip otomatis berstatus Grounded</li>
                    <li>Kunci kontak unit diserahkan ke Foreman Workshop</li>
                    <li>SPJ ditahan di sistem dispatch operasional</li>
                    <li>Wajib uji kelaikan QC sebelum SPK dapat ditutup (Closed)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                Daftar Bay Workshop & Fasilitas
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="font-bold text-on-surface block">Bay 01 — Overhaul & Heavy Repair</span>
                  <span className="text-[11px] text-on-surface-variant">Dilengkapi crane hoist 5 ton untuk turun mesin & transmisi.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="font-bold text-on-surface block">Bay 02 — Quick Service & PM Pelumas</span>
                  <span className="text-[11px] text-on-surface-variant">Dispenser oli otomatis, pompa kuras oli vakum, grease gun drum.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="font-bold text-on-surface block">Bay 03 — Heavy Repair Pneumatik & Chasis</span>
                  <span className="text-[11px] text-on-surface-variant">Testing bench katup rem angin WABCO/Knorr-Bremse.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="font-bold text-on-surface block">Bay 04 — AC Bus & Sistem Kelistrikan</span>
                  <span className="text-[11px] text-on-surface-variant">Recovery unit freon R134a Denso, alternator tester 24V.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="font-bold text-on-surface block">Pit Stop 01 — Kolong Spooring & Kaki-Kaki</span>
                  <span className="text-[11px] text-on-surface-variant">Lorong kolong inspeksi suspensi, tie rod, brake drum.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: FORMULIR INPUT SPK BARU ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Fixed / Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">post_add</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Penerbitan Surat Perintah Kerja (SPK) Baru</h3>
                  <p className="text-xs text-on-surface-variant">
                    Formulir instruksi kerja resmi perbaikan, servis berkala, dan permohonan suku cadang workshop PO.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form id="create-spk-form" onSubmit={handleCreateSPK} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* Bagian 1: Identitas Unit & Rujukan */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-3">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">directions_bus</span>
                  1. Identitas Unit Armada & Rujukan Perawatan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Pilih Unit Armada *</label>
                    <select
                      value={formBusId}
                      onChange={(e) => handleBusSelect(e.target.value)}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {mockBuses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} — {b.plate} ({b.chassis.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Odometer Aktual *</label>
                    <input
                      type="text"
                      required
                      value={formOdometer}
                      onChange={(e) => setFormOdometer(e.target.value)}
                      placeholder="Contoh: 142.100 Km"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Sumber / Rujukan SPK *</label>
                    <select
                      value={formSource}
                      onChange={(e) => setFormSource(e.target.value as MaintenanceSPKItem['source'])}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Ramp Check Pre-Trip">Temuan Ramp Check Pre-Trip (Grounded)</option>
                      <option value="Keluhan Driver">Laporan Keluhan Pengemudi</option>
                      <option value="Servis Berkala (PM)">Jadwal Servis Berkala (PM)</option>
                      <option value="Breakdown Jalur">Mogok / Breakdown Jalur</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Nomor Referensi (Opsional)</label>
                    <input
                      type="text"
                      value={formRefNumber}
                      onChange={(e) => setFormRefNumber(e.target.value)}
                      placeholder="Contoh: INSP-20241018-01 atau LAP-DRV-102"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Target Waktu Selesai *</label>
                    <input
                      type="text"
                      required
                      value={formTargetDate}
                      onChange={(e) => setFormTargetDate(e.target.value)}
                      placeholder="Contoh: 19 Okt 2024, 15:00 WIB"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Klasifikasi, Prioritas & Alokasi Workshop */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-3">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">category</span>
                  2. Klasifikasi Pekerjaan, Prioritas & Lokasi Workshop
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Jenis Perawatan *</label>
                    <select
                      value={formMaintenanceType}
                      onChange={(e) => setFormMaintenanceType(e.target.value as SPKMaintenanceType)}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Corrective Repair">Corrective Repair (Perbaikan Kerusakan)</option>
                      <option value="Preventive Maintenance">Preventive Maintenance (Servis Berkala)</option>
                      <option value="Breakdown Jalur">Breakdown Darurat / Evakuasi</option>
                      <option value="Overhaul">Overhaul Besar (Mesin / Transmisi)</option>
                      <option value="Body Repair">Body Repair & Karoseri</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Sub-Sistem Kendaraan *</label>
                    <select
                      value={formSubsystem}
                      onChange={(e) => setFormSubsystem(e.target.value as SPKSubsystem)}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Pengereman & Pneumatik">Pengereman & Pneumatik</option>
                      <option value="Mesin & Bahan Bakar">Mesin & Bahan Bakar</option>
                      <option value="Transmisi & Kopling">Transmisi & Kopling</option>
                      <option value="Suspensi & Kaki-Kaki">Suspensi & Kaki-Kaki</option>
                      <option value="Kelistrikan, AC & Instrument">Kelistrikan, AC & Instrument</option>
                      <option value="Bodi & Interior">Bodi & Interior</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Tingkat Prioritas *</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as SPKPriority)}
                      className={`w-full p-2 rounded-lg border font-bold focus:outline-none focus:ring-2 ${
                        formPriority === 'Kritis (Grounded)'
                          ? 'bg-red-50 text-error border-red-300 dark:bg-red-950/40'
                          : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface'
                      }`}
                    >
                      <option value="Kritis (Grounded)">🚨 Kritis (Grounded / Unit Tertahan)</option>
                      <option value="Tinggi">⚠️ Tinggi (Sebelum Ritase Berikutnya)</option>
                      <option value="Normal">⚡ Normal / Sedang (Servis Rutin)</option>
                      <option value="Rendah">☕ Rendah (Pekerjaan Minor / Kosmetik)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Workshop Pool Penanganan *</label>
                    <input
                      type="text"
                      required
                      value={formPool}
                      onChange={(e) => setFormPool(e.target.value)}
                      placeholder="Contoh: Pool Pulogebang (Jkt)"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Alokasi Jalur / Bay Workshop *</label>
                    <select
                      value={formBay}
                      onChange={(e) => setFormBay(e.target.value)}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Bay 01 (Overhaul & Suspensi)">Bay 01 (Overhaul & Suspensi)</option>
                      <option value="Bay 02 (PM & Pelumas)">Bay 02 (PM & Pelumas)</option>
                      <option value="Bay 03 (Heavy Repair)">Bay 03 (Heavy Repair Pneumatik)</option>
                      <option value="Bay 04 (AC & Kelistrikan)">Bay 04 (AC & Kelistrikan)</option>
                      <option value="Pit Stop 01 (Kaki-Kaki & Kopling)">Pit Stop 01 (Kolong & Kopling)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Uraian Kerusakan & Instruksi Tindakan */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-3">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                  3. Uraian Kerusakan / Keluhan & Instruksi Tindakan Mekanik
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Deskripsi Kerusakan / Temuan Masalah *</label>
                    <textarea
                      rows={2}
                      required
                      value={formComplaint}
                      onChange={(e) => setFormComplaint(e.target.value)}
                      placeholder="Jelaskan secara detail gejala kerusakan atau item yang tidak lolos inspeksi..."
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Instruksi Tindakan Perbaikan (SOP) *</label>
                    <textarea
                      rows={2}
                      required
                      value={formPlannedAction}
                      onChange={(e) => setFormPlannedAction(e.target.value)}
                      placeholder="Langkah-langkah teknis yang harus dilakukan mekanik..."
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Bagian 4: Penugasan Tim Mekanik & Estimasi Waktu */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-3">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">engineering</span>
                  4. Alokasi Petugas Workshop & Estimasi Jasa
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Kepala Regu (Foreman) *</label>
                    <input
                      type="text"
                      required
                      value={formForeman}
                      onChange={(e) => setFormForeman(e.target.value)}
                      placeholder="Nama Foreman"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Mekanik Utama (Lead) *</label>
                    <input
                      type="text"
                      required
                      value={formLeadMechanic}
                      onChange={(e) => setFormLeadMechanic(e.target.value)}
                      placeholder="Nama Mekanik Utama"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Mekanik Asisten / Helper</label>
                    <input
                      type="text"
                      value={formAssistantMechanic}
                      onChange={(e) => setFormAssistantMechanic(e.target.value)}
                      placeholder="Nama Helper"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Estimasi Lama Pengerjaan (Jam) *</label>
                    <input
                      type="number"
                      min={1}
                      max={72}
                      required
                      value={formEstimatedHours}
                      onChange={(e) => setFormEstimatedHours(Number(e.target.value))}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Estimasi Biaya Jasa Mekanik (Rp) *</label>
                    <input
                      type="number"
                      step={50000}
                      min={0}
                      required
                      value={formLaborCost}
                      onChange={(e) => setFormLaborCost(Number(e.target.value))}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-mono font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 5: Permintaan Suku Cadang Dinamis (BOM Requisition) */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
                    5. Permintaan Suku Cadang & Bahan (Gudang Logistik)
                  </h4>
                  <span className="text-xs font-semibold text-primary">
                    {formParts.length} Komponen Terpilih
                  </span>
                </div>

                {/* Input Tambah Part */}
                <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-8">
                    <label className="font-semibold text-[11px] text-on-surface block mb-1">Pilih Suku Cadang Gudang</label>
                    <select
                      value={selectedPartSku}
                      onChange={(e) => setSelectedPartSku(e.target.value)}
                      className="w-full p-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {mockParts.map((part) => (
                        <option key={part.sku} value={part.sku}>
                          {part.name} ({part.sku}) — {part.price} [Stok: {part.stock}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[11px] text-on-surface block mb-1">Jumlah (Qty)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={partQty}
                      onChange={(e) => setPartQty(Number(e.target.value))}
                      className="w-full p-2 bg-surface-container-low rounded-lg border border-outline-variant/30 font-mono text-center text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddPart}
                      className="w-full py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      + Tambah
                    </button>
                  </div>
                </div>

                {/* Tabel Part Terpilih */}
                {formParts.length > 0 ? (
                  <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-semibold border-b border-surface-container">
                          <th className="p-2.5">Suku Cadang</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">Harga Satuan</th>
                          <th className="p-2.5 text-right">Subtotal</th>
                          <th className="p-2.5 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {formParts.map((item) => (
                          <tr key={item.id} className="hover:bg-surface-container-low/40">
                            <td className="p-2.5">
                              <span className="font-bold text-on-surface block">{item.partName}</span>
                              <span className="text-[10px] font-mono text-outline">{item.sku}</span>
                            </td>
                            <td className="p-2.5 text-center font-mono">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="p-2.5 text-right font-mono">{formatRupiah(item.unitPrice)}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-primary">
                              {formatRupiah(item.quantity * item.unitPrice)}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemovePart(item.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-dashed border-outline-variant/40 text-center text-on-surface-variant text-xs italic">
                    Belum ada suku cadang yang ditambahkan pada permohonan ini.
                  </div>
                )}

                {/* Kalkulasi Ringkasan Biaya SPK */}
                <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 text-on-surface-variant">
                    <div>Estimasi Biaya Part: <strong>{formatRupiah(totalPartsCost)}</strong></div>
                    <div>Estimasi Jasa Bengkel: <strong>{formatRupiah(formLaborCost)}</strong></div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-on-surface-variant block font-medium">Grand Total Estimasi Biaya SPK</span>
                    <span className="text-base font-black font-mono text-primary">{formatRupiah(grandTotalCost)}</span>
                  </div>
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="font-semibold text-on-surface block mb-1">Catatan Tambahan Workshop</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Instruksi pengujian khusus atau rincian darurat..."
                  className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Footer Modal - Fixed at Bottom */}
            <div className="shrink-0 px-6 py-4 border-t border-surface-container bg-surface-container-low/70 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-outline-variant/40 rounded-xl text-on-surface hover:bg-surface-container font-semibold transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                form="create-spk-form"
                className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-md transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Simpan & Terbitkan SPK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: UPDATE PROGRES & STATUS SPK ================= */}
      {showProgressModal && selectedSPK && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-5 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Update Progress Pengerjaan SPK</h3>
                  <span className="text-[11px] font-mono text-primary font-bold">{selectedSPK.spkNumber}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProgressModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="progress-update-form" onSubmit={handleSaveProgress} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-on-surface">{selectedSPK.busId} ({selectedSPK.plate})</span>
                  <PriorityBadge priority={selectedSPK.priority} />
                </div>
                <p className="text-on-surface-variant text-[11px]">{selectedSPK.complaint}</p>
                <span className="text-[10px] text-primary font-semibold block">Mekanik: {selectedSPK.leadMechanic}</span>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Ubah Status SPK</label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value as SPKStatus)}
                  className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Antrean">Antrean (Pending Masuk Bay)</option>
                  <option value="Dikerjakan">Dikerjakan (In-Progress)</option>
                  <option value="Menunggu Part">Menunggu Part (WAPV)</option>
                  <option value="Uji Kelaikan">Uji Kelaikan & QC Road Test</option>
                  <option value="Selesai">Selesai (Closed & Siap Jalan)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-on-surface">Persentase Pengerjaan</label>
                  <span className="font-mono font-bold text-primary">{progressValue}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-outline font-mono mt-1">
                  <span>0% (Mulai)</span>
                  <span>50% (Separuh)</span>
                  <span>100% (Rampung)</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Catatan Kemajuan / Catatan QC</label>
                <textarea
                  rows={3}
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="Catatan hasil perbaikan atau part yang sudah dipasang..."
                  className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
            </form>

            {/* Footer Modal - Sticky */}
            <div className="shrink-0 px-5 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowProgressModal(false)}
                className="px-3 py-1.5 border border-outline-variant/40 rounded-lg text-on-surface hover:bg-surface-container font-semibold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                form="progress-update-form"
                className="px-4 py-1.5 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover shadow-sm text-xs"
              >
                Simpan Pembaruan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CETAK LEMBAR SPK FISIK ================= */}
      {showPrintModal && selectedSPK && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">print</span>
                <h3 className="text-sm font-bold text-on-surface">Lembar Surat Perintah Kerja (SPK) Workshop</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Cetak Dokumen
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Area Lembar SPK Cetak - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="border border-outline-variant/40 rounded-xl p-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs space-y-4">
                {/* Kop SPK */}
                <div className="flex justify-between items-start border-b-2 border-zinc-900 dark:border-zinc-100 pb-3">
                  <div className="space-y-0.5">
                    <h2 className="text-base font-black tracking-wider uppercase">PO TAYO TRANSPORT SYSTEM</h2>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">DIVISI WORKSHOP & PEMELIHARAAN ARMADA AKAP</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Jl. Sentra Primer Pulogebang No. 8, Jakarta Timur — (021) 4870-9821</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">NOMOR DOKUMEN SPK</span>
                    <span className="text-sm font-black font-mono text-primary block">{selectedSPK.spkNumber}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono mt-0.5 inline-block">
                      TGL: {selectedSPK.date}
                    </span>
                  </div>
                </div>

                {/* Data Armada & Alokasi */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700/50 text-[11px]">
                  <div>
                    <span className="text-zinc-400 block text-[9px]">NOMOR ARMADA</span>
                    <span className="font-bold text-sm text-primary">{selectedSPK.busId}</span>
                    <span className="font-mono block text-[10px]">{selectedSPK.plate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px]">TIPE CHASIS</span>
                    <span className="font-semibold block">{selectedSPK.chassis}</span>
                    <span className="font-mono text-[10px] text-zinc-500">Odo: {selectedSPK.odometer}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px]">LOKASI WORKSHOP</span>
                    <span className="font-semibold block">{selectedSPK.pool}</span>
                    <span className="font-bold text-emerald-600 block">{selectedSPK.bay}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px]">TARGET SELESAI</span>
                    <span className="font-mono font-bold block">{selectedSPK.targetDate}</span>
                    <span className="font-bold text-red-600 block text-[10px]">{selectedSPK.priority}</span>
                  </div>
                </div>

                {/* Keluhan & Instruksi Kerja */}
                <div className="space-y-2">
                  <div className="border border-zinc-200 dark:border-zinc-700/50 p-2.5 rounded-lg">
                    <span className="text-[9px] font-bold uppercase text-zinc-400 block">1. KELUHAN / TEMUAN KERUSAKAN (DEFECT):</span>
                    <p className="font-medium text-xs mt-0.5">{selectedSPK.complaint}</p>
                  </div>
                  <div className="border border-zinc-200 dark:border-zinc-700/50 p-2.5 rounded-lg">
                    <span className="text-[9px] font-bold uppercase text-zinc-400 block">2. INSTRUKSI TINDAKAN MEKANIK (ACTION PLAN):</span>
                    <p className="font-medium text-xs mt-0.5">{selectedSPK.plannedAction}</p>
                  </div>
                </div>

                {/* Rincian Suku Cadang yang Dikeluarkan Gudang */}
                <div>
                  <span className="text-[9px] font-bold uppercase text-zinc-400 block mb-1">
                    3. SUKU CADANG / SPARE PARTS DIKELUARKAN DARI LOGISTIK:
                  </span>
                  <table className="w-full text-left text-[11px] border border-zinc-200 dark:border-zinc-700">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold border-b border-zinc-200 dark:border-zinc-700">
                      <tr>
                        <th className="p-1.5">No</th>
                        <th className="p-1.5">Deskripsi Suku Cadang</th>
                        <th className="p-1.5">Part Number / SKU</th>
                        <th className="p-1.5 text-center">Qty</th>
                        <th className="p-1.5 text-right">Biaya Satuan</th>
                        <th className="p-1.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                      {selectedSPK.parts.map((p, idx) => (
                        <tr key={p.id}>
                          <td className="p-1.5 text-center">{idx + 1}</td>
                          <td className="p-1.5 font-medium">{p.partName}</td>
                          <td className="p-1.5 font-mono text-[10px]">{p.sku}</td>
                          <td className="p-1.5 text-center font-mono">
                            {p.quantity} {p.unit}
                          </td>
                          <td className="p-1.5 text-right font-mono">{formatRupiah(p.unitPrice)}</td>
                          <td className="p-1.5 text-right font-mono font-bold">
                            {formatRupiah(p.quantity * p.unitPrice)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-zinc-50 dark:bg-zinc-800 font-bold">
                        <td colSpan={5} className="p-1.5 text-right">Total Spare Parts:</td>
                        <td className="p-1.5 text-right font-mono">{formatRupiah(selectedSPK.partsCost)}</td>
                      </tr>
                      <tr className="bg-zinc-50 dark:bg-zinc-800 font-bold">
                        <td colSpan={5} className="p-1.5 text-right">Estimasi Jasa Mekanik:</td>
                        <td className="p-1.5 text-right font-mono">{formatRupiah(selectedSPK.laborCost)}</td>
                      </tr>
                      <tr className="bg-zinc-100 dark:bg-zinc-700 font-black text-xs">
                        <td colSpan={5} className="p-2 text-right">GRAND TOTAL ESTIMASI SPK:</td>
                        <td className="p-2 text-right font-mono text-primary">{formatRupiah(selectedSPK.totalCost)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tanda Tangan */}
                <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-zinc-200 dark:border-zinc-700 text-[10px]">
                  <div className="space-y-8">
                    <span className="text-zinc-500 block">Pengemudi / Pelapor</span>
                    <span className="font-bold block border-t border-zinc-300 dark:border-zinc-600 pt-1">
                      ( ............................... )
                    </span>
                  </div>
                  <div className="space-y-8">
                    <span className="text-zinc-500 block">Mekanik Pelaksana</span>
                    <span className="font-bold block border-t border-zinc-300 dark:border-zinc-600 pt-1">
                      {selectedSPK.leadMechanic}
                    </span>
                  </div>
                  <div className="space-y-8">
                    <span className="text-zinc-500 block">Kepala Regu (Foreman)</span>
                    <span className="font-bold block border-t border-zinc-300 dark:border-zinc-600 pt-1">
                      {selectedSPK.foreman}
                    </span>
                  </div>
                  <div className="space-y-8">
                    <span className="text-zinc-500 block">Quality Control (QC)</span>
                    <span className="font-bold block border-t border-zinc-300 dark:border-zinc-600 pt-1">
                      ( ............................... )
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= SUB-COMPONENTS =================

interface SPKCardProps {
  spk: MaintenanceSPKItem;
  onUpdateProgress: () => void;
  onPrint: () => void;
}

const SPKCard: React.FC<SPKCardProps> = ({ spk, onUpdateProgress, onPrint }) => {
  return (
    <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-primary transition-all space-y-2.5">
      {/* Top Header Card */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-[11px] font-bold text-primary block">{spk.spkNumber}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-black text-sm text-on-surface">{spk.busId}</span>
            <span className="text-[10px] text-on-surface-variant font-mono">({spk.plate})</span>
          </div>
        </div>
        <PriorityBadge priority={spk.priority} />
      </div>

      {/* Complaint / Work Description */}
      <p className="text-xs text-on-surface font-semibold line-clamp-2">{spk.complaint}</p>

      {/* Meta Info */}
      <div className="space-y-1 text-[11px] text-on-surface-variant">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
          <span className="font-medium text-on-surface truncate">{spk.bay}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-outline">engineering</span>
          <span>Lead: <strong>{spk.leadMechanic}</strong></span>
        </div>
        {spk.parts.length > 0 && (
          <div className="flex items-center gap-1 text-[10px]">
            <span className="material-symbols-outlined text-[14px] text-outline">inventory_2</span>
            <span>{spk.parts.length} Komponen Part Diminta</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1 pt-1 border-t border-surface-container">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-on-surface-variant font-medium">Progres Pengerjaan</span>
          <span className="font-mono font-bold text-primary">{spk.progressPercent}%</span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              spk.status === 'Selesai'
                ? 'bg-emerald-500'
                : spk.status === 'Menunggu Part'
                ? 'bg-amber-500'
                : 'bg-primary'
            }`}
            style={{ width: `${spk.progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <StatusBadge status={spk.status} />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrint}
            title="Cetak SPK"
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
          </button>
          <button
            type="button"
            onClick={onUpdateProgress}
            className="px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

// Priority Badge Component
const PriorityBadge: React.FC<{ priority: SPKPriority }> = ({ priority }) => {
  switch (priority) {
    case 'Kritis (Grounded)':
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-error flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
          Kritis
        </span>
      );
    case 'Tinggi':
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
          Tinggi
        </span>
      );
    case 'Normal':
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
          Normal
        </span>
      );
    case 'Rendah':
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container-high text-on-surface-variant">
          Rendah
        </span>
      );
    default:
      return null;
  }
};

// Status Badge Component
const StatusBadge: React.FC<{ status: SPKStatus }> = ({ status }) => {
  switch (status) {
    case 'Antrean':
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Antrean
        </span>
      );
    case 'Menunggu Part':
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          WAPV (Part)
        </span>
      );
    case 'Dikerjakan':
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          In-Progress
        </span>
      );
    case 'Uji Kelaikan':
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
          Uji QC
        </span>
      );
    case 'Selesai':
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Selesai
        </span>
      );
    default:
      return null;
  }
};
