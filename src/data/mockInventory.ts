import { PartItem, GoodsReceiptItem, GoodsIssueItem, StockMutationItem, StockOpnameItem } from '../types';

export const mockParts: PartItem[] = [
  {
    sku: "FLT-SCN-092",
    name: "Filter Oli Mesin Scania 15W40",
    rack: "RAK-A3-04",
    stock: "3 Pcs",
    min: "12 Pcs",
    price: "Rp 485.000",
    total: "Rp 1.455.000",
    status: "Kritis",
    isCrit: true,
    category: "Pelumasan & Filter",
    chassis: "Scania K410IB",
    brand: "Mann Filter / Scania Genuine",
    unit: "Pcs",
    leadTime: "3 Hari"
  },
  {
    sku: "ADR-WBC-011",
    name: "Air Dryer Cartridge Pneumatic",
    rack: "RAK-B2-01",
    stock: "18 Pcs",
    min: "6 Pcs",
    price: "Rp 890.000",
    total: "Rp 16.020.000",
    status: "Prima",
    isCrit: false,
    category: "Pengereman & Pneumatik",
    chassis: "Universal (Semua Sasis)",
    brand: "Wabco Brake Tech",
    unit: "Pcs",
    leadTime: "2 Hari"
  },
  {
    sku: "OIL-DLV-1540",
    name: "Oli Delvac MX 15W-40 (Drum)",
    rack: "ZONE-OIL-01",
    stock: "1.240 L",
    min: "400 L",
    price: "Rp 46.500/L",
    total: "Rp 57.660.000",
    status: "Prima",
    isCrit: false,
    category: "Pelumasan & Filter",
    chassis: "Universal (Semua Sasis)",
    brand: "Mobil Delvac",
    unit: "Liter",
    leadTime: "1 Hari"
  },
  {
    sku: "SUS-CNT-941",
    name: "Balon Air Suspension Bellow 941 MB",
    rack: "RAK-C1-09",
    stock: "9 Pcs",
    min: "8 Pcs",
    price: "Rp 1.750.000",
    total: "Rp 15.750.000",
    status: "Reorder",
    isCrit: true,
    category: "Suspensi & Kaki-Kaki",
    chassis: "Mercedes-Benz OH 1626",
    brand: "Continental ContiTech",
    unit: "Pcs",
    leadTime: "5 Hari"
  },
  {
    sku: "BRK-TX-504",
    name: "Kampas Rem Tromol Heavy Duty",
    rack: "RAK-D4-02",
    stock: "14 Set",
    min: "5 Set",
    price: "Rp 1.150.000",
    total: "Rp 16.100.000",
    status: "Aman",
    isCrit: false,
    category: "Pengereman & Pneumatik",
    chassis: "Hino RM280",
    brand: "Bendix Heavy Commercial",
    unit: "Set",
    leadTime: "2 Hari"
  },
  {
    sku: "FLT-RCR-1000",
    name: "Filter Solar Separator Racor 1000FH",
    rack: "RAK-A1-12",
    stock: "32 Pcs",
    min: "10 Pcs",
    price: "Rp 320.000",
    total: "Rp 10.240.000",
    status: "Prima",
    isCrit: false,
    category: "Pelumasan & Filter",
    chassis: "Universal (Semua Sasis)",
    brand: "Parker Racor",
    unit: "Pcs",
    leadTime: "2 Hari"
  },
  {
    sku: "BELT-GTS-088",
    name: "Fan Belt V-Ribbed Alternator & Fan",
    rack: "RAK-B1-05",
    stock: "8 Pcs",
    min: "4 Pcs",
    price: "Rp 275.000",
    total: "Rp 2.200.000",
    status: "Aman",
    isCrit: false,
    category: "Mesin, Radiator & Bahan Bakar",
    chassis: "Mercedes-Benz OH 1626",
    brand: "Gates Heavy Duty",
    unit: "Pcs",
    leadTime: "2 Hari"
  }
];

