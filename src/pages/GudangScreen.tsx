import React, { useState, useMemo } from 'react';
import {
  mockParts,
  mockGoodsReceipts,
  mockGoodsIssues,
  mockStockMutations,
  mockStockOpnames
} from '../data/mockInventory';
import {
  PartItem,
  GoodsReceiptItem,
  GoodsIssueItem,
  StockMutationItem,
  StockOpnameItem
} from '../types';

// Helper parse angka stok dari string "18 Pcs", "1.240 L", dsb.
const parseStockNumber = (stockStr: string): number => {
  const clean = stockStr.replace(/[^\d]/g, '');
  return parseInt(clean, 10) || 0;
};

// Helper format Rupiah
const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

export const GudangScreen: React.FC = () => {
  // Master Inventory Data States
  const [parts, setParts] = useState<PartItem[]>(mockParts);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceiptItem[]>(mockGoodsReceipts);
  const [goodsIssues, setGoodsIssues] = useState<GoodsIssueItem[]>(mockGoodsIssues);
  const [stockMutations, setStockMutations] = useState<StockMutationItem[]>(mockStockMutations);
  const [stockOpnames, setStockOpnames] = useState<StockOpnameItem[]>(mockStockOpnames);

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState<'katalog' | 'receipt' | 'issue' | 'mutation' | 'opname'>('katalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'crit' | 'reorder'>('all');
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('all');

  // Modal Visibility States
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showNewSKUModal, setShowNewSKUModal] = useState<boolean>(false);
  const [showIssueModal, setShowIssueModal] = useState<boolean>(false);
  const [showMutationModal, setShowMutationModal] = useState<boolean>(false);
  const [showOpnameModal, setShowOpnameModal] = useState<boolean>(false);

  // Toast / Alert Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ================= Form States =================

  // 1. Form Penerimaan Barang (PO / Goods Receipt)
  const [receiptForm, setReceiptForm] = useState({
    grNumber: `GR-2026-${String(goodsReceipts.length + 43).padStart(4, '0')}`,
    poNumber: 'PO-2026-0815',
    deliveryOrderNumber: '',
    vendor: 'PT United Tractors Tbk (Scania)',
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    targetPool: 'Gudang Utama Pulogebang',
    sku: mockParts[0]?.sku || '',
    partName: mockParts[0]?.name || '',
    quantity: 10,
    unit: mockParts[0]?.unit || 'Pcs',
    unitPrice: 485000,
    rackLocation: mockParts[0]?.rack || 'RAK-A3-04',
    condition: 'Baik & Segel Utuh' as 'Baik & Segel Utuh' | 'Kemasan Rusak (Part Baik)' | 'Cacat Sebagian / Retur',
    receivedBy: 'Bagus Prasetyo (Checker)',
    notes: ''
  });

  // 2. Form Registrasi SKU Baru (Part Master)
  const [newSKUForm, setNewSKUForm] = useState({
    sku: '',
    name: '',
    category: 'Pelumasan & Filter',
    chassis: 'Mercedes-Benz OH 1626',
    brand: '',
    rack: 'RAK-A1-01',
    stock: 10,
    min: 5,
    unit: 'Pcs',
    price: 350000,
    leadTime: '2 Hari',
    notes: ''
  });

  // 3. Form Bon Pengeluaran (Goods Issue ke SPK)
  const [issueForm, setIssueForm] = useState({
    giNumber: `GI-2026-${String(goodsIssues.length + 130).padStart(4, '0')}`,
    spkNumber: 'SPK-2026-001 (TY-082)',
    busId: 'TY-082',
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    sku: mockParts[0]?.sku || '',
    partName: mockParts[0]?.name || '',
    quantity: 1,
    unit: mockParts[0]?.unit || 'Pcs',
    availableStock: parseStockNumber(mockParts[0]?.stock || '0'),
    requestedBy: 'Hendra Saputra',
    approvedBy: 'Bambang Sugianto (Foreman)',
    purpose: 'Penggantian rutin sesuai SPK Bengkel',
    oldPartStatus: 'Part bekas ditarik ke keranjang scrap gudang'
  });

  // 4. Form Mutasi Antar-Pool
  const [mutationForm, setMutationForm] = useState({
    mutationNumber: `MUT-2026-${String(stockMutations.length + 83).padStart(4, '0')}`,
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    originPool: 'Gudang Utama Pulogebang',
    destinationPool: 'Gudang Tangerang Poris',
    sku: mockParts[0]?.sku || '',
    partName: mockParts[0]?.name || '',
    quantity: 2,
    unit: mockParts[0]?.unit || 'Pcs',
    transportBy: 'Mobil Operasional Logistik B 9112 TAY',
    sentBy: 'Bagus Prasetyo (Gudang Pusat)',
    notes: 'Pemenuhan kebutuhan buffer stock depo'
  });

  // 5. Form Stock Opname
  const [opnameForm, setOpnameForm] = useState({
    opnameDate: new Date().toISOString().slice(0, 10),
    pool: 'Gudang Utama Pulogebang',
    rackLocation: mockParts[0]?.rack || 'RAK-A3-04',
    sku: mockParts[0]?.sku || '',
    partName: mockParts[0]?.name || '',
    systemStock: parseStockNumber(mockParts[0]?.stock || '0'),
    actualStock: parseStockNumber(mockParts[0]?.stock || '0'),
    unit: mockParts[0]?.unit || 'Pcs',
    discrepancyReason: 'Fisik Cocok (Akurat)' as 'Fisik Cocok (Akurat)' | 'Kerusakan / Pecah Belum Lapor' | 'Salah Catat SPK Sebelumnya' | 'Retur Belum Dicatat',
    actionTaken: 'Sinkronkan Sistem ke Stok Fisik' as 'Sinkronkan Sistem ke Stok Fisik' | 'Investigasi Lanjutan Gudang',
    auditor: 'Suryanto (Internal Auditor)',
    notes: ''
  });

  // ================= Handler Modal & Auto-fill =================

  // Pilihan part pada Form Penerimaan
  const handleSelectPartReceipt = (skuCode: string) => {
    const found = parts.find((p) => p.sku === skuCode);
    if (found) {
      const priceNum = parseInt(found.price.replace(/[^\d]/g, ''), 10) || 100000;
      setReceiptForm({
        ...receiptForm,
        sku: found.sku,
        partName: found.name,
        rackLocation: found.rack,
        unit: found.unit || 'Pcs',
        unitPrice: priceNum
      });
    }
  };

  // Pilihan part pada Form Pengeluaran
  const handleSelectPartIssue = (skuCode: string) => {
    const found = parts.find((p) => p.sku === skuCode);
    if (found) {
      setIssueForm({
        ...issueForm,
        sku: found.sku,
        partName: found.name,
        unit: found.unit || 'Pcs',
        availableStock: parseStockNumber(found.stock),
        quantity: 1
      });
    }
  };

  // Pilihan part pada Form Stock Opname
  const handleSelectPartOpname = (skuCode: string) => {
    const found = parts.find((p) => p.sku === skuCode);
    if (found) {
      const sysNum = parseStockNumber(found.stock);
      setOpnameForm({
        ...opnameForm,
        sku: found.sku,
        partName: found.name,
        rackLocation: found.rack,
        systemStock: sysNum,
        actualStock: sysNum,
        unit: found.unit || 'Pcs'
      });
    }
  };

  // Tombol aksi baris: langsung buka modal pengeluaran untuk part tersebut
  const handleOpenIssueForSpecificPart = (part: PartItem) => {
    setIssueForm({
      ...issueForm,
      sku: part.sku,
      partName: part.name,
      unit: part.unit || 'Pcs',
      availableStock: parseStockNumber(part.stock),
      quantity: 1
    });
    setShowIssueModal(true);
  };

  // Tombol aksi baris: langsung buka modal PO masuk untuk part tersebut
  const handleOpenReceiptForSpecificPart = (part: PartItem) => {
    const priceNum = parseInt(part.price.replace(/[^\d]/g, ''), 10) || 100000;
    setReceiptForm({
      ...receiptForm,
      sku: part.sku,
      partName: part.name,
      rackLocation: part.rack,
      unit: part.unit || 'Pcs',
      unitPrice: priceNum
    });
    setShowReceiptModal(true);
  };

  // ================= Submit Handlers =================

  // 1. Simpan Penerimaan Barang
  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = receiptForm.quantity * receiptForm.unitPrice;

    const newGR: GoodsReceiptItem = {
      id: `GR-${Date.now()}`,
      grNumber: receiptForm.grNumber,
      poNumber: receiptForm.poNumber,
      deliveryOrderNumber: receiptForm.deliveryOrderNumber || `DO-${Date.now().toString().slice(-4)}`,
      vendor: receiptForm.vendor,
      date: receiptForm.date,
      targetPool: receiptForm.targetPool,
      sku: receiptForm.sku,
      partName: receiptForm.partName,
      quantity: Number(receiptForm.quantity),
      unit: receiptForm.unit,
      unitPrice: Number(receiptForm.unitPrice),
      totalPrice,
      rackLocation: receiptForm.rackLocation,
      condition: receiptForm.condition,
      receivedBy: receiptForm.receivedBy,
      notes: receiptForm.notes
    };

    // Update stok pada part terkait
    setParts((prevParts) =>
      prevParts.map((p) => {
        if (p.sku === receiptForm.sku) {
          const currentQty = parseStockNumber(p.stock);
          const newQty = currentQty + Number(receiptForm.quantity);
          const minQty = parseStockNumber(p.min);
          const priceNum = parseInt(p.price.replace(/[^\d]/g, ''), 10) || receiptForm.unitPrice;
          const newTotal = formatRupiah(newQty * priceNum);

          let newStatus = 'Prima';
          let isCrit = false;
          if (newQty <= 0) {
            newStatus = 'Kritis';
            isCrit = true;
          } else if (newQty <= minQty) {
            newStatus = 'Reorder';
            isCrit = true;
          }

          return {
            ...p,
            stock: `${newQty.toLocaleString('id-ID')} ${receiptForm.unit}`,
            total: newTotal,
            status: newStatus,
            isCrit
          };
        }
        return p;
      })
    );

    setGoodsReceipts([newGR, ...goodsReceipts]);
    setShowReceiptModal(false);
    triggerToast(`Penerimaan PO ${receiptForm.poNumber} berhasil dicatat. Stok ${receiptForm.sku} bertambah +${receiptForm.quantity} ${receiptForm.unit}.`);
    // Siapkan no GR berikutnya
    setReceiptForm((prev) => ({
      ...prev,
      grNumber: `GR-2026-${String(goodsReceipts.length + 44).padStart(4, '0')}`,
      deliveryOrderNumber: '',
      notes: ''
    }));
  };

  // 2. Simpan Registrasi SKU Baru
  const handleSaveNewSKU = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = Number(newSKUForm.stock);
    const minNum = Number(newSKUForm.min);
    const priceNum = Number(newSKUForm.price);
    const totalVal = formatRupiah(stockNum * priceNum);

    let status = 'Prima';
    let isCrit = false;
    if (stockNum <= 0) {
      status = 'Kritis';
      isCrit = true;
    } else if (stockNum <= minNum) {
      status = 'Reorder';
      isCrit = true;
    }

    const newPart: PartItem = {
      sku: newSKUForm.sku.toUpperCase().trim(),
      name: newSKUForm.name.trim(),
      category: newSKUForm.category,
      chassis: newSKUForm.chassis,
      brand: newSKUForm.brand.trim() || 'Genuine Part',
      rack: newSKUForm.rack.trim().toUpperCase(),
      stock: `${stockNum.toLocaleString('id-ID')} ${newSKUForm.unit}`,
      min: `${minNum.toLocaleString('id-ID')} ${newSKUForm.unit}`,
      unit: newSKUForm.unit,
      price: formatRupiah(priceNum),
      total: totalVal,
      status,
      isCrit,
      leadTime: newSKUForm.leadTime
    };

    setParts([newPart, ...parts]);
    setShowNewSKUModal(false);
    triggerToast(`SKU baru ${newPart.sku} (${newPart.name}) berhasil didaftarkan ke katalog master.`);
    setNewSKUForm({
      sku: '',
      name: '',
      category: 'Pelumasan & Filter',
      chassis: 'Mercedes-Benz OH 1626',
      brand: '',
      rack: 'RAK-A1-01',
      stock: 10,
      min: 5,
      unit: 'Pcs',
      price: 350000,
      leadTime: '2 Hari',
      notes: ''
    });
  };

  // 3. Simpan Bon Pengeluaran ke SPK
  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const reqQty = Number(issueForm.quantity);
    if (reqQty > issueForm.availableStock) {
      alert(`Stok tidak mencukupi! Permintaan: ${reqQty} ${issueForm.unit}, Stok Tersedia: ${issueForm.availableStock} ${issueForm.unit}`);
      return;
    }

    const newGI: GoodsIssueItem = {
      id: `GI-${Date.now()}`,
      giNumber: issueForm.giNumber,
      spkNumber: issueForm.spkNumber,
      busId: issueForm.busId,
      date: issueForm.date,
      sku: issueForm.sku,
      partName: issueForm.partName,
      quantity: reqQty,
      unit: issueForm.unit,
      requestedBy: issueForm.requestedBy,
      approvedBy: issueForm.approvedBy,
      purpose: issueForm.purpose,
      oldPartStatus: issueForm.oldPartStatus
    };

    // Kurangi stok di katalog
    setParts((prevParts) =>
      prevParts.map((p) => {
        if (p.sku === issueForm.sku) {
          const currentQty = parseStockNumber(p.stock);
          const newQty = Math.max(0, currentQty - reqQty);
          const minQty = parseStockNumber(p.min);
          const priceNum = parseInt(p.price.replace(/[^\d]/g, ''), 10) || 0;
          const newTotal = formatRupiah(newQty * priceNum);

          let newStatus = 'Prima';
          let isCrit = false;
          if (newQty <= 0) {
            newStatus = 'Kritis';
            isCrit = true;
          } else if (newQty <= minQty) {
            newStatus = 'Reorder';
            isCrit = true;
          }

          return {
            ...p,
            stock: `${newQty.toLocaleString('id-ID')} ${p.unit || 'Pcs'}`,
            total: newTotal,
            status: newStatus,
            isCrit
          };
        }
        return p;
      })
    );

    setGoodsIssues([newGI, ...goodsIssues]);
    setShowIssueModal(false);
    triggerToast(`Bon Pengeluaran ${issueForm.giNumber} berhasil dicatat. Stok ${issueForm.sku} dikurangi -${reqQty} ${issueForm.unit}.`);
    setIssueForm((prev) => ({
      ...prev,
      giNumber: `GI-2026-${String(goodsIssues.length + 131).padStart(4, '0')}`,
      quantity: 1
    }));
  };

  // 4. Simpan Mutasi Antar-Pool
  const handleSaveMutation = (e: React.FormEvent) => {
    e.preventDefault();
    const found = parts.find((p) => p.sku === mutationForm.sku);
    const curStock = found ? parseStockNumber(found.stock) : 0;
    const reqQty = Number(mutationForm.quantity);

    if (reqQty > curStock) {
      alert(`Stok di pool asal tidak mencukupi untuk dimutasi! Tersedia: ${curStock}, diminta: ${reqQty}`);
      return;
    }

    const newMutation: StockMutationItem = {
      id: `MUT-${Date.now()}`,
      mutationNumber: mutationForm.mutationNumber,
      date: mutationForm.date,
      originPool: mutationForm.originPool,
      destinationPool: mutationForm.destinationPool,
      sku: mutationForm.sku,
      partName: mutationForm.partName,
      quantity: reqQty,
      unit: mutationForm.unit,
      transportBy: mutationForm.transportBy,
      sentBy: mutationForm.sentBy,
      status: 'Dalam Pengiriman',
      notes: mutationForm.notes
    };

    // Kurangi stok di pool pengirim
    setParts((prevParts) =>
      prevParts.map((p) => {
        if (p.sku === mutationForm.sku) {
          const currentQty = parseStockNumber(p.stock);
          const newQty = Math.max(0, currentQty - reqQty);
          const minQty = parseStockNumber(p.min);
          const priceNum = parseInt(p.price.replace(/[^\d]/g, ''), 10) || 0;

          let newStatus = 'Prima';
          let isCrit = false;
          if (newQty <= 0) {
            newStatus = 'Kritis';
            isCrit = true;
          } else if (newQty <= minQty) {
            newStatus = 'Reorder';
            isCrit = true;
          }

          return {
            ...p,
            stock: `${newQty.toLocaleString('id-ID')} ${p.unit || 'Pcs'}`,
            total: formatRupiah(newQty * priceNum),
            status: newStatus,
            isCrit
          };
        }
        return p;
      })
    );

    setStockMutations([newMutation, ...stockMutations]);
    setShowMutationModal(false);
    triggerToast(`Surat Jalan Mutasi ${mutationForm.mutationNumber} diterbitkan. Dikirim ke ${mutationForm.destinationPool}.`);
    setMutationForm((prev) => ({
      ...prev,
      mutationNumber: `MUT-2026-${String(stockMutations.length + 84).padStart(4, '0')}`
    }));
  };

  // 5. Simpan Stock Opname
  const handleSaveOpname = (e: React.FormEvent) => {
    e.preventDefault();
    const sysNum = Number(opnameForm.systemStock);
    const actNum = Number(opnameForm.actualStock);
    const diff = actNum - sysNum;

    const newOpname: StockOpnameItem = {
      id: `OPN-${Date.now()}`,
      opnameDate: opnameForm.opnameDate,
      pool: opnameForm.pool,
      rackLocation: opnameForm.rackLocation,
      sku: opnameForm.sku,
      partName: opnameForm.partName,
      systemStock: sysNum,
      actualStock: actNum,
      difference: diff,
      unit: opnameForm.unit,
      discrepancyReason: opnameForm.discrepancyReason,
      actionTaken: opnameForm.actionTaken,
      auditor: opnameForm.auditor,
      notes: opnameForm.notes
    };

    // Jika dipilih sinkronkan sistem ke fisik, update stok sistem
    if (opnameForm.actionTaken === 'Sinkronkan Sistem ke Stok Fisik') {
      setParts((prevParts) =>
        prevParts.map((p) => {
          if (p.sku === opnameForm.sku) {
            const minQty = parseStockNumber(p.min);
            const priceNum = parseInt(p.price.replace(/[^\d]/g, ''), 10) || 0;

            let newStatus = 'Prima';
            let isCrit = false;
            if (actNum <= 0) {
              newStatus = 'Kritis';
              isCrit = true;
            } else if (actNum <= minQty) {
              newStatus = 'Reorder';
              isCrit = true;
            }

            return {
              ...p,
              stock: `${actNum.toLocaleString('id-ID')} ${p.unit || 'Pcs'}`,
              total: formatRupiah(actNum * priceNum),
              status: newStatus,
              isCrit
            };
          }
          return p;
        })
      );
    }

    setStockOpnames([newOpname, ...stockOpnames]);
    setShowOpnameModal(false);
    triggerToast(`Hasil audit stock opname untuk SKU ${opnameForm.sku} tersimpan (Selisih: ${diff >= 0 ? `+${diff}` : diff} ${opnameForm.unit}).`);
  };

  // ================= Kalkulasi Metrik KPI =================
  const metrics = useMemo(() => {
    const totalSKU = parts.length;
    const amanCount = parts.filter((p) => p.status === 'Prima' || p.status === 'Aman').length;
    const reorderCount = parts.filter((p) => p.status === 'Reorder').length;
    const critCount = parts.filter((p) => p.status === 'Kritis').length;

    const totalValuation = parts.reduce((acc, p) => {
      const cleanVal = parseInt(p.total.replace(/[^\d]/g, ''), 10) || 0;
      return acc + cleanVal;
    }, 0);

    return { totalSKU, amanCount, reorderCount, critCount, totalValuation };
  }, [parts]);

  // Filter Parts Table
  const filteredParts = useMemo(() => {
    return parts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.rack.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        filterCategory === 'all'
          ? true
          : filterCategory === 'crit'
          ? p.isCrit
          : p.status === 'Reorder';

      const matchesSubsystem =
        selectedSubsystem === 'all' || p.category === selectedSubsystem;

      return matchesSearch && matchesCategory && matchesSubsystem;
    });
  }, [parts, searchQuery, filterCategory, selectedSubsystem]);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Utama & Tombol Aksi Transaksi */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-primary mb-1">
            <span>Modul 05 • Gudang Suku Cadang & Logistik</span>
            <span className="text-emerald-600 font-semibold">• Sinkronisasi SPK Bengkel Aktif</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Gudang Suku Cadang & Logistik Armada Bus</h1>
          <p className="text-xs text-on-surface-variant">
            Penerimaan PO vendor, bon pengeluaran mekanik SPK, transfer buffer stock antar-pool, dan audit fisik opname.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Stock Opname */}
          <button
            onClick={() => {
              handleSelectPartOpname(parts[0]?.sku || '');
              setShowOpnameModal(true);
            }}
            className="px-3.5 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
            Stock Opname
          </button>

          {/* Tombol Kirim Mutasi */}
          <button
            onClick={() => {
              if (parts[0]) {
                setMutationForm({
                  ...mutationForm,
                  sku: parts[0].sku,
                  partName: parts[0].name,
                  unit: parts[0].unit || 'Pcs'
                });
              }
              setShowMutationModal(true);
            }}
            className="px-3.5 py-2 bg-secondary-container text-on-secondary-container text-xs font-semibold rounded-lg hover:bg-secondary-fixed transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
            Kirim Mutasi Antar-Pool
          </button>

          {/* Tombol Tambah SKU Baru */}
          <button
            onClick={() => setShowNewSKUModal(true)}
            className="px-3.5 py-2 bg-surface-container-high text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            + SKU Baru
          </button>

          {/* Tombol Penerimaan Barang (PO Baru) */}
          <button
            onClick={() => {
              handleSelectPartReceipt(parts[0]?.sku || '');
              setShowReceiptModal(true);
            }}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            + Penerimaan Barang (PO)
          </button>
        </div>
      </div>

      {/* Metrik Ringkasan Gudang (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3.5">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Total SKU Master</span>
            <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-1">{metrics.totalSKU} SKU</div>
          <span className="text-[11px] text-on-surface-variant">Gudang Pulogebang</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Stok Aman / Prima</span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.amanCount} SKU</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {((metrics.amanCount / Math.max(1, metrics.totalSKU)) * 100).toFixed(1)}% Optimal
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Mendekati ROP (Min)</span>
            <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{metrics.reorderCount} SKU</div>
          <span className="text-[11px] text-amber-600 font-semibold">Perlu Reorder PO</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Stok Kritis / Habis</span>
            <span className="material-symbols-outlined text-error text-[20px]">error</span>
          </div>
          <div className="text-2xl font-bold text-error mt-1">{metrics.critCount} SKU</div>
          <span className="text-[11px] text-error font-semibold">Prioritas Pengadaan</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Valuasi Stok Total</span>
            <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
          </div>
          <div className="text-lg font-bold text-primary mt-1 truncate">{formatRupiah(metrics.totalValuation)}</div>
          <span className="text-[11px] text-on-surface-variant">Aset Logistik Aktif</span>
        </div>
      </div>

      {/* Navigasi Sub-Tab Logistik */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'katalog'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
          Katalog Suku Cadang & Stok ({parts.length})
        </button>

        <button
          onClick={() => setActiveTab('receipt')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'receipt'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">input</span>
          Riwayat Penerimaan PO ({goodsReceipts.length})
        </button>

        <button
          onClick={() => setActiveTab('issue')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'issue'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">output</span>
          Bon Pengeluaran SPK ({goodsIssues.length})
        </button>

        <button
          onClick={() => setActiveTab('mutation')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'mutation'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          Mutasi Antar-Pool ({stockMutations.length})
        </button>

        <button
          onClick={() => setActiveTab('opname')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'opname'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">fact_check</span>
          Audit Stock Opname ({stockOpnames.length})
        </button>
      </div>

      {/* ================= TAB 1: KATALOG SUKU CADANG & STOK ================= */}
      {activeTab === 'katalog' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {/* Bar Filter & Pencarian */}
          <div className="p-4 bg-surface-container-low flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-surface-container">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor SKU, nama suku cadang, rak, atau merk..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Kategori Sub-sistem */}
              <select
                value={selectedSubsystem}
                onChange={(e) => setSelectedSubsystem(e.target.value)}
                className="p-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Kategori</option>
                <option value="Pelumasan & Filter">Pelumasan & Filter</option>
                <option value="Pengereman & Pneumatik">Pengereman & Pneumatik</option>
                <option value="Suspensi & Kaki-Kaki">Suspensi & Kaki-Kaki</option>
                <option value="Mesin, Radiator & Bahan Bakar">Mesin & Bahan Bakar</option>
              </select>

              {/* Filter Level Stok */}
              <div className="flex bg-surface-container p-0.5 rounded-lg">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterCategory === 'all' ? 'bg-primary text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterCategory('reorder')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterCategory === 'reorder' ? 'bg-primary text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Reorder ({metrics.reorderCount})
                </button>
                <button
                  onClick={() => setFilterCategory('crit')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    filterCategory === 'crit' ? 'bg-error text-white shadow-xs' : 'text-on-surface'
                  }`}
                >
                  Kritis ({metrics.critCount})
                </button>
              </div>
            </div>
          </div>

          {/* Datatable Katalog */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                  <th className="py-3 px-4">Part & Nomor SKU</th>
                  <th className="py-3 px-4">Kategori & Brand</th>
                  <th className="py-3 px-4">Lokasi Rak</th>
                  <th className="py-3 px-4 text-center">Stok Fisik</th>
                  <th className="py-3 px-4 text-right">Harga Satuan</th>
                  <th className="py-3 px-4 text-right">Total Nilai</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredParts.map((p) => (
                  <tr
                    key={p.sku}
                    className={`hover:bg-surface-container-low/50 transition-colors ${
                      p.status === 'Kritis' ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface block text-sm">{p.name}</span>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-outline mt-0.5">
                        <span className="font-bold text-primary">{p.sku}</span>
                        {p.chassis && <span>• {p.chassis}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-on-surface block font-medium">{p.category || 'Komponen Umum'}</span>
                      <span className="text-[11px] text-on-surface-variant">{p.brand || 'Genuine'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-primary">
                      <span className="px-2 py-0.5 bg-surface-container rounded border border-outline-variant/30">
                        {p.rack}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold text-sm ${
                          p.status === 'Kritis'
                            ? 'text-error'
                            : p.status === 'Reorder'
                            ? 'text-amber-600'
                            : 'text-on-surface'
                        }`}
                      >
                        {p.stock}
                      </span>
                      <span
                        className={`block text-[10px] ${
                          p.status === 'Kritis' ? 'text-error font-bold' : 'text-on-surface-variant'
                        }`}
                      >
                        Min: {p.min}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-on-surface">{p.price}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-on-surface">{p.total}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          p.status === 'Kritis'
                            ? 'bg-red-100 text-error border border-red-200'
                            : p.status === 'Reorder'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenIssueForSpecificPart(p)}
                          title="Keluarkan suku cadang ke SPK mekanik"
                          className="px-2.5 py-1 bg-surface-container hover:bg-primary hover:text-white rounded font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">output</span>
                          Keluar SPK
                        </button>
                        <button
                          onClick={() => handleOpenReceiptForSpecificPart(p)}
                          title="Catat penerimaan PO baru untuk part ini"
                          className="p-1 bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container rounded font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredParts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] text-outline mb-1 block">inventory_2</span>
                      Tidak ada suku cadang yang cocok dengan kriteria pencarian / filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RIWAYAT PENERIMAAN BARANG (PO) ================= */}
      {activeTab === 'receipt' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-4 bg-surface-container-low flex justify-between items-center border-b border-surface-container">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Log Penerimaan Suku Cadang (Goods Receipt - PO)</h3>
              <p className="text-xs text-on-surface-variant">Catatan penerimaan fisik barang masuk dari vendor dan pemasok resmi.</p>
            </div>
            <button
              onClick={() => {
                handleSelectPartReceipt(parts[0]?.sku || '');
                setShowReceiptModal(true);
              }}
              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              + Terima PO Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                  <th className="py-3 px-4">No. Dokumen & PO</th>
                  <th className="py-3 px-4">Tanggal & Vendor</th>
                  <th className="py-3 px-4">Item Suku Cadang</th>
                  <th className="py-3 px-4 text-center">Jumlah</th>
                  <th className="py-3 px-4 text-right">Total Nilai</th>
                  <th className="py-3 px-4">Lokasi Rak</th>
                  <th className="py-3 px-4">Kondisi & Penerima</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {goodsReceipts.map((gr) => (
                  <tr key={gr.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-primary font-mono block">{gr.grNumber}</span>
                      <span className="text-[11px] text-on-surface-variant font-mono">PO: {gr.poNumber}</span>
                      <span className="text-[10px] text-outline block">DO: {gr.deliveryOrderNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface block">{gr.vendor}</span>
                      <span className="text-[11px] text-on-surface-variant font-mono">{gr.date}</span>
                      <span className="text-[10px] text-outline block">{gr.targetPool}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface block">{gr.partName}</span>
                      <span className="font-mono text-primary text-[11px]">{gr.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        +{gr.quantity} {gr.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-on-surface">
                      {formatRupiah(gr.totalPrice)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-primary">{gr.rackLocation}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 block w-fit mb-0.5">
                        {gr.condition}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">{gr.receivedBy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BON PENGELUARAN (SPK) ================= */}
      {activeTab === 'issue' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-4 bg-surface-container-low flex justify-between items-center border-b border-surface-container">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Log Pengeluaran Suku Cadang (Goods Issue ke SPK)</h3>
              <p className="text-xs text-on-surface-variant">Catatan suku cadang yang diserahkan ke mekanik bengkel untuk perbaikan bus.</p>
            </div>
            <button
              onClick={() => {
                handleSelectPartIssue(parts[0]?.sku || '');
                setShowIssueModal(true);
              }}
              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">output</span>
              + Buat Bon Pengeluaran
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                  <th className="py-3 px-4">No. Bon & Waktu</th>
                  <th className="py-3 px-4">Rujukan SPK & Armada</th>
                  <th className="py-3 px-4">Suku Cadang Dikeluarkan</th>
                  <th className="py-3 px-4 text-center">Jumlah</th>
                  <th className="py-3 px-4">Keperluan Servis</th>
                  <th className="py-3 px-4">Mekanik & Otorisasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {goodsIssues.map((gi) => (
                  <tr key={gi.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-primary font-mono block">{gi.giNumber}</span>
                      <span className="text-[11px] text-on-surface-variant font-mono">{gi.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface block">{gi.spkNumber}</span>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-surface-container text-primary">
                        Armada: {gi.busId}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface block">{gi.partName}</span>
                      <span className="font-mono text-primary text-[11px]">{gi.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-error bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                        -{gi.quantity} {gi.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-on-surface block">{gi.purpose}</span>
                      <span className="text-[10px] text-outline block">{gi.oldPartStatus}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface block">Mekanik: {gi.requestedBy}</span>
                      <span className="text-[11px] text-on-surface-variant">Foreman: {gi.approvedBy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: MUTASI ANTAR-POOL ================= */}
      {activeTab === 'mutation' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-4 bg-surface-container-low flex justify-between items-center border-b border-surface-container">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Log Mutasi & Transfer Stok Antar-Pool</h3>
              <p className="text-xs text-on-surface-variant">Distribusi suku cadang antar pool pusat dan depo satelit untuk pemerataan buffer stock.</p>
            </div>
            <button
              onClick={() => {
                if (parts[0]) {
                  setMutationForm({
                    ...mutationForm,
                    sku: parts[0].sku,
                    partName: parts[0].name,
                    unit: parts[0].unit || 'Pcs'
                  });
                }
                setShowMutationModal(true);
              }}
              className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold hover:bg-secondary-fixed flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              + Kirim Mutasi Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                  <th className="py-3 px-4">No. Surat Jalan</th>
                  <th className="py-3 px-4">Rute Pengiriman Antar-Pool</th>
                  <th className="py-3 px-4">Item & Jumlah Dimutasi</th>
                  <th className="py-3 px-4">Armada Pengantar</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Petugas Pengirim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {stockMutations.map((mut) => (
                  <tr key={mut.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-primary block">{mut.mutationNumber}</span>
                      <span className="text-[11px] text-on-surface-variant">{mut.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-on-surface">{mut.originPool}</span>
                        <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                        <span className="font-bold text-primary">{mut.destinationPool}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface block">{mut.partName}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-primary text-[11px]">{mut.sku}</span>
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                          {mut.quantity} {mut.unit}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface">{mut.transportBy}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          mut.status === 'Tiba & Diterima'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-primary'
                        }`}
                      >
                        {mut.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      <span className="block font-medium text-on-surface">{mut.sentBy}</span>
                      {mut.notes && <span className="text-[10px] text-outline block">{mut.notes}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: AUDIT STOCK OPNAME ================= */}
      {activeTab === 'opname' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-4 bg-surface-container-low flex justify-between items-center border-b border-surface-container">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Hasil Audit Stock Opname & Penyesuaian Fisik</h3>
              <p className="text-xs text-on-surface-variant">Rekap pencocokan stok sistem vs stok fisik rak gudang dan berita acara investigasi.</p>
            </div>
            <button
              onClick={() => {
                handleSelectPartOpname(parts[0]?.sku || '');
                setShowOpnameModal(true);
              }}
              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">fact_check</span>
              + Audit Opname Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase font-semibold">
                  <th className="py-3 px-4">Tanggal & Lokasi</th>
                  <th className="py-3 px-4">SKU & Suku Cadang</th>
                  <th className="py-3 px-4 text-center">Stok Sistem</th>
                  <th className="py-3 px-4 text-center">Stok Fisik Aktual</th>
                  <th className="py-3 px-4 text-center">Selisih (Varian)</th>
                  <th className="py-3 px-4">Penyebab & Tindakan</th>
                  <th className="py-3 px-4">Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {stockOpnames.map((opn) => (
                  <tr key={opn.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface font-mono block">{opn.opnameDate}</span>
                      <span className="text-[11px] text-on-surface-variant block">{opn.pool}</span>
                      <span className="font-mono text-[11px] text-primary">{opn.rackLocation}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-on-surface block">{opn.partName}</span>
                      <span className="font-mono text-primary text-[11px]">{opn.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-on-surface">
                      {opn.systemStock} {opn.unit}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-primary">
                      {opn.actualStock} {opn.unit}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
                          opn.difference === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : opn.difference > 0
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-error'
                        }`}
                      >
                        {opn.difference > 0 ? `+${opn.difference}` : opn.difference} {opn.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-on-surface block">{opn.discrepancyReason}</span>
                      <span className="text-[11px] text-on-surface-variant block">{opn.actionTaken}</span>
                      {opn.notes && <span className="text-[10px] text-outline block">{opn.notes}</span>}
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant font-medium">{opn.auditor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MODAL PENERIMAAN BARANG MASUK (PO / GOODS RECEIPT)                      */}
      {/* ========================================================================= */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">add_circle</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Penerimaan Suku Cadang (Goods Receipt PO)</h3>
                  <p className="text-xs text-on-surface-variant">Catat barang masuk dari vendor dan tambahkan ke stok fisik rak gudang.</p>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="receipt-form" onSubmit={handleSaveReceipt} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">No. Penerimaan (GR)</label>
                  <input
                    disabled
                    value={receiptForm.grNumber}
                    className="w-full p-2.5 bg-surface-container text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">No. Referensi PO *</label>
                  <input
                    required
                    value={receiptForm.poNumber}
                    onChange={(e) => setReceiptForm({ ...receiptForm, poNumber: e.target.value })}
                    placeholder="Contoh: PO-2026-0815"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">No. Surat Jalan Vendor *</label>
                  <input
                    required
                    value={receiptForm.deliveryOrderNumber}
                    onChange={(e) => setReceiptForm({ ...receiptForm, deliveryOrderNumber: e.target.value })}
                    placeholder="Contoh: SJ/VND/IX/2026/088"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Vendor / Pemasok *</label>
                  <select
                    value={receiptForm.vendor}
                    onChange={(e) => setReceiptForm({ ...receiptForm, vendor: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="PT United Tractors Tbk (Scania)">PT United Tractors Tbk (Scania)</option>
                    <option value="PT Bintang Berlian Motor (Mitsubishi Fuso)">PT Bintang Berlian Motor</option>
                    <option value="Wabco Brake Systems Indo">Wabco Brake Systems Indo</option>
                    <option value="PT Denso Sales Indonesia">PT Denso Sales Indonesia</option>
                    <option value="PT Gajah Tunggal Tbk (Ban/Karet)">PT Gajah Tunggal Tbk</option>
                    <option value="Toko Onderdil Berkah Diesel">Toko Onderdil Berkah Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Gudang / Pool Tujuan</label>
                  <select
                    value={receiptForm.targetPool}
                    onChange={(e) => setReceiptForm({ ...receiptForm, targetPool: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="Gudang Utama Pulogebang">Gudang Utama Pulogebang</option>
                    <option value="Gudang Tangerang Poris">Gudang Tangerang Poris</option>
                    <option value="Gudang Depo Ciledug">Gudang Depo Ciledug</option>
                    <option value="Gudang Pool Klari Karawang">Gudang Pool Klari Karawang</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs">Pilih Suku Cadang yang Diterima</span>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Pilih Suku Cadang (Katalog)</label>
                  <select
                    value={receiptForm.sku}
                    onChange={(e) => handleSelectPartReceipt(e.target.value)}
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                  >
                    {parts.map((p) => (
                      <option key={p.sku} value={p.sku}>
                        {p.sku} - {p.name} (Stok Saat Ini: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Jumlah Masuk *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={receiptForm.quantity}
                      onChange={(e) => setReceiptForm({ ...receiptForm, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Satuan</label>
                    <input
                      disabled
                      value={receiptForm.unit}
                      className="w-full p-2.5 bg-surface-container text-on-surface rounded-lg border border-outline-variant/30 text-center font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Harga Beli Satuan (Rp)</label>
                    <input
                      type="number"
                      value={receiptForm.unitPrice}
                      onChange={(e) => setReceiptForm({ ...receiptForm, unitPrice: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Penempatan Rak</label>
                    <input
                      value={receiptForm.rackLocation}
                      onChange={(e) => setReceiptForm({ ...receiptForm, rackLocation: e.target.value })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-surface-container rounded-lg">
                  <span className="font-semibold text-on-surface">Total Nilai Pembelian PO:</span>
                  <span className="text-sm font-bold font-mono text-primary">
                    {formatRupiah(receiptForm.quantity * receiptForm.unitPrice)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Kondisi Fisik Saat Bongkar</label>
                  <select
                    value={receiptForm.condition}
                    onChange={(e) => setReceiptForm({ ...receiptForm, condition: e.target.value as any })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="Baik & Segel Utuh">Baik & Segel Utuh</option>
                    <option value="Kemasan Rusak (Part Baik)">Kemasan Rusak (Part Baik)</option>
                    <option value="Cacat Sebagian / Retur">Cacat Sebagian / Retur</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Petugas Checker Penerima *</label>
                  <input
                    required
                    value={receiptForm.receivedBy}
                    onChange={(e) => setReceiptForm({ ...receiptForm, receivedBy: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Catatan Penerimaan</label>
                <textarea
                  rows={2}
                  value={receiptForm.notes}
                  onChange={(e) => setReceiptForm({ ...receiptForm, notes: e.target.value })}
                  placeholder="Catatan nomor batch pabrikan, kondisi kemasan, nomor segel, dll..."
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="receipt-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan & Tambah ke Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL REGISTRASI SKU BARU (KATALOG MASTER)                              */}
      {/* ========================================================================= */}
      {showNewSKUModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">add_box</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Registrasi SKU Suku Cadang Baru</h3>
                  <p className="text-xs text-on-surface-variant">Tambahkan komponen atau suku cadang baru ke katalog logistik master.</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewSKUModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="new-sku-form" onSubmit={handleSaveNewSKU} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Kode Part / SKU *</label>
                  <input
                    required
                    value={newSKUForm.sku}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, sku: e.target.value.toUpperCase() })}
                    placeholder="Contoh: FLT-HIN-019"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold block mb-1 text-on-surface">Nama Suku Cadang Lengkap *</label>
                  <input
                    required
                    value={newSKUForm.name}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, name: e.target.value })}
                    placeholder="Contoh: Filter Udara Sekunder Hino RM280"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Kategori Sub-sistem *</label>
                  <select
                    value={newSKUForm.category}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, category: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="Pelumasan & Filter">Pelumasan & Filter</option>
                    <option value="Pengereman & Pneumatik">Pengereman & Pneumatik</option>
                    <option value="Suspensi & Kaki-Kaki">Suspensi & Kaki-Kaki</option>
                    <option value="Mesin, Radiator & Bahan Bakar">Mesin, Radiator & Bahan Bakar</option>
                    <option value="Transmisi, Kopling & Gardan">Transmisi & Kopling</option>
                    <option value="Kelistrikan, Sensor & AC Kabin">Kelistrikan & AC</option>
                    <option value="Bodi, Kaca & Interior">Bodi & Interior</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Kompatibilitas Sasis</label>
                  <select
                    value={newSKUForm.chassis}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, chassis: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="Mercedes-Benz OH 1626">Mercedes-Benz OH 1626</option>
                    <option value="Scania K410IB">Scania K410IB</option>
                    <option value="Hino RM280">Hino RM280</option>
                    <option value="Volvo B11R 430HP">Volvo B11R 430HP</option>
                    <option value="Universal (Semua Sasis)">Universal (Semua Sasis)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Merk / Pabrikan Part *</label>
                  <input
                    required
                    value={newSKUForm.brand}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, brand: e.target.value })}
                    placeholder="Contoh: Mann Filter / Wabco / Bendix"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Satuan Barang *</label>
                  <select
                    value={newSKUForm.unit}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, unit: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="Pcs">Pcs (Satuan)</option>
                    <option value="Set">Set (Paket)</option>
                    <option value="Liter">Liter (Cairan/Oli)</option>
                    <option value="Unit">Unit</option>
                    <option value="Meter">Meter</option>
                    <option value="Pasang">Pasang (Pair)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Lokasi Rak Gudang *</label>
                  <input
                    required
                    value={newSKUForm.rack}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, rack: e.target.value.toUpperCase() })}
                    placeholder="Contoh: RAK-B2-08"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Stok Awal Fisik *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newSKUForm.stock}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-bold text-center"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Batas ROP (Min) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newSKUForm.min}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, min: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-bold text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Estimasi Harga Beli Satuan (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newSKUForm.price}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, price: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono text-right font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Lead Time Pengadaan Vendor</label>
                  <input
                    value={newSKUForm.leadTime}
                    onChange={(e) => setNewSKUForm({ ...newSKUForm, leadTime: e.target.value })}
                    placeholder="Contoh: 3 Hari / Inden 14 Hari"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Spesifikasi Teknis / Keterangan</label>
                <textarea
                  rows={2}
                  value={newSKUForm.notes}
                  onChange={(e) => setNewSKUForm({ ...newSKUForm, notes: e.target.value })}
                  placeholder="Deskripsi ukuran diameter, OEM part number, interval penggantian KM..."
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNewSKUModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="new-sku-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Daftarkan ke Master
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL BON PENGELUARAN BARANG (GOODS ISSUE KE SPK)                       */}
      {/* ========================================================================= */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">output</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Bon Pengeluaran Suku Cadang (Goods Issue)</h3>
                  <p className="text-xs text-on-surface-variant">Serahkan suku cadang ke mekanik dan potong stok gudang untuk SPK aktif.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="issue-form" onSubmit={handleSaveIssue} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">No. Bon Pengeluaran (GI)</label>
                  <input
                    disabled
                    value={issueForm.giNumber}
                    className="w-full p-2.5 bg-surface-container text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Rujukan No. SPK *</label>
                  <select
                    value={issueForm.spkNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      const busMatch = val.match(/\((TY-[^)]+)\)/);
                      setIssueForm({
                        ...issueForm,
                        spkNumber: val,
                        busId: busMatch ? busMatch[1] : 'TY-082'
                      });
                    }}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                  >
                    <option value="SPK-2026-001 (TY-082)">SPK-2026-001 (TY-082 - Rem Aus)</option>
                    <option value="SPK-2026-002 (TY-104)">SPK-2026-002 (TY-104 - PM 40K)</option>
                    <option value="SPK-2026-003 (TY-015)">SPK-2026-003 (TY-015 - Balon Bocor)</option>
                    <option value="SPK-2026-004 (TY-001)">SPK-2026-004 (TY-001 - Overhaul Air Dryer)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Armada Bus</label>
                  <input
                    disabled
                    value={issueForm.busId}
                    className="w-full p-2.5 bg-surface-container text-primary rounded-lg border border-outline-variant/30 font-bold"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary block text-xs">Pilih Suku Cadang yang Dikeluarkan</span>
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    Stok Tersedia: <strong className="text-emerald-700">{issueForm.availableStock} {issueForm.unit}</strong>
                  </span>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Pilih Suku Cadang</label>
                  <select
                    value={issueForm.sku}
                    onChange={(e) => handleSelectPartIssue(e.target.value)}
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                  >
                    {parts.map((p) => (
                      <option key={p.sku} value={p.sku}>
                        {p.sku} - {p.name} (Sisa: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Jumlah yang Dikeluarkan (Qty) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={issueForm.availableStock}
                      value={issueForm.quantity}
                      onChange={(e) => setIssueForm({ ...issueForm, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Satuan</label>
                    <input
                      disabled
                      value={issueForm.unit}
                      className="w-full p-2.5 bg-surface-container text-on-surface rounded-lg border border-outline-variant/30 font-semibold text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Nama Mekanik Pengambil *</label>
                  <input
                    required
                    value={issueForm.requestedBy}
                    onChange={(e) => setIssueForm({ ...issueForm, requestedBy: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Foreman yang Menyetujui *</label>
                  <input
                    required
                    value={issueForm.approvedBy}
                    onChange={(e) => setIssueForm({ ...issueForm, approvedBy: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Keperluan & Uraian Pekerjaan *</label>
                <input
                  required
                  value={issueForm.purpose}
                  onChange={(e) => setIssueForm({ ...issueForm, purpose: e.target.value })}
                  placeholder="Contoh: Penggantian kanvas rem depan kiri (Ramp check temuan)"
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Status Part Bekas / Lama</label>
                <input
                  value={issueForm.oldPartStatus}
                  onChange={(e) => setIssueForm({ ...issueForm, oldPartStatus: e.target.value })}
                  placeholder="Contoh: Part bekas aus ditarik ke drum limbah scrap gudang"
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="issue-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Validasi & Potong Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL KIRIM MUTASI ANTAR-POOL                                          */}
      {/* ========================================================================= */}
      {showMutationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Surat Jalan Mutasi Stok Antar-Pool</h3>
                  <p className="text-xs text-on-surface-variant">Transfer buffer stock suku cadang antar pool pusat dan depo satelit.</p>
                </div>
              </div>
              <button
                onClick={() => setShowMutationModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="mutation-form" onSubmit={handleSaveMutation} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">No. Surat Jalan Mutasi</label>
                  <input
                    disabled
                    value={mutationForm.mutationNumber}
                    className="w-full p-2.5 bg-surface-container text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Waktu Pengiriman</label>
                  <input
                    type="text"
                    value={mutationForm.date}
                    onChange={(e) => setMutationForm({ ...mutationForm, date: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Pool Asal (Pengirim) *</label>
                  <select
                    value={mutationForm.originPool}
                    onChange={(e) => setMutationForm({ ...mutationForm, originPool: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                  >
                    <option value="Gudang Utama Pulogebang">Gudang Utama Pulogebang</option>
                    <option value="Gudang Tangerang Poris">Gudang Tangerang Poris</option>
                    <option value="Gudang Depo Ciledug">Gudang Depo Ciledug</option>
                    <option value="Gudang Pool Klari Karawang">Gudang Pool Klari Karawang</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Pool Tujuan (Penerima) *</label>
                  <select
                    value={mutationForm.destinationPool}
                    onChange={(e) => setMutationForm({ ...mutationForm, destinationPool: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-semibold"
                  >
                    <option value="Gudang Tangerang Poris">Gudang Tangerang Poris</option>
                    <option value="Gudang Depo Ciledug">Gudang Depo Ciledug</option>
                    <option value="Gudang Pool Klari Karawang">Gudang Pool Klari Karawang</option>
                    <option value="Gudang Utama Pulogebang">Gudang Utama Pulogebang</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/30 space-y-3">
                <span className="font-bold text-primary block text-xs">Pilih Suku Cadang yang Dimutasi</span>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Item Suku Cadang</label>
                  <select
                    value={mutationForm.sku}
                    onChange={(e) => {
                      const found = parts.find((p) => p.sku === e.target.value);
                      if (found) {
                        setMutationForm({
                          ...mutationForm,
                          sku: found.sku,
                          partName: found.name,
                          unit: found.unit || 'Pcs'
                        });
                      }
                    }}
                    className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                  >
                    {parts.map((p) => (
                      <option key={p.sku} value={p.sku}>
                        {p.sku} - {p.name} (Tersedia: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Jumlah yang Dimutasi *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={mutationForm.quantity}
                      onChange={(e) => setMutationForm({ ...mutationForm, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full p-2.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/30 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Satuan</label>
                    <input
                      disabled
                      value={mutationForm.unit}
                      className="w-full p-2.5 bg-surface-container text-on-surface rounded-lg border border-outline-variant/30 text-center font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Armada / Kurir Pengantar *</label>
                  <input
                    required
                    value={mutationForm.transportBy}
                    onChange={(e) => setMutationForm({ ...mutationForm, transportBy: e.target.value })}
                    placeholder="Contoh: Mobil Logistik B 9112 TAY / Bus Jurusan TY-082"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Petugas Gudang Pengirim *</label>
                  <input
                    required
                    value={mutationForm.sentBy}
                    onChange={(e) => setMutationForm({ ...mutationForm, sentBy: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Catatan & Alasan Mutasi</label>
                <textarea
                  rows={2}
                  value={mutationForm.notes}
                  onChange={(e) => setMutationForm({ ...mutationForm, notes: e.target.value })}
                  placeholder="Kebutuhan darurat unit mogok di pool tujuan, penyeimbangan buffer stok..."
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowMutationModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="mutation-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                Terbitkan Surat Jalan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL STOCK OPNAME & AUDIT FISIK                                       */}
      {/* ========================================================================= */}
      {showOpnameModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">fact_check</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Audit Stock Opname & Penyesuaian Fisik</h3>
                  <p className="text-xs text-on-surface-variant">Cocokkan saldo sistem dengan hitungan fisik riil di rak gudang.</p>
                </div>
              </div>
              <button
                onClick={() => setShowOpnameModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form id="opname-form" onSubmit={handleSaveOpname} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Tanggal Opname *</label>
                  <input
                    type="date"
                    required
                    value={opnameForm.opnameDate}
                    onChange={(e) => setOpnameForm({ ...opnameForm, opnameDate: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Lokasi Gudang Pool</label>
                  <select
                    value={opnameForm.pool}
                    onChange={(e) => setOpnameForm({ ...opnameForm, pool: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="Gudang Utama Pulogebang">Gudang Utama Pulogebang</option>
                    <option value="Gudang Tangerang Poris">Gudang Tangerang Poris</option>
                    <option value="Gudang Depo Ciledug">Gudang Depo Ciledug</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Lokasi Rak Diperiksa</label>
                  <input
                    value={opnameForm.rackLocation}
                    onChange={(e) => setOpnameForm({ ...opnameForm, rackLocation: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-on-surface">Pilih SKU Suku Cadang yang Diperiksa *</label>
                <select
                  value={opnameForm.sku}
                  onChange={(e) => handleSelectPartOpname(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                >
                  {parts.map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.sku} - {p.name} (Stok Sistem: {p.stock}, Rak: {p.rack})
                    </option>
                  ))}
                </select>
              </div>

              {/* Perbandingan Stok Sistem vs Aktual */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <span className="font-bold text-on-surface block mb-3 text-xs">Pencocokan Stok Fisik vs Sistem</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-surface-container rounded-lg text-center">
                    <span className="text-[11px] text-on-surface-variant font-medium block">Stok di Sistem</span>
                    <div className="text-xl font-bold font-mono text-on-surface mt-1">
                      {opnameForm.systemStock} {opnameForm.unit}
                    </div>
                  </div>

                  <div className="p-3 bg-surface-container-lowest rounded-lg border-2 border-primary/40 text-center">
                    <label className="text-[11px] font-bold text-primary block mb-1">Stok Fisik Aktual Terhitung *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={opnameForm.actualStock}
                      onChange={(e) => setOpnameForm({ ...opnameForm, actualStock: parseInt(e.target.value, 10) || 0 })}
                      className="w-full text-center text-xl font-bold font-mono text-primary bg-surface-container-low rounded p-1 border border-outline-variant/30"
                    />
                  </div>

                  <div
                    className={`p-3 rounded-lg text-center ${
                      opnameForm.actualStock - opnameForm.systemStock === 0
                        ? 'bg-emerald-50 text-emerald-800'
                        : opnameForm.actualStock - opnameForm.systemStock > 0
                        ? 'bg-blue-50 text-blue-800'
                        : 'bg-red-50 text-error'
                    }`}
                  >
                    <span className="text-[11px] font-medium block">Selisih (Varian)</span>
                    <div className="text-xl font-bold font-mono mt-1">
                      {opnameForm.actualStock - opnameForm.systemStock > 0
                        ? `+${opnameForm.actualStock - opnameForm.systemStock}`
                        : opnameForm.actualStock - opnameForm.systemStock}{' '}
                      {opnameForm.unit}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Penyebab Selisih *</label>
                  <select
                    value={opnameForm.discrepancyReason}
                    onChange={(e) => setOpnameForm({ ...opnameForm, discrepancyReason: e.target.value as any })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  >
                    <option value="Fisik Cocok (Akurat)">Fisik Cocok (Akurat)</option>
                    <option value="Salah Catat SPK Sebelumnya">Salah Catat SPK Sebelumnya</option>
                    <option value="Kerusakan / Pecah Belum Lapor">Kerusakan / Pecah Belum Lapor</option>
                    <option value="Retur Belum Dicatat">Retur Belum Dicatat</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Tindakan Penyesuaian *</label>
                  <select
                    value={opnameForm.actionTaken}
                    onChange={(e) => setOpnameForm({ ...opnameForm, actionTaken: e.target.value as any })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-medium"
                  >
                    <option value="Sinkronkan Sistem ke Stok Fisik">Sinkronkan Sistem ke Stok Fisik</option>
                    <option value="Investigasi Lanjutan Gudang">Investigasi Lanjutan Gudang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Auditor / Verifikator Gudang *</label>
                  <input
                    required
                    value={opnameForm.auditor}
                    onChange={(e) => setOpnameForm({ ...opnameForm, auditor: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Nomor Berita Acara / Catatan</label>
                  <input
                    value={opnameForm.notes}
                    onChange={(e) => setOpnameForm({ ...opnameForm, notes: e.target.value })}
                    placeholder="Contoh: BA-OPN/2026/09/014"
                    className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowOpnameModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="opname-form"
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan Hasil Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
