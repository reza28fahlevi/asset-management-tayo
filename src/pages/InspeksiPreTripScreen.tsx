import React, { useState, useMemo } from 'react';
import { mockBuses } from '../data/mockFleet';

export interface InspectionCheckItem {
  id: string;
  category: 'admin' | 'brake' | 'chassis' | 'electrical' | 'emergency';
  categoryLabel: string;
  title: string;
  desc: string;
  isCritical: boolean;
}

export interface PreTripInspection {
  id: string;
  date: string;
  busId: string;
  plate: string;
  body: string;
  chassis: string;
  route: string;
  departureTime: string;
  pool: string;
  driver1: string;
  driver2?: string;
  inspector: string;
  odometer: string;
  brakeAirPressure: string;
  fuelLevel: string;
  items: Record<string, 'pass' | 'fail'>;
  notes?: string;
  verdict: 'Lolos (Laik Jalan)' | 'Lolos Bersyarat' | 'Tidak Laik (Grounded)';
  spjStatus: 'Dirilis' | 'Pending' | 'Ditahan (Grounded)';
  spjNumber?: string;
}

export const CHECKLIST_PARAMETERS: InspectionCheckItem[] = [
  // 1. Unsur Administrasi & Perizinan (Kemenhub PM 117)
  {
    id: 'adm_stnk',
    category: 'admin',
    categoryLabel: 'Unsur Administrasi & Legalitas',
    title: 'STNK & Pajak Kendaraan Asli',
    desc: 'Masa berlaku STNK dan PKB aktif, nomor rangka dan nomor mesin fisik sesuai.',
    isCritical: true,
  },
  {
    id: 'adm_kir',
    category: 'admin',
    categoryLabel: 'Unsur Administrasi & Legalitas',
    title: 'Bukti Lulus Uji Elektronik (BLU-e / KIR)',
    desc: 'Masa berlaku uji berkala Dishub masih aktif dan barcode RFID terverifikasi.',
    isCritical: true,
  },
  {
    id: 'adm_kps',
    category: 'admin',
    categoryLabel: 'Unsur Administrasi & Legalitas',
    title: 'Kartu Pengawasan (KPS) / Izin Trayek SPIONAM',
    desc: 'Izin penyelenggaraan angkutan AKAP pada koridor lintasan sesuai database Ditjen Hubdat.',
    isCritical: true,
  },
  {
    id: 'adm_sim',
    category: 'admin',
    categoryLabel: 'Unsur Administrasi & Legalitas',
    title: 'SIM B1/B2 Umum Driver & Surat Tugas',
    desc: 'Pengemudi memiliki SIM B1/B2 Umum yang sah, sehat jasmani, dan bebas alkohol/narkoba.',
    isCritical: true,
  },

  // 2. Pneumatik & Sistem Pengereman (Kritis Non-Negosiabel)
  {
    id: 'brk_press',
    category: 'brake',
    categoryLabel: 'Pneumatik & Pengereman (Kritis)',
    title: 'Tekanan Barometer Brake Chamber (8.5 - 10 Bar)',
    desc: 'Jarum indikator tekanan angin stabil, kompresor mengisi cepat tanpa kebocoran.',
    isCritical: true,
  },
  {
    id: 'brk_leak',
    category: 'brake',
    categoryLabel: 'Pneumatik & Pengereman (Kritis)',
    title: 'Uji Kebocoran Katup & Saluran Angin',
    desc: 'Tekanan drop < 0.2 Bar selama 45 detik saat pedal rem utama diinjak penuh.',
    isCritical: true,
  },
  {
    id: 'brk_park',
    category: 'brake',
    categoryLabel: 'Pneumatik & Pengereman (Kritis)',
    title: 'Rem Parkir / Hand Brake (Spring Brake)',
    desc: 'Mekanisme rem tangan mengunci roda rigid pada kemiringan tanpa tergelincir.',
    isCritical: true,
  },
  {
    id: 'brk_retarder',
    category: 'brake',
    categoryLabel: 'Pneumatik & Pengereman (Kritis)',
    title: 'Retarder & Exhaust Engine Brake 3-Step',
    desc: 'Respon tuas deselerasi retarder hidrolik/elektrik dan katup buang mesin berfungsi optimal.',
    isCritical: true,
  },

  // 3. Roda, Ban & Sistem Kemudi
  {
    id: 'tire_tread',
    category: 'chassis',
    categoryLabel: 'Roda, Ban & Sistem Kemudi',
    title: 'Ketebalan Alur Tapak Ban (> 2.5 mm)',
    desc: 'Semua ban (steer dan drive) tidak aus gundul, tidak ada kawat mengelupas atau benjol.',
    isCritical: true,
  },
  {
    id: 'tire_nuts',
    category: 'chassis',
    categoryLabel: 'Roda, Ban & Sistem Kemudi',
    title: 'Kekencangan Baut Roda (Wheel Nut Indicators)',
    desc: '10 baut roda lengkap terpasang kencang dengan torsi standar, indikator panah lurus.',
    isCritical: true,
  },
  {
    id: 'tire_press',
    category: 'chassis',
    categoryLabel: 'Roda, Ban & Sistem Kemudi',
    title: 'Tekanan Angin Ban (115 - 125 PSI)',
    desc: 'Tekanan ban diperiksa dengan alat ukur portabel atau sensor TPMS aktif.',
    isCritical: false,
  },
  {
    id: 'steer_play',
    category: 'chassis',
    categoryLabel: 'Roda, Ban & Sistem Kemudi',
    title: 'Free Play Kemudi & Power Steering',
    desc: 'Speling putaran setir < 15 derajat, pompa hidrolik enteng, fluida ATF di level MAX.',
    isCritical: true,
  },

  // 4. Lampu, Kelistrikan & Visibilitas
  {
    id: 'elec_headlight',
    category: 'electrical',
    categoryLabel: 'Lampu & Kelistrikan',
    title: 'Lampu Utama Dekat/Jauh & DRL',
    desc: 'Kedua lampu proyektor menyala terang, ketinggian sorot simetris tidak menyilaukan.',
    isCritical: false,
  },
  {
    id: 'elec_signal',
    category: 'electrical',
    categoryLabel: 'Lampu & Kelistrikan',
    title: 'Lampu Sein Kiri/Kanan, Hazard & Rem Stop',
    desc: 'Lampu rem belakang menyala seketika saat pedal ditekan, hazard kedip serentak.',
    isCritical: true,
  },
  {
    id: 'elec_wiper',
    category: 'electrical',
    categoryLabel: 'Lampu & Kelistrikan',
    title: 'Wiper Kaca & Semprotan Air Washer',
    desc: 'Karet wiper elastis menyapu air bersih dan nosel washer menyembur rata.',
    isCritical: false,
  },
  {
    id: 'elec_horn',
    category: 'electrical',
    categoryLabel: 'Lampu & Kelistrikan',
    title: 'Klakson Elektrik Standar & Buzzer Mundur',
    desc: 'Klakson utama berbunyi nyaring terdengar hingga 50m dan alarm mundur aktif saat R.',
    isCritical: false,
  },

  // 5. Tanggap Darurat & Keselamatan Kabin (PM 44)
  {
    id: 'emg_apar',
    category: 'emergency',
    categoryLabel: 'Fasilitas Tanggap Darurat (PM 44)',
    title: '2x Tabung APAR 3kg Dry Chemical Powder',
    desc: 'Manometer di zona hijau, segel pengaman utuh (1 di kokpit driver, 1 di lorong tengah).',
    isCritical: true,
  },
  {
    id: 'emg_hammer',
    category: 'emergency',
    categoryLabel: 'Fasilitas Tanggap Darurat (PM 44)',
    title: '4x Palu Pemecah Kaca Darurat',
    desc: 'Palu berujung runcing terpasang lengkap pada pilar kaca darurat dengan kawat segel.',
    isCritical: true,
  },
  {
    id: 'emg_door',
    category: 'emergency',
    categoryLabel: 'Fasilitas Tanggap Darurat (PM 44)',
    title: 'Pintu Darurat & Tuas Katup Udara Rilis',
    desc: 'Engsel pintu darurat belakang tidak terkunci dan tuas pelepas darurat tidak terhalang tas.',
    isCritical: true,
  },
  {
    id: 'emg_p3k',
    category: 'emergency',
    categoryLabel: 'Fasilitas Tanggap Darurat (PM 44)',
    title: 'Kotak P3K & Sabuk Pengaman Pengemudi',
    desc: 'Kotak pertolongan pertama lengkap perban/antiseptik, seatbelt 3-titik mengunci otomatis.',
    isCritical: false,
  },
];