export const mockGoodsReceipts: GoodsReceiptItem[] = [
  {
    id: "GR-001",
    grNumber: "GR-2026-0041",
    poNumber: "PO-2026-0810",
    deliveryOrderNumber: "DO/SCA/2026/099",
    vendor: "PT United Tractors Tbk (Scania)",
    date: "2026-09-18 10:30",
    targetPool: "Gudang Utama Pulogebang",
    sku: "FLT-SCN-092",
    partName: "Filter Oli Mesin Scania 15W40",
    quantity: 15,
    unit: "Pcs",
    unitPrice: 485000,
    totalPrice: 7275000,
    rackLocation: "RAK-A3-04",
    condition: "Baik & Segel Utuh",
    receivedBy: "Bagus Prasetyo (Checker)",
    notes: "Pengiriman PO rutin termin September, barcode sesuai manifes."
  },
  {
    id: "GR-002",
    grNumber: "GR-2026-0042",
    poNumber: "PO-2026-0814",
    deliveryOrderNumber: "SJ-WBC-8819",
    vendor: "Wabco Brake Systems Indo",
    date: "2026-09-17 14:15",
    targetPool: "Gudang Utama Pulogebang",
    sku: "ADR-WBC-011",
    partName: "Air Dryer Cartridge Pneumatic",
    quantity: 20,
    unit: "Pcs",
    unitPrice: 890000,
    totalPrice: 17800000,
    rackLocation: "RAK-B2-01",
    condition: "Baik & Segel Utuh",
    receivedBy: "Bagus Prasetyo (Checker)",
    notes: "Segel hologram pabrikan terverifikasi."
  }
];

export const mockGoodsIssues: GoodsIssueItem[] = [
  {
    id: "GI-001",
    giNumber: "GI-2026-0128",
    spkNumber: "SPK-2026-001",
    busId: "TY-082",
    date: "2026-09-18 13:45",
    sku: "BRK-TX-504",
    partName: "Kampas Rem Tromol Heavy Duty",
    quantity: 2,
    unit: "Set",
    requestedBy: "Hendra Saputra",
    approvedBy: "Bambang Sugianto (Foreman)",
    purpose: "Penggantian kampas rem roda depan kiri (Temuan Ramp Check Pre-Trip)",
    oldPartStatus: "Kampas aus 1.8mm ditarik ke keranjang scrap gudang"
  },
  {
    id: "GI-002",
    giNumber: "GI-2026-0129",
    spkNumber: "SPK-2026-002",
    busId: "TY-104",
    date: "2026-09-18 15:20",
    sku: "FLT-RCR-1000",
    partName: "Filter Solar Separator Racor 1000FH",
    quantity: 1,
    unit: "Pcs",
    requestedBy: "Ahmad Zaelani",
    approvedBy: "Bambang Sugianto (Foreman)",
    purpose: "PM 40K Servis Berkala filter bahan bakar",
    oldPartStatus: "Filter kotor jelaga limbah B3 ditampung drum limbah"
  }
];

export const mockStockMutations: StockMutationItem[] = [
  {
    id: "MUT-001",
    mutationNumber: "MUT-2026-0082",
    date: "2026-09-18 08:30",
    originPool: "Gudang Utama Pulogebang",
    destinationPool: "Gudang Tangerang Poris",
    sku: "SUS-CNT-941",
    partName: "Balon Air Suspension Bellow 941 MB",
    quantity: 4,
    unit: "Pcs",
    transportBy: "Mobil Operasional Logistik B 9112 TAY",
    sentBy: "Bagus Prasetyo (Gudang Pusat)",
    receivedBy: "Danang Setiawan (Gudang Poris)",
    status: "Tiba & Diterima",
    notes: "Distribusi buffer stok darurat armada pariwisata rute Anyer-Merak."
  }
];

export const mockStockOpnames: StockOpnameItem[] = [
  {
    id: "OPN-001",
    opnameDate: "2026-09-15",
    pool: "Gudang Utama Pulogebang",
    rackLocation: "RAK-A3-04",
    sku: "FLT-SCN-092",
    partName: "Filter Oli Mesin Scania 15W40",
    systemStock: 4,
    actualStock: 3,
    difference: -1,
    unit: "Pcs",
    discrepancyReason: "Salah Catat SPK Sebelumnya",
    actionTaken: "Sinkronkan Sistem ke Stok Fisik",
    auditor: "Suryanto (Internal Auditor)",
    notes: "1 unit terpakai di SPK-2026-090 belum tersubmit oleh asisten mekanik."
  }
];


