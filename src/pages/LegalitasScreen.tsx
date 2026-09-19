import React, { useState, useMemo } from 'react';
import { mockLegalData, mockLegalSchedules } from '../data/mockLegal';
import { LegalItem, LegalScheduleItem } from '../types';

export const LegalitasScreen: React.FC = () => {
  // Main Data States
  const [legalList, setLegalList] = useState<LegalItem[]>(mockLegalData);
  const [scheduleList, setScheduleList] = useState<LegalScheduleItem[]>(mockLegalSchedules);

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState<'kelaikan' | 'jadwal' | 'histori'>('kelaikan');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Road Legal' | 'Restricted' | 'Grounded'>('all');

  // Modal Visibility States
  const [showAddDocModal, setShowAddDocModal] = useState<boolean>(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showQuickModal, setShowQuickModal] = useState<boolean>(false);
  const [selectedBus, setSelectedBus] = useState<LegalItem | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ================= Form States =================

  // 1. Form Registrasi / Perpanjangan Dokumen Penuh
  const [docForm, setDocForm] = useState({
    id: 'TY-099',
    plate: 'B 7999 TAY',
    route: 'Jakarta - Solo • Wonogiri',
    chassis: 'Mercedes-Benz OH 1626 L Air Suspension',
    body: 'Adiputro Jetbus 5 MHD',
    // KIR
    kirNumber: 'BLUE-JKT-2024-12099',
    kirDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    kirLocation: 'UPUBKB Dishub Pulogadung',
    brakeEfficiency: '68% (Lulus Uji)',
    emissionResult: 'Opasitas 22%',
    // KPS
    kpsNumber: 'KPS-AKAP-2024-00991',
    kpsDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    skTrayek: 'SK.503/AJ.001/DJPD/2024',
    corridorCode: 'KOR-06-WNG',
    // STNK
    stnkNumber: 'STNK-POL-7999099',
    stnkDate: new Date(Date.now() + 300 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    fiveYearDate: '2029-10-15',
    samsatLocation: 'Samsat Jakarta Timur',
    taxAmount: 7800000,
    // Asuransi
    insuranceNumber: 'JR-IWKBU-2024-9901',
    insuranceDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    picName: 'Arif Kurniawan (Legal Officer)',
    notes: 'Pendaftaran berkas kelaikan operasional unit baru.'
  });

  // 2. Form Penjadwalan Uji Dishub / Samsat
  const [scheduleForm, setScheduleForm] = useState({
    busId: mockLegalData[0]?.id || 'TY-044',
    plate: mockLegalData[0]?.plate || 'L 7801 UA',
    docType: 'Uji KIR Dishub (BLUE)' as 'Uji KIR Dishub (BLUE)' | 'Perpanjangan KPS SPIONAM' | 'Pajak STNK Tahunan' | 'Cek Fisik 5 Tahunan',
    scheduledDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    scheduledTime: '09:00 WIB',
    location: 'UPUBKB Dishub Pulogadung',
    assignedDriver: 'Budi Santoso (Driver Pendamping)',
    costEstimate: 250000,
    notes: 'Pemeriksaan pra-uji rem dan lampu sebelum berangkat ke balai Dishub.'
  });

  // 3. Form Quick Update Dokumen
  const [quickForm, setQuickForm] = useState({
    updateType: 'kir' as 'kir' | 'kps' | 'stnk',
    newExpiryDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    newDocNumber: '',
    testedLocation: 'UPUBKB Dishub Pulogadung',
    notes: 'Perpanjangan berkala selesai diproses.'
  });

  // ================= Handlers =================

  // Buka Modal Kelola Cepat untuk Armada Tertentu
  const handleOpenQuickManage = (item: LegalItem) => {
    setSelectedBus(item);
    const defaultDocNum =
      item.status === 'Grounded'
        ? `BLUE-RENEW-${Date.now().toString().slice(-5)}`
        : `KPS-EXT-${Date.now().toString().slice(-5)}`;

    setQuickForm({
      updateType: item.status === 'Grounded' ? 'kir' : 'kps',
      newExpiryDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      newDocNumber: defaultDocNum,
      testedLocation: item.kirLocation || 'UPUBKB Dishub Pulogadung',
      notes: `Perpanjangan dokumen armada ${item.id} (${item.plate}) telah lulus verifikasi.`
    });
    setShowQuickModal(true);
  };

  // Submit Registrasi Dokumen Lengkap
  const handleSaveDocForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Tentukan status otomatis berdasarkan tanggal
    const kirExpired = new Date(docForm.kirDate) < new Date();
    const kpsExpired = new Date(docForm.kpsDate) < new Date();
    const stnkExpired = new Date(docForm.stnkDate) < new Date();

    let status: 'Road Legal' | 'Restricted' | 'Grounded' = 'Road Legal';
    let statusClass = 'bg-emerald-100 text-emerald-800 border border-emerald-200';

    if (kirExpired || kpsExpired || stnkExpired) {
      status = 'Grounded';
      statusClass = 'bg-error text-white';
    }

    const newItem: LegalItem = {
      id: docForm.id.toUpperCase().trim(),
      plate: docForm.plate.toUpperCase().trim(),
      route: docForm.route.trim(),
      kir: `${docForm.kirDate} (Aktif)`,
      kps: `${docForm.kpsDate}`,
      stnk: `${docForm.stnkDate}`,
      status,
      statusClass,
      chassis: docForm.chassis,
      body: docForm.body,
      kirNumber: docForm.kirNumber,
      kirDate: docForm.kirDate,
      kirLocation: docForm.kirLocation,
      brakeEfficiency: docForm.brakeEfficiency,
      emissionResult: docForm.emissionResult,
      kpsNumber: docForm.kpsNumber,
      kpsDate: docForm.kpsDate,
      skTrayek: docForm.skTrayek,
      corridorCode: docForm.corridorCode,
      stnkNumber: docForm.stnkNumber,
      stnkDate: docForm.stnkDate,
      fiveYearDate: docForm.fiveYearDate,
      samsatLocation: docForm.samsatLocation,
      taxAmount: Number(docForm.taxAmount),
      insuranceNumber: docForm.insuranceNumber,
      insuranceDate: docForm.insuranceDate,
      picName: docForm.picName,
      notes: docForm.notes
    };

    setLegalList([newItem, ...legalList]);
    setShowAddDocModal(false);
    triggerToast(`Dokumen armada ${newItem.id} (${newItem.plate}) berhasil didaftarkan.`);
  };

  // Submit Penjadwalan Uji Dishub
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: LegalScheduleItem = {
      id: `SCH-${String(scheduleList.length + 1).padStart(3, '0')}`,
      busId: scheduleForm.busId,
      plate: scheduleForm.plate,
      docType: scheduleForm.docType,
      scheduledDate: scheduleForm.scheduledDate,
      scheduledTime: scheduleForm.scheduledTime,
      location: scheduleForm.location,
      assignedDriver: scheduleForm.assignedDriver,
      costEstimate: Number(scheduleForm.costEstimate),
      status: 'Terjadwal',
      notes: scheduleForm.notes
    };

    setScheduleList([newSchedule, ...scheduleList]);
    setShowScheduleModal(false);
    triggerToast(`Jadwal ${newSchedule.docType} untuk armada ${newSchedule.busId} berhasil didaftarkan.`);
  };

  // Submit Quick Update / Perpanjangan Dokumen
  const handleSaveQuickUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBus) return;

    setLegalList((prevList) =>
      prevList.map((item) => {
        if (item.id === selectedBus.id) {
          const updated = { ...item };

          if (quickForm.updateType === 'kir') {
            updated.kir = `${quickForm.newExpiryDate} (Aktif)`;
            updated.kirDate = quickForm.newExpiryDate;
            if (quickForm.newDocNumber) updated.kirNumber = quickForm.newDocNumber;
            updated.kirLocation = quickForm.testedLocation;
          } else if (quickForm.updateType === 'kps') {
            updated.kps = `${quickForm.newExpiryDate}`;
            updated.kpsDate = quickForm.newExpiryDate;
            if (quickForm.newDocNumber) updated.kpsNumber = quickForm.newDocNumber;
          } else if (quickForm.updateType === 'stnk') {
            updated.stnk = `${quickForm.newExpiryDate}`;
            updated.stnkDate = quickForm.newExpiryDate;
            if (quickForm.newDocNumber) updated.stnkNumber = quickForm.newDocNumber;
          }

          // Kembalikan status ke Road Legal
          updated.status = 'Road Legal';
          updated.statusClass = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
          updated.notes = quickForm.notes;

          return updated;
        }
        return item;
      })
    );

    setShowQuickModal(false);
    triggerToast(`Dokumen armada ${selectedBus.id} berhasil diperbarui. Status armada kini Road Legal.`);
  };

  // Selesaikan Jadwal Pengujian (Tandai Selesai & Perpanjang Otomatis)
  const handleMarkScheduleDone = (sch: LegalScheduleItem) => {
    setScheduleList((prev) =>
      prev.map((s) => (s.id === sch.id ? { ...s, status: 'Selesai Lulus' } : s))
    );

    // Auto-update kendaraan terkait
    setLegalList((prev) =>
      prev.map((item) => {
        if (item.id === sch.busId) {
          const nextDate = new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().slice(0, 10);
          return {
            ...item,
            kir: `${nextDate} (Aktif)`,
            kirDate: nextDate,
            status: 'Road Legal',
            statusClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          };
        }
        return item;
      })
    );

    triggerToast(`Hasil pengujian armada ${sch.busId} terverifikasi Lulus. Status armada diperbarui.`);
  };

  // ================= Kalkulasi Metrik KPI =================
  const metrics = useMemo(() => {
    const total = legalList.length;
    const ready = legalList.filter((x) => x.status === 'Road Legal').length;
    const restricted = legalList.filter((x) => x.status === 'Restricted').length;
    const grounded = legalList.filter((x) => x.status === 'Grounded').length;
    const readyPercent = total > 0 ? ((ready / total) * 100).toFixed(1) : '0';

    return { total, ready, restricted, grounded, readyPercent };
  }, [legalList]);

  // Filter Data Armada
  const filteredLegal = useMemo(() => {
    return legalList.filter((row) => {
      const matchesSearch =
        row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row.kirNumber && row.kirNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (row.kpsNumber && row.kpsNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || row.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [legalList, searchQuery, filterStatus]);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Utama & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Legalitas & Dokumen Armada</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              SPIONAM Terhubung
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-primary text-[11px] font-bold border border-blue-200">
              Mitra UPUBKB Dishub Aktif
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Monitoring kepatuhan kelaikan Uji Berkala KIR (BLUE RFID), Kartu Pengawasan (KPS Kemenhub), dan Pajak STNK Samsat.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Jadwal Uji */}
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-3.5 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">event</span>
            + Jadwal Uji Dishub
          </button>

          {/* Tombol Registrasi Dokumen Baru */}
          <button
            onClick={() => setShowAddDocModal(true)}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            + Registrasi Dokumen
          </button>
        </div>
      </div>

      {/* Kartu Ringkasan Metrik KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant uppercase font-bold">Total Armada Terdata</span>
            <span className="material-symbols-outlined text-primary text-[20px]">directions_bus</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-1">{metrics.total} Unit</div>
          <span className="text-[11px] text-on-surface-variant">Armada Trayek Reguler & Pariwisata</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-xs border-y border-r border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-800 uppercase font-bold">Siap Jalan (Road Legal)</span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">verified</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-1">
            {metrics.ready}{' '}
            <span className="text-xs font-normal text-emerald-700">({metrics.readyPercent}%)</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Dokumen KIR, KPS & STNK Lengkap</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-amber-400 shadow-xs border-y border-r border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-800 uppercase font-bold">Perlu Perpanjangan (&lt;14 Hari)</span>
            <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {metrics.restricted} <span className="text-xs font-normal text-on-surface-variant">Unit</span>
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">Masa Berlaku Mendekati Batas Akhir</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-error shadow-xs border-y border-r border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-error uppercase font-bold">Grounded / Kunci SPJ</span>
            <span className="material-symbols-outlined text-error text-[20px]">block</span>
          </div>
          <div className="text-2xl font-bold text-error mt-1">
            {metrics.grounded} <span className="text-xs font-normal text-on-surface-variant">Unit</span>
          </div>
          <span className="text-[11px] text-error font-semibold">Dilarang Operasi (KIR / KPS Expired)</span>
        </div>
      </div>

      {/* Navigasi Sub-Tab */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('kelaikan')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'kelaikan'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          Status Dokumen & Kelaikan ({legalList.length})
        </button>

        <button
          onClick={() => setActiveTab('jadwal')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'jadwal'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          Jadwal Antrean Uji Dishub & Samsat ({scheduleList.length})
        </button>
      </div>

      {/* ================= TAB 1: STATUS DOKUMEN & KELAIKAN ================= */}
      {activeTab === 'kelaikan' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {/* Bar Filter & Pencarian */}
          <div className="p-4 bg-surface-container-low flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-surface-container">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor lambung, plat nomor, trayek, atau nomor izin..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-surface-container p-0.5 rounded-lg">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === 'all' ? 'bg-primary text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Semua ({legalList.length})
                </button>
                <button
                  onClick={() => setFilterStatus('Road Legal')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === 'Road Legal' ? 'bg-emerald-700 text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Siap Jalan ({metrics.ready})
                </button>
                <button
                  onClick={() => setFilterStatus('Restricted')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === 'Restricted' ? 'bg-amber-600 text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Perlu Perpanjangan ({metrics.restricted})
                </button>
                <button
                  onClick={() => setFilterStatus('Grounded')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === 'Grounded' ? 'bg-error text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Grounded ({metrics.grounded})
                </button>
              </div>
            </div>
          </div>

          {/* Datatable Legalitas */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                  <th className="py-3 px-4">Armada, Plat & Sasis</th>
                  <th className="py-3 px-4">Uji KIR Dishub (BLUE)</th>
                  <th className="py-3 px-4">KPS SPIONAM Kemenhub</th>
                  <th className="py-3 px-4">Pajak STNK Samsat</th>
                  <th className="py-3 px-4">Asuransi Penumpang</th>
                  <th className="py-3 px-4 text-center">Status Kelaikan</th>
                  <th className="py-3 px-4 text-right">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredLegal.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-surface-container-low/50 transition-colors ${
                      row.status === 'Grounded' ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary text-sm">{row.id}</span>
                        <span className="font-bold text-on-surface">{row.plate}</span>
                      </div>
                      <span className="text-[11px] text-outline block mt-0.5">{row.route}</span>
                      {row.chassis && (
                        <span className="text-[10px] text-on-surface-variant block">{row.chassis}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-semibold ${
                            row.kir.includes('Expired')
                              ? 'text-error font-bold'
                              : row.kir.includes('H-')
                              ? 'text-amber-700 font-bold'
                              : 'text-on-surface'
                          }`}
                        >
                          {row.kir}
                        </span>
                      </div>
                      {row.kirNumber && (
                        <span className="font-mono text-[10px] text-primary block mt-0.5">{row.kirNumber}</span>
                      )}
                      {row.kirLocation && (
                        <span className="text-[10px] text-on-surface-variant block">{row.kirLocation}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold block ${
                          row.kps.includes('H-') ? 'text-amber-700 font-bold' : 'text-on-surface'
                        }`}
                      >
                        {row.kps}
                      </span>
                      {row.kpsNumber && (
                        <span className="font-mono text-[10px] text-primary block mt-0.5">{row.kpsNumber}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-on-surface font-semibold block">{row.stnk}</span>
                      {row.samsatLocation && (
                        <span className="text-[10px] text-on-surface-variant block">{row.samsatLocation}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-on-surface font-medium block">Jasa Raharja IWKBU</span>
                      <span className="font-mono text-[10px] text-emerald-700 block">
                        {row.insuranceDate ? `s/d ${row.insuranceDate}` : 'Polis Terverifikasi'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.statusClass}`}>
                        {row.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenQuickManage(row)}
                        className="px-3 py-1.5 bg-surface-container hover:bg-primary hover:text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">tune</span>
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLegal.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] text-outline mb-1 block">verified_user</span>
                      Tidak ada armada yang sesuai dengan kriteria filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: JADWAL ANTREAN UJI DISHUB ================= */}
      {activeTab === 'jadwal' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-4 bg-surface-container-low flex justify-between items-center border-b border-surface-container">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Jadwal Antrean Uji Dishub & Samsat Polri</h3>
              <p className="text-xs text-on-surface-variant">Slot booking antrean pengujian fisik kendaraan dan perpanjangan STNK.</p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3.5 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              + Buat Jadwal Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                  <th className="py-3 px-4">No. Antrean & Tanggal</th>
                  <th className="py-3 px-4">Armada & Nomor Plat</th>
                  <th className="py-3 px-4">Jenis Pengujian</th>
                  <th className="py-3 px-4">Balai Pengujian / Lokasi</th>
                  <th className="py-3 px-4">Pengemudi Pendamping</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {scheduleList.map((sch) => (
                  <tr key={sch.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-primary block">{sch.id}</span>
                      <span className="text-[11px] text-on-surface">{sch.scheduledDate}</span>
                      <span className="text-[10px] text-outline block">{sch.scheduledTime}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-primary text-sm block">{sch.busId}</span>
                      <span className="font-bold text-on-surface">{sch.plate}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-on-surface">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-medium border border-outline-variant/30">
                        {sch.docType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-on-surface block">{sch.location}</span>
                      {sch.notes && <span className="text-[10px] text-outline block">{sch.notes}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant font-medium">{sch.assignedDriver}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          sch.status === 'Selesai Lulus'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sch.status === 'Proses Uji'
                            ? 'bg-blue-100 text-primary'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sch.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {sch.status !== 'Selesai Lulus' && (
                        <button
                          onClick={() => handleMarkScheduleDone(sch)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Tandai Lulus Uji
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MODAL REGISTRASI DOKUMEN ARMADA LENGKAP                                */}
      {/* ========================================================================= */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Registrasi Dokumen Legalitas Armada</h3>
                  <p className="text-xs text-on-surface-variant">
                    Daftarkan nomor buku uji KIR Dishub (BLUE), kartu pengawasan KPS, dan STNK kendaraan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddDocModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="add-doc-form" onSubmit={handleSaveDocForm} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* Seksi 1: Identitas Armada */}
              <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">1. Identitas Armada & Trayek</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Lambung *</label>
                    <input
                      required
                      value={docForm.id}
                      onChange={(e) => setDocForm({ ...docForm, id: e.target.value })}
                      placeholder="Contoh: TY-099"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Polisi (Plat) *</label>
                    <input
                      required
                      value={docForm.plate}
                      onChange={(e) => setDocForm({ ...docForm, plate: e.target.value })}
                      placeholder="Contoh: B 7999 TAY"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Trayek Operasi *</label>
                    <input
                      required
                      value={docForm.route}
                      onChange={(e) => setDocForm({ ...docForm, route: e.target.value })}
                      placeholder="Contoh: Jakarta - Solo • Wonogiri"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tipe Sasis Kendaraan</label>
                    <select
                      value={docForm.chassis}
                      onChange={(e) => setDocForm({ ...docForm, chassis: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    >
                      <option value="Mercedes-Benz OH 1626 L Air Suspension">Mercedes-Benz OH 1626 L Air Suspension</option>
                      <option value="Scania K410IB 6x2*4 Opticruise">Scania K410IB 6x2*4 Opticruise</option>
                      <option value="Hino RM280 Space Frame">Hino RM280 Space Frame</option>
                      <option value="Volvo B11R 430HP 6x2">Volvo B11R 430HP 6x2</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Pabrikan Bodi / Karoseri</label>
                    <input
                      value={docForm.body}
                      onChange={(e) => setDocForm({ ...docForm, body: e.target.value })}
                      placeholder="Contoh: Adiputro Jetbus 5 MHD"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 2: Uji Berkala KIR Dishub */}
              <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">2. Dokumen Uji Berkala KIR Dishub (BLUE RFID)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Smart Card BLUE *</label>
                    <input
                      required
                      value={docForm.kirNumber}
                      onChange={(e) => setDocForm({ ...docForm, kirNumber: e.target.value })}
                      placeholder="Contoh: BLUE-JKT-2024-12099"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tanggal Jatuh Tempo KIR *</label>
                    <input
                      type="date"
                      required
                      value={docForm.kirDate}
                      onChange={(e) => setDocForm({ ...docForm, kirDate: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Balai Pengujian UPUBKB *</label>
                    <input
                      required
                      value={docForm.kirLocation}
                      onChange={(e) => setDocForm({ ...docForm, kirLocation: e.target.value })}
                      placeholder="Contoh: UPUBKB Dishub Pulogadung"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Hasil Uji Efisiensi Rem Utama</label>
                    <input
                      value={docForm.brakeEfficiency}
                      onChange={(e) => setDocForm({ ...docForm, brakeEfficiency: e.target.value })}
                      placeholder="Contoh: 68% (Lulus Standar Dishub Min 50%)"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Hasil Uji Emisi Gas Buang</label>
                    <input
                      value={docForm.emissionResult}
                      onChange={(e) => setDocForm({ ...docForm, emissionResult: e.target.value })}
                      placeholder="Contoh: Opasitas 22% (Maks 50%)"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 3: Kartu Pengawasan SPIONAM */}
              <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">3. Kartu Pengawasan (KPS) SPIONAM Kemenhub</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Kartu Pengawasan (KPS) *</label>
                    <input
                      required
                      value={docForm.kpsNumber}
                      onChange={(e) => setDocForm({ ...docForm, kpsNumber: e.target.value })}
                      placeholder="Contoh: KPS-AKAP-2024-00991"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Jatuh Tempo KPS *</label>
                    <input
                      type="date"
                      required
                      value={docForm.kpsDate}
                      onChange={(e) => setDocForm({ ...docForm, kpsDate: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Kode Koridor Resmi</label>
                    <input
                      value={docForm.corridorCode}
                      onChange={(e) => setDocForm({ ...docForm, corridorCode: e.target.value })}
                      placeholder="Contoh: KOR-06-WNG"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Nomor SK Izin Trayek Kemenhub</label>
                  <input
                    value={docForm.skTrayek}
                    onChange={(e) => setDocForm({ ...docForm, skTrayek: e.target.value })}
                    placeholder="Contoh: SK.503/AJ.001/DJPD/2024"
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              {/* Seksi 4: STNK & Pajak Samsat */}
              <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs uppercase tracking-wide">4. STNK & Pajak Kendaraan Bermotor (Samsat)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Nomor Registrasi STNK</label>
                    <input
                      value={docForm.stnkNumber}
                      onChange={(e) => setDocForm({ ...docForm, stnkNumber: e.target.value })}
                      placeholder="Contoh: STNK-POL-7999099"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Jatuh Tempo Pajak Tahunan *</label>
                    <input
                      type="date"
                      required
                      value={docForm.stnkDate}
                      onChange={(e) => setDocForm({ ...docForm, stnkDate: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Masa Berlaku STNK 5 Tahun</label>
                    <input
                      value={docForm.fiveYearDate}
                      onChange={(e) => setDocForm({ ...docForm, fiveYearDate: e.target.value })}
                      placeholder="Contoh: 2029-10-15"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Samsat Induk Terdaftar</label>
                    <input
                      value={docForm.samsatLocation}
                      onChange={(e) => setDocForm({ ...docForm, samsatLocation: e.target.value })}
                      placeholder="Contoh: Samsat Jakarta Timur"
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Estimasi Biaya PKB Tahunan (Rp)</label>
                    <input
                      type="number"
                      value={docForm.taxAmount}
                      onChange={(e) => setDocForm({ ...docForm, taxAmount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 5: PIC & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Petugas Legalitas PIC *</label>
                  <input
                    required
                    value={docForm.picName}
                    onChange={(e) => setDocForm({ ...docForm, picName: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Catatan Tambahan</label>
                  <input
                    value={docForm.notes}
                    onChange={(e) => setDocForm({ ...docForm, notes: e.target.value })}
                    placeholder="Catatan berkas, nomor resi, asuransi Jasa Raharja..."
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="add-doc-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan & Daftarkan Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL PENJADWALAN UJI DISHUB / SAMSAT                                  */}
      {/* ========================================================================= */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">event</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Penjadwalan Kunjungan Uji Dishub & Samsat</h3>
                  <p className="text-xs text-on-surface-variant">Booking slot antrean uji berkala KIR atau perpanjangan STNK.</p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="schedule-test-form" onSubmit={handleSaveSchedule} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Pilih Armada Bus *</label>
                  <select
                    value={scheduleForm.busId}
                    onChange={(e) => {
                      const found = legalList.find((l) => l.id === e.target.value);
                      setScheduleForm({
                        ...scheduleForm,
                        busId: e.target.value,
                        plate: found ? found.plate : ''
                      });
                    }}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                  >
                    {legalList.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.id} - {l.plate} ({l.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Jenis Pengujian / Legalitas *</label>
                  <select
                    value={scheduleForm.docType}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, docType: e.target.value as any })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                  >
                    <option value="Uji KIR Dishub (BLUE)">Uji KIR Dishub (BLUE)</option>
                    <option value="Perpanjangan KPS SPIONAM">Perpanjangan KPS SPIONAM</option>
                    <option value="Pajak STNK Tahunan">Pajak STNK Tahunan</option>
                    <option value="Cek Fisik 5 Tahunan">Cek Fisik 5 Tahunan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Tanggal Jadwal Kunjungan *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Jam / Slot Antrean *</label>
                  <input
                    required
                    value={scheduleForm.scheduledTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                    placeholder="Contoh: 08:30 WIB"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Lokasi Balai Pengujian / Samsat *</label>
                <select
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                >
                  <option value="UPUBKB Dishub Pulogadung">UPUBKB Dishub Pulogadung Jakarta Timur</option>
                  <option value="UPUBKB Dishub Ujung Menteng Cakung">UPUBKB Dishub Ujung Menteng Cakung</option>
                  <option value="UPUBKB Dishub Kota Bandung Gedebage">UPUBKB Dishub Kota Bandung Gedebage</option>
                  <option value="UPUBKB Dishub Surabaya Wiyung">UPUBKB Dishub Surabaya Wiyung</option>
                  <option value="Samsat Jakarta Timur">Samsat Jakarta Timur</option>
                  <option value="Pelayanan Terpadu Satu Pintu (PTSP) Kemenhub">PTSP Kemenhub Jakarta Pusat</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Pengemudi / Petugas Pendamping *</label>
                  <input
                    required
                    value={scheduleForm.assignedDriver}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, assignedDriver: e.target.value })}
                    placeholder="Contoh: Suparno (Driver Workshop)"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Estimasi Biaya Retribusi (Rp)</label>
                  <input
                    type="number"
                    value={scheduleForm.costEstimate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, costEstimate: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Catatan / Kesiapan Armada Pra-Uji</label>
                <textarea
                  rows={2}
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  placeholder="Checklist lampu, uji rem kolong, APAR, palu darurat, nomor antrean booking..."
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="schedule-test-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Konfirmasi Jadwal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL KELOLA & PERPANJANGAN CEPAT (QUICK MANAGE)                       */}
      {/* ========================================================================= */}
      {showQuickModal && selectedBus && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    selectedBus.status === 'Grounded'
                      ? 'bg-red-50 text-error'
                      : selectedBus.status === 'Restricted'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">tune</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Kelola Dokumen Armada {selectedBus.id}</h3>
                  <p className="text-xs text-on-surface-variant">Plat Polisi: {selectedBus.plate} • {selectedBus.route}</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="quick-manage-form" onSubmit={handleSaveQuickUpdate} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {/* Status Banner Saat Ini */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  selectedBus.status === 'Grounded'
                    ? 'bg-red-50 text-red-900 border-red-200'
                    : selectedBus.status === 'Restricted'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}
              >
                <div>
                  <span className="text-[11px] uppercase font-bold block">Status Kelaikan Saat Ini</span>
                  <span className="text-sm font-bold">{selectedBus.status}</span>
                  {selectedBus.notes && <p className="text-[11px] mt-0.5 opacity-90">{selectedBus.notes}</p>}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${selectedBus.statusClass}`}>
                  {selectedBus.status}
                </span>
              </div>

              {/* Rincian Masa Berlaku Dokumen Aktif */}
              <div className="grid grid-cols-3 gap-2.5 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Uji KIR Dishub</span>
                  <span className={`font-semibold text-xs mt-0.5 block ${selectedBus.kir.includes('Expired') ? 'text-error font-bold' : 'text-on-surface'}`}>
                    {selectedBus.kir}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">KPS SPIONAM</span>
                  <span className={`font-semibold text-xs mt-0.5 block ${selectedBus.kps.includes('H-') ? 'text-amber-700 font-bold' : 'text-on-surface'}`}>
                    {selectedBus.kps}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Pajak STNK</span>
                  <span className="font-semibold text-xs mt-0.5 block text-on-surface">
                    {selectedBus.stnk}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-container">
                <span className="font-bold text-primary block mb-2 text-xs">Pembaruan Masa Berlaku Dokumen</span>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Dokumen yang Diperpanjang *</label>
                    <select
                      value={quickForm.updateType}
                      onChange={(e) => setQuickForm({ ...quickForm, updateType: e.target.value as any })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                    >
                      <option value="kir">Uji Berkala KIR Dishub (BLUE RFID)</option>
                      <option value="kps">Kartu Pengawasan (KPS) SPIONAM Kemenhub</option>
                      <option value="stnk">Pajak STNK & SWDKLLJ Samsat</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-on-surface">Tanggal Kedaluwarsa Baru *</label>
                      <input
                        type="date"
                        required
                        value={quickForm.newExpiryDate}
                        onChange={(e) => setQuickForm({ ...quickForm, newExpiryDate: e.target.value })}
                        className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-on-surface">Nomor Smart Card / Dokumen Baru *</label>
                      <input
                        required
                        value={quickForm.newDocNumber}
                        onChange={(e) => setQuickForm({ ...quickForm, newDocNumber: e.target.value })}
                        placeholder="Contoh: BLUE-JKT-2024-88910"
                        className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Balai Pengujian / Samsat</label>
                    <input
                      value={quickForm.testedLocation}
                      onChange={(e) => setQuickForm({ ...quickForm, testedLocation: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Catatan Hasil Uji & Kelaikan</label>
                    <textarea
                      rows={2}
                      value={quickForm.notes}
                      onChange={(e) => setQuickForm({ ...quickForm, notes: e.target.value })}
                      placeholder="Lulus uji efisiensi rem 72%, opasitas 18%, kunci SPJ diserahkan kembali ke pool..."
                      className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowQuickModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="quick-manage-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Simpan & Aktifkan Road Legal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