const INITIAL_INSPECTIONS: PreTripInspection[] = [
  {
    id: 'INSP-20241024-TY015',
    date: '24 Okt 2024, 16:30 WIB',
    busId: 'T-015',
    plate: 'B 7123 VGA',
    body: 'Adiputro Jetbus 5 MHD',
    chassis: 'Mercedes-Benz OH 1626 L',
    route: 'Jakarta (Pulogebang) — Solo — Madiun',
    departureTime: '17:30 WIB',
    pool: 'Pool Pulogebang (Jkt)',
    driver1: 'Joko Santoso',
    driver2: 'Agus Prayitno',
    inspector: 'Wahyudi (QC Lead Workshop)',
    odometer: '84.320 Km',
    brakeAirPressure: '9.2 Bar',
    fuelLevel: '95%',
    items: CHECKLIST_PARAMETERS.reduce((acc, p) => ({ ...acc, [p.id]: 'pass' }), {}),
    notes: 'Semua sistem pneumatic, ban, dan fasilitas tanggap darurat dalam kondisi sempurna.',
    verdict: 'Lolos (Laik Jalan)',
    spjStatus: 'Dirilis',
    spjNumber: 'SPJ-20241024-TY015',
  },
  {
    id: 'INSP-20241024-TY088',
    date: '24 Okt 2024, 15:15 WIB',
    busId: 'T-088',
    plate: 'B 7942 KGA',
    body: 'Laksana Legacy SR3 Double Decker',
    chassis: 'Scania K410IB 6x2*4',
    route: 'Jakarta — Semarang — Surabaya',
    departureTime: '18:00 WIB',
    pool: 'Pool Pulogebang (Jkt)',
    driver1: 'Dedi Supriyadi',
    driver2: 'Bambang Irawan',
    inspector: 'Hendra Saputra',
    odometer: '218.490 Km',
    brakeAirPressure: '9.0 Bar',
    fuelLevel: '85%',
    items: {
      ...CHECKLIST_PARAMETERS.reduce((acc, p) => ({ ...acc, [p.id]: 'pass' }), {}),
      elec_wiper: 'fail',
    },
    notes: 'Air washer wiper kaca sempat kosong, telah diisi ulang air pembersih wiper di bay keberangkatan.',
    verdict: 'Lolos Bersyarat',
    spjStatus: 'Dirilis',
    spjNumber: 'SPJ-20241024-TY088',
  },
  {
    id: 'INSP-20241024-TY044',
    date: '24 Okt 2024, 14:00 WIB',
    busId: 'T-044',
    plate: 'L 7801 UA',
    body: 'Adiputro Jetbus 3+ SHD',
    chassis: 'Mercedes-Benz O 500 RS 1836',
    route: 'Jakarta — Malang',
    departureTime: '16:00 WIB',
    pool: 'Pool Pulogebang (Jkt)',
    driver1: 'Samsul Hadi',
    inspector: 'Wahyudi (QC Lead Workshop)',
    odometer: '310.200 Km',
    brakeAirPressure: '7.1 Bar',
    fuelLevel: '60%',
    items: {
      ...CHECKLIST_PARAMETERS.reduce((acc, p) => ({ ...acc, [p.id]: 'pass' }), {}),
      brk_leak: 'fail',
      tire_tread: 'fail',
    },
    notes: 'DITEMUKAN KEBOCORAN pada seal brake chamber belakang kiri dan alur ban 2R-O < 2mm. Unit dilarang beroperasi (Grounded) dan langsung dimasukkan ke Workshop SPK.',
    verdict: 'Tidak Laik (Grounded)',
    spjStatus: 'Ditahan (Grounded)',
  },
];

export const InspeksiPreTripScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'history' | 'sop'>('checklist');
  const [inspections, setInspections] = useState<PreTripInspection[]>(INITIAL_INSPECTIONS);
  const [activeInspectionId, setActiveInspectionId] = useState<string>('INSP-20241024-TY015');

  // Search & Filter in History Tab
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<PreTripInspection | null>(null);

  // New Inspection Form State
  const [selectedBusId, setSelectedBusId] = useState<string>('T-015');
  const [formDriver1, setFormDriver1] = useState<string>('Joko Santoso');
  const [formDriver2, setFormDriver2] = useState<string>('Agus Prayitno');
  const [formInspector, setFormInspector] = useState<string>('Wahyudi (QC Lead Workshop)');
  const [formRoute, setFormRoute] = useState<string>('Jakarta (Pulogebang) — Solo — Madiun');
  const [formDepartureTime, setFormDepartureTime] = useState<string>('17:30 WIB');
  const [formPool, setFormPool] = useState<string>('Pool Pulogebang (Jkt)');
  const [formOdometer, setFormOdometer] = useState<string>('84.320 Km');
  const [formPressure, setFormPressure] = useState<string>('9.2 Bar');
  const [formFuel, setFormFuel] = useState<string>('95%');
  const [formNotes, setFormNotes] = useState<string>('Pemeriksaan ramp check lengkap memenuhi standar kelaikan Kemenhub RI.');
  const [formVerdict, setFormVerdict] = useState<'Lolos (Laik Jalan)' | 'Lolos Bersyarat' | 'Tidak Laik (Grounded)'>('Lolos (Laik Jalan)');
  const [formCheckItems, setFormCheckItems] = useState<Record<string, 'pass' | 'fail'>>(() =>
    CHECKLIST_PARAMETERS.reduce((acc, p) => ({ ...acc, [p.id]: 'pass' }), {})
  );

  // Get current active inspection object
  const currentActiveInspection = useMemo(() => {
    return inspections.find((i) => i.id === activeInspectionId) || inspections[0];
  }, [inspections, activeInspectionId]);

  // Handle bus selection in new form
  const handleBusChange = (busId: string) => {
    setSelectedBusId(busId);
    const bus = mockBuses.find((b) => b.id === busId);
    if (bus) {
      setFormOdometer(bus.odo);
      setFormPool(bus.pool);
    }
  };

  // Toggle single check item
  const toggleCheckItem = (id: string) => {
    setFormCheckItems((prev) => ({
      ...prev,
      [id]: prev[id] === 'pass' ? 'fail' : 'pass',
    }));
  };

  // Quick action: mark all as pass
  const handleMarkAllPass = () => {
    const allPass = CHECKLIST_PARAMETERS.reduce((acc, p) => ({ ...acc, [p.id]: 'pass' }), {});
    setFormCheckItems(allPass);
    setFormVerdict('Lolos (Laik Jalan)');
  };

  // Quick action: calculate passed and critical stats
  const formStats = useMemo(() => {
    const total = CHECKLIST_PARAMETERS.length;
    let passed = 0;
    let failedCritical = 0;
    CHECKLIST_PARAMETERS.forEach((p) => {
      if (formCheckItems[p.id] === 'pass') {
        passed += 1;
      } else if (p.isCritical) {
        failedCritical += 1;
      }
    });
    return { total, passed, failedCritical };
  }, [formCheckItems]);

  // Submit New Inspection
  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const bus = mockBuses.find((b) => b.id === selectedBusId) || mockBuses[0];

    // Determine SPJ Status
    let spjStatus: 'Dirilis' | 'Pending' | 'Ditahan (Grounded)' = 'Dirilis';
    let spjNumber: string | undefined = `SPJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${bus.id.replace('-', '')}`;

    if (formVerdict === 'Tidak Laik (Grounded)') {
      spjStatus = 'Ditahan (Grounded)';
      spjNumber = undefined;
    } else if (formVerdict === 'Lolos Bersyarat') {
      spjStatus = 'Dirilis';
    }

    const newInspId = `INSP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${bus.id.replace('-', '')}`;

    const newInspection: PreTripInspection = {
      id: newInspId,
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      busId: bus.id,
      plate: bus.plate,
      body: bus.body,
      chassis: bus.chassis,
      route: formRoute,
      departureTime: formDepartureTime,
      pool: formPool,
      driver1: formDriver1,
      driver2: formDriver2 || undefined,
      inspector: formInspector,
      odometer: formOdometer,
      brakeAirPressure: formPressure,
      fuelLevel: formFuel,
      items: formCheckItems,
      notes: formNotes,
      verdict: formVerdict,
      spjStatus,
      spjNumber,
    };

    setInspections([newInspection, ...inspections]);
    setActiveInspectionId(newInspId);
    setShowNewModal(false);

    if (formVerdict === 'Lolos (Laik Jalan)') {
      alert(`Inspeksi Berhasil Disimpan!\nNomor: ${newInspId}\nUnit ${bus.id} dinyatakan LAIK JALAN dan Nomor SPJ ${spjNumber} berhasil diterbitkan.`);
    } else if (formVerdict === 'Lolos Bersyarat') {
      alert(`Inspeksi Disimpan dengan Catatan Minor!\nUnit ${bus.id} diizinkan jalan dengan pengawasan.`);
    } else {
      alert(`PERINGATAN: Unit ${bus.id} dinyatakan TIDAK LAIK JALAN (Grounded)!\nSPJ ditahan dan notifikasi perbaikan dikirim ke Workshop SPK.`);
    }
  };

  // Filtered History
  const filteredHistory = useMemo(() => {
    return inspections.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.busId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.driver1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.route.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'all' || item.verdict === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [inspections, searchQuery, statusFilter]);

  // Open Official LHP Document
  const handleOpenReport = (insp: PreTripInspection) => {
    setSelectedReport(insp);
    setShowReportModal(true);
  };

  // Release SPJ from active screen
  const handleReleaseActiveSPJ = () => {
    if (currentActiveInspection.verdict === 'Tidak Laik (Grounded)') {
      alert('TIDAK DAPAT MERILIS SPJ!\nUnit ini berstatus Grounded karena kegagalan parameter keselamatan kritis.');
      return;
    }
    const updated = inspections.map((i) =>
      i.id === currentActiveInspection.id
        ? {
            ...i,
            spjStatus: 'Dirilis' as const,
            spjNumber: i.spjNumber || `SPJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${i.busId.replace('-', '')}`,
          }
        : i
    );
    setInspections(updated);
    alert(`Surat Perintah Jalan (SPJ) untuk unit ${currentActiveInspection.busId} (${currentActiveInspection.plate}) telah dirilis resmi!`);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-primary mb-1">
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            <span>Modul 03.1 • Inspeksi Pra-Keberangkatan Bus AKAP</span>
            <span className="text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold text-[11px]">
              Kemenhub RI PM 117/2018
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Pre-Trip Digital Safety Inspection</h1>
          <p className="text-xs text-on-surface-variant">
            Checklist mandatori ramp check keselamatan bus AKAP sebelum penerbitan Surat Perintah Jalan (SPJ).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover flex items-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            + Input Inspeksi Baru
          </button>
        </div>
      </div>

      {/* Tabs Navigation Toolbar */}
      <div className="bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">checklist_rtl</span>
            <span>Pemeriksaan Unit Aktif</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'checklist' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'
              }`}
            >
              {currentActiveInspection.busId}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history_edu</span>
            <span>Riwayat & Arsip Ramp Check</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'
              }`}
            >
              {inspections.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sop')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sop'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">policy</span>
            <span>SOP & Parameter Kemenhub</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-on-surface-variant">
            Pemeriksa: <strong className="text-on-surface">QC Pool Workshop</strong>
          </span>
        </div>
      </div>

      {/* ================= TAB 1: PEMERIKSAAN AKTIF (CHECKLIST PREVIEW) ================= */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Active Unit Header Card */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-black text-lg">
                {currentActiveInspection.busId}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-on-surface">{currentActiveInspection.plate}</h3>
                  <span className="text-xs font-medium text-on-surface-variant">({currentActiveInspection.body})</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      currentActiveInspection.verdict === 'Lolos (Laik Jalan)'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentActiveInspection.verdict === 'Lolos Bersyarat'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-error-container text-error'
                    }`}
                  >
                    {currentActiveInspection.verdict}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">alt_route</span>
                    {currentActiveInspection.route}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    Jadwal: {currentActiveInspection.departureTime}
                  </span>
                  <span>•</span>
                  <span>No. LHP: <strong className="font-mono">{currentActiveInspection.id}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end lg:self-center flex-wrap">
              <button
                onClick={() => handleOpenReport(currentActiveInspection)}
                className="px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
                Lembar LHP
              </button>

              <button
                onClick={handleReleaseActiveSPJ}
                className={`px-4 py-2 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentActiveInspection.spjStatus === 'Dirilis'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : currentActiveInspection.verdict === 'Tidak Laik (Grounded)'
                    ? 'bg-slate-400 cursor-not-allowed opacity-60'
                    : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                {currentActiveInspection.spjStatus === 'Dirilis'
                  ? `SPJ Dirilis (${currentActiveInspection.spjNumber || 'Resmi'})`
                  : currentActiveInspection.verdict === 'Tidak Laik (Grounded)'
                  ? 'SPJ Ditahan (Grounded)'
                  : 'Rilis SPJ Bus Ini'}
              </button>
            </div>
          </div>

          {/* Quick Metrics of Active Inspection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Pengemudi Bertugas</span>
              <div className="text-base font-bold text-on-surface mt-1">{currentActiveInspection.driver1}</div>
              <span className="text-[11px] text-on-surface-variant">Cadangan: {currentActiveInspection.driver2 || '-'}</span>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Barometer Angin Rem</span>
              <div className="text-xl font-bold text-emerald-700 mt-1">{currentActiveInspection.brakeAirPressure}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Batas Aman &gt; 8.5 Bar</span>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Odometer & Bahan Bakar</span>
              <div className="text-xl font-bold text-on-surface mt-1">{currentActiveInspection.odometer}</div>
              <span className="text-[11px] text-primary font-medium">BBM: {currentActiveInspection.fuelLevel} Tangki</span>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Petugas Inspektur QC</span>
              <div className="text-base font-bold text-on-surface mt-1">{currentActiveInspection.inspector}</div>
              <span className="text-[11px] text-on-surface-variant">Waktu: {currentActiveInspection.date}</span>
            </div>
          </div>

          {/* 5 Checklist Categories Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Hasil Audit Checklist Fisik Keselamatan (20 Parameter)</h3>
                <span className="text-xs text-on-surface-variant">Berdasarkan Standar Pemeriksaan Laik Jalan Kemenhub RI</span>
              </div>
              <button
                onClick={() => setShowNewModal(true)}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                Lakukan Inspeksi Ulang / Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(['admin', 'brake', 'chassis', 'electrical', 'emergency'] as const).map((cat) => {
                const catItems = CHECKLIST_PARAMETERS.filter((p) => p.category === cat);
                const categoryLabel = catItems[0]?.categoryLabel || cat;
                const passedCount = catItems.filter((p) => currentActiveInspection.items[p.id] === 'pass').length;

                return (
                  <div
                    key={cat}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-surface-container pb-2">
                      <h4 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${
                            cat === 'brake' || cat === 'admin'
                              ? 'bg-red-100 text-error'
                              : cat === 'emergency'
                              ? 'bg-blue-100 text-primary'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {cat[0].toUpperCase()}
                        </span>
                        {categoryLabel}
                      </h4>
                      <span className="text-[11px] font-semibold text-on-surface-variant">
                        {passedCount}/{catItems.length} Lolos
                      </span>
                    </div>

                    <div className="space-y-2">
                      {catItems.map((param) => {
                        const isPass = currentActiveInspection.items[param.id] === 'pass';
                        return (
                          <div
                            key={param.id}
                            className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                              isPass
                                ? 'bg-surface-container-low/50 border-outline-variant/20'
                                : 'bg-red-50/50 border-red-200 dark:bg-red-950/20'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                                isPass ? 'text-emerald-600' : 'text-error font-bold'
                              }`}
                            >
                              {isPass ? 'check_circle' : 'cancel'}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-on-surface">{param.title}</span>
                                {param.isCritical && (
                                  <span className="text-[9px] font-bold px-1 rounded bg-red-100 text-error">
                                    Kritis
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                                {param.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notes & Finding Card */}
            {currentActiveInspection.notes && (
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs">
                <span className="font-bold text-on-surface flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">notes</span>
                  Catatan Temuan Inspektur / Rekomendasi Teknis:
                </span>
                <p className="text-on-surface-variant pl-5">{currentActiveInspection.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: RIWAYAT INSPEKSI & ARSIP RAMP CHECK ================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Semua ({inspections.length})
              </button>
              <button
                onClick={() => setStatusFilter('Lolos (Laik Jalan)')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'Lolos (Laik Jalan)'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Lolos Laik Jalan
              </button>
              <button
                onClick={() => setStatusFilter('Lolos Bersyarat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'Lolos Bersyarat'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Lolos Bersyarat
              </button>
              <button
                onClick={() => setStatusFilter('Tidak Laik (Grounded)')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'Tidak Laik (Grounded)'
                    ? 'bg-error text-white shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Grounded
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[18px]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No. LHP, Plat, Bus, Driver..."
                className="w-full bg-surface-container-low text-xs rounded-lg pl-8 pr-3 py-2 border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* History Datatable */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                    <th className="py-3 px-4">No. LHP & Tanggal</th>
                    <th className="py-3 px-4">Armada & Plat Bus</th>
                    <th className="py-3 px-4">Rute & Driver</th>
                    <th className="py-3 px-4">Tekanan Angin</th>
                    <th className="py-3 px-4 text-center">Keputusan Ramp Check</th>
                    <th className="py-3 px-4 text-center">Status SPJ</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((row) => {
                      return (
                        <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-primary block">{row.id}</span>
                            <span className="text-[11px] text-on-surface-variant">{row.date}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-primary font-mono font-bold text-[11px]">
                                {row.busId}
                              </span>
                              <div>
                                <span className="font-bold text-on-surface block">{row.plate}</span>
                                <span className="text-[11px] text-on-surface-variant">{row.body}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-on-surface block">{row.route}</span>
                            <span className="text-[11px] text-on-surface-variant">Driver: {row.driver1}</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                            {row.brakeAirPressure}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                                row.verdict === 'Lolos (Laik Jalan)'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : row.verdict === 'Lolos Bersyarat'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-error-container text-error'
                              }`}
                            >
                              {row.verdict}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                row.spjStatus === 'Dirilis'
                                  ? 'bg-blue-50 text-primary'
                                  : 'bg-red-50 text-error'
                              }`}
                            >
                              {row.spjStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setActiveInspectionId(row.id);
                                  setActiveTab('checklist');
                                }}
                                className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold cursor-pointer"
                                title="Lihat detail checklist"
                              >
                                Detail
                              </button>
                              <button
                                onClick={() => handleOpenReport(row)}
                                className="px-2.5 py-1 rounded bg-primary text-white text-[11px] font-bold hover:bg-primary-hover cursor-pointer"
                                title="Buka Lembar Hasil Pemeriksaan"
                              >
                                LHP
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                        Tidak ada riwayat inspeksi yang sesuai dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SOP & STANDAR KEMENHUB ================= */}
      {activeTab === 'sop' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface">1. Unsur Kritis (Non-Negosiabel)</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Pelanggaran pada salah satu unsur kritis (pengereman, ban robek/gundul, rem parkir blong, atau dokumen izin mati)
              menyebabkan <strong>SANKSI GROUNDED</strong> seketika. Bus dilarang keluar terminal dan tiket dialihkan ke unit cadangan.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface">2. Standar Tanggap Darurat (PM 44)</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Wajib tersedia 2 tabung APAR minimal 3kg bertekanan optimal, 4 palu pemecah kaca berujung lancip pada pilar darurat,
              serta pintu darurat belakang dengan mekanisme mekanik manual yang tidak boleh dihalangi bagasi/toilet.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface">3. Sinkronisasi SPIONAM & SPJ Digital</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Hasil pre-trip inspection yang dinyatakan <strong>Lolos (Laik Jalan)</strong> otomatis menerbitkan Surat Perintah Jalan (SPJ)
              ber-barcode unik yang dapat dipindai oleh petugas Dishub di jembatan timbang dan terminal tipe A.
            </p>
          </div>
        </div>
      )}

      {/* ================= MODAL: FORM INPUT INSPEKSI BARU ================= */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">fact_check</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Formulir Ramp Check & Inspeksi Pre-Trip Bus</h3>
                  <p className="text-xs text-on-surface-variant">
                    Pemeriksaan kelaikan fisik armada bus AKAP sebelum penerbitan Surat Perintah Jalan (SPJ).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form id="pretrip-inspection-form" onSubmit={handleSubmitInspection} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* Bagian 1: Data Armada & Operasional */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-3">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">directions_bus</span>
                  1. Identitas Unit Armada & Rencana Operasional
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Pilih Armada Bus *</label>
                    <select
                      value={selectedBusId}
                      onChange={(e) => handleBusChange(e.target.value)}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {mockBuses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} — {b.plate} ({b.body})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Rute / Koridor Trayek *</label>
                    <input
                      type="text"
                      required
                      value={formRoute}
                      onChange={(e) => setFormRoute(e.target.value)}
                      placeholder="Contoh: Jakarta — Solo — Madiun"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Jadwal Keberangkatan *</label>
                    <input
                      type="text"
                      required
                      value={formDepartureTime}
                      onChange={(e) => setFormDepartureTime(e.target.value)}
                      placeholder="Contoh: 17:30 WIB"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Pengemudi Utama (Driver 1) *</label>
                    <input
                      type="text"
                      required
                      value={formDriver1}
                      onChange={(e) => setFormDriver1(e.target.value)}
                      placeholder="Nama Driver 1"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Pengemudi Cadangan (Driver 2)</label>
                    <input
                      type="text"
                      value={formDriver2}
                      onChange={(e) => setFormDriver2(e.target.value)}
                      placeholder="Nama Driver 2"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Petugas Pemeriksa (QC) *</label>
                    <input
                      type="text"
                      required
                      value={formInspector}
                      onChange={(e) => setFormInspector(e.target.value)}
                      placeholder="Nama Petugas QC"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Tekanan Barometer Rem (Bar) *</label>
                    <input
                      type="text"
                      required
                      value={formPressure}
                      onChange={(e) => setFormPressure(e.target.value)}
                      placeholder="Contoh: 9.2 Bar (Min. 7.5 Bar)"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-emerald-700 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Level Tangki Solar (BBM) *</label>
                    <input
                      type="text"
                      required
                      value={formFuel}
                      onChange={(e) => setFormFuel(e.target.value)}
                      placeholder="Contoh: 90%"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Odometer Pengecekan *</label>
                    <input
                      type="text"
                      required
                      value={formOdometer}
                      onChange={(e) => setFormOdometer(e.target.value)}
                      placeholder="Contoh: 84.320 Km"
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: 20 Parameter Checklist Kemenhub */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-2">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">checklist</span>
                      2. Parameter Checklist Mandatori (20 Butir Uji)
                    </h4>
                    <span className="text-[11px] text-on-surface-variant">
                      Centang tombol hijau jika lolos uji, atau silang merah jika terdapat kecacatan.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface">
                      Hasil: <strong>{formStats.passed}/{formStats.total} Lolos</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleMarkAllPass}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">done_all</span>
                      Tandai Semua Lolos (Quick Pass)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {CHECKLIST_PARAMETERS.map((param) => {
                    const isPass = formCheckItems[param.id] === 'pass';
                    return (
                      <div
                        key={param.id}
                        onClick={() => toggleCheckItem(param.id)}
                        className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 cursor-pointer transition-all ${
                          isPass
                            ? 'bg-surface-container-lowest border-outline-variant/30 hover:border-primary'
                            : 'bg-red-50/60 border-red-300 dark:bg-red-950/30'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-on-surface">{param.title}</span>
                            {param.isCritical && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-error">
                                Kritis
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-on-surface-variant block mt-1">
                            {param.desc}
                          </span>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 ${
                              isPass
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-error'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isPass ? 'check' : 'close'}
                            </span>
                            {isPass ? 'LOLOS' : 'CACAT'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bagian 3: Keputusan Akhir & Catatan Ramp Check */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-3">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">gavel</span>
                  3. Keputusan Rekomendasi Kelaikan Fisik Armada
                </h4>

                {formStats.failedCritical > 0 && (
                  <div className="p-3 bg-red-100 dark:bg-red-950/50 border border-error/40 rounded-lg text-error flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] shrink-0">report</span>
                    <div>
                      <strong className="block text-xs font-bold">PERINGATAN: TERDETEKSI {formStats.failedCritical} KEGAGALAN BUTIR KRITIS!</strong>
                      <span className="text-[11px]">
                        Berdasarkan PM 44/2019 Kemenhub RI, bus dengan kegagalan parameter kritis WAJIB dinyatakan TIDAK LAIK (GROUNDED) dan dilarang operasional.
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      formVerdict === 'Lolos (Laik Jalan)'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500 dark:bg-emerald-950/40'
                        : 'bg-surface-container-lowest border-outline-variant/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="verdict"
                      value="Lolos (Laik Jalan)"
                      checked={formVerdict === 'Lolos (Laik Jalan)'}
                      onChange={() => setFormVerdict('Lolos (Laik Jalan)')}
                      className="text-emerald-600 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Lolos (Laik Jalan)</span>
                      <span className="text-[10px] text-on-surface-variant">Rilis SPJ Segera</span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      formVerdict === 'Lolos Bersyarat'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500 dark:bg-amber-950/40'
                        : 'bg-surface-container-lowest border-outline-variant/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="verdict"
                      value="Lolos Bersyarat"
                      checked={formVerdict === 'Lolos Bersyarat'}
                      onChange={() => setFormVerdict('Lolos Bersyarat')}
                      className="text-amber-600 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-amber-800 dark:text-amber-300 block">Lolos Bersyarat</span>
                      <span className="text-[10px] text-on-surface-variant">Catatan Minor Pengawasan</span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      formVerdict === 'Tidak Laik (Grounded)'
                        ? 'bg-red-50 border-error ring-2 ring-error dark:bg-red-950/40'
                        : 'bg-surface-container-lowest border-outline-variant/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="verdict"
                      value="Tidak Laik (Grounded)"
                      checked={formVerdict === 'Tidak Laik (Grounded)'}
                      onChange={() => setFormVerdict('Tidak Laik (Grounded)')}
                      className="text-error focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-error block">Tidak Laik (Grounded)</span>
                      <span className="text-[10px] text-on-surface-variant">SPJ Ditahan & Masuk SPK</span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Catatan Tambahan Petugas QC *</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Tuliskan catatan teknis pemeriksaan fisik (misal: tekanan angin ban cadangan ditambah, lampu baca kursi 12 diperbaiki)..."
                    className="w-full p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </form>

            {/* Footer Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2.5 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                form="pretrip-inspection-form"
                className={`px-6 py-2.5 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer text-xs ${
                  formVerdict === 'Lolos (Laik Jalan)'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : formVerdict === 'Lolos Bersyarat'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-error hover:bg-red-700'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>
                  {formVerdict === 'Lolos (Laik Jalan)'
                    ? 'Simpan Hasil & Rilis SPJ'
                    : formVerdict === 'Lolos Bersyarat'
                    ? 'Simpan & Rilis Bersyarat'
                    : 'Simpan & Tahan Unit (Grounded)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CETAK / LIHAT LEMBAR HASIL PEMERIKSAAN (LHP) ================= */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Lembar Hasil Pemeriksaan (LHP) Ramp Check</h3>
                  <span className="text-xs text-on-surface-variant font-mono">No. Dokumen: {selectedReport.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Document Body Formatted like Official Certificate - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 space-y-4 text-xs">
                <div className="text-center pb-3 border-b border-surface-container">
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase block">
                    KEMENTERIAN PERHUBUNGAN REPUBLIK INDONESIA • DITJEN PERHUBUNGAN DARAT
                  </span>
                  <h4 className="font-bold text-sm text-on-surface mt-0.5">
                    BERITA ACARA PEMERIKSAAN KELAIKAN FISIK KENDARAAN (RAMP CHECK)
                  </h4>
                  <span className="text-[11px] text-on-surface-variant">SOP PM 117/2018 & PM 44/2019</span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
                  <div>
                    <span className="text-outline text-[10px] block">No. Lambung</span>
                    <strong className="text-sm font-mono text-primary">{selectedReport.busId}</strong>
                  </div>
                  <div>
                    <span className="text-outline text-[10px] block">Nomor Polisi</span>
                    <strong className="text-sm text-on-surface">{selectedReport.plate}</strong>
                  </div>
                  <div>
                    <span className="text-outline text-[10px] block">Model Bodi Karoseri</span>
                    <strong className="text-on-surface">{selectedReport.body}</strong>
                  </div>
                  <div>
                    <span className="text-outline text-[10px] block">Trayek Koridor</span>
                    <strong className="text-on-surface">{selectedReport.route}</strong>
                  </div>
                  <div>
                    <span className="text-outline text-[10px] block">Tekanan Angin Rem</span>
                    <strong className="text-emerald-700 font-mono">{selectedReport.brakeAirPressure}</strong>
                  </div>
                  <div>
                    <span className="text-outline text-[10px] block">Odometer Tercatat</span>
                    <strong className="font-mono text-on-surface">{selectedReport.odometer}</strong>
                  </div>
                </div>

                {/* Summary of Results */}
                <div className="space-y-1.5">
                  <span className="font-bold text-on-surface block">Ringkasan Keputusan Uji Kelaikan:</span>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                    <div>
                      <span className="font-bold text-xs text-on-surface block">Status Kelaikan Jalan:</span>
                      <span
                        className={`text-xs font-bold ${
                          selectedReport.verdict === 'Lolos (Laik Jalan)'
                            ? 'text-emerald-700'
                            : selectedReport.verdict === 'Lolos Bersyarat'
                            ? 'text-amber-700'
                            : 'text-error'
                        }`}
                      >
                        {selectedReport.verdict}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-on-surface block">Status SPJ:</span>
                      <span className="text-xs font-mono font-bold text-primary">
                        {selectedReport.spjNumber || selectedReport.spjStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedReport.notes && (
                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                    <span className="font-semibold text-outline text-[10px] block">Catatan Pemeriksaan:</span>
                    <p className="text-on-surface mt-0.5">{selectedReport.notes}</p>
                  </div>
                )}

                {/* Digital Signature Placeholders */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-surface-container text-center">
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[10px] text-outline block">Pengemudi / Driver Bertugas:</span>
                    <div className="h-10 flex items-center justify-center text-xs font-semibold text-emerald-700">
                      [Tervalidasi Digital]
                    </div>
                    <strong className="block text-on-surface">{selectedReport.driver1}</strong>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[10px] text-outline block">Petugas QC Ramp Check:</span>
                    <div className="h-10 flex items-center justify-center text-xs font-semibold text-emerald-700">
                      [Tervalidasi Digital]
                    </div>
                    <strong className="block text-on-surface">{selectedReport.inspector}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions - Sticky */}
            <div className="shrink-0 px-6 py-4 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer text-xs"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5 text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Cetak Lembar LHP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
