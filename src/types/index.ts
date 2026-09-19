export interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export interface BusAsset {
  id: string;
  plate: string;
  year: string;
  color: string;
  chassis: string;
  vin: string;
  engine: string;
  body: string;
  type: string;
  layout: string;
  odo: string;
  pool: string;
  status: 'Ready' | 'On-Trip' | 'Standby' | 'Under Maintenance';
  statusClass: string;
}

export interface WheelItem {
  name: string;
  serial: string;
  odo: string;
  tread: string;
  status: string;
  badge: string;
  color: string;
  psi: string;
}

export interface BatteryItem {
  title: string;
  voltage: string;
  model: string;
  serial: string;
  cca: string;
  detail?: string;
}

export interface PartItem {
  sku: string;
  name: string;
  rack: string;
  stock: string;
  min: string;
  price: string;
  total: string;
  status: string;
  isCrit: boolean;
  category?: string;
  chassis?: string;
  brand?: string;
  unit?: string;
  leadTime?: string;
}

export interface GoodsReceiptItem {
  id: string;
  grNumber: string;
  poNumber: string;
  deliveryOrderNumber: string;
  vendor: string;
  date: string;
  targetPool: string;
  sku: string;
  partName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  rackLocation: string;
  condition: 'Baik & Segel Utuh' | 'Kemasan Rusak (Part Baik)' | 'Cacat Sebagian / Retur';
  receivedBy: string;
  notes?: string;
}

export interface GoodsIssueItem {
  id: string;
  giNumber: string;
  spkNumber: string;
  busId: string;
  date: string;
  sku: string;
  partName: string;
  quantity: number;
  unit: string;
  requestedBy: string;
  approvedBy: string;
  purpose: string;
  oldPartStatus: string;
}

export interface StockMutationItem {
  id: string;
  mutationNumber: string;
  date: string;
  originPool: string;
  destinationPool: string;
  sku: string;
  partName: string;
  quantity: number;
  unit: string;
  transportBy: string;
  sentBy: string;
  receivedBy?: string;
  status: 'Dalam Pengiriman' | 'Tiba & Diterima' | 'Batal';
  notes?: string;
}

export interface StockOpnameItem {
  id: string;
  opnameDate: string;
  pool: string;
  rackLocation: string;
  sku: string;
  partName: string;
  systemStock: number;
  actualStock: number;
  difference: number;
  unit: string;
  discrepancyReason: 'Fisik Cocok (Akurat)' | 'Kerusakan / Pecah Belum Lapor' | 'Salah Catat SPK Sebelumnya' | 'Retur Belum Dicatat';
  actionTaken: 'Sinkronkan Sistem ke Stok Fisik' | 'Investigasi Lanjutan Gudang';
  auditor: string;
  notes?: string;
}

export interface LegalItem {
  id: string;
  plate: string;
  route: string;
  kir: string;
  kps: string;
  stnk: string;
  status: 'Road Legal' | 'Restricted' | 'Grounded';
  statusClass: string;
}

export interface PoolItem {
  name: string;
  loc: string;
  slots: string;
  ready: number;
  free: number;
  pic: string;
  tel: string;
}

export interface WorkOrderItem {
  spkId: string;
  unitId: string;
  chassis: string;
  variant: string;
  issue: string;
  priority: string;
  workshop: string;
  bay: string;
  status: string;
  statusClass: string;
}

export interface SPKPartRequisition {
  id: string;
  partName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  isAvailable: boolean;
}

export type SPKStatus = 'Antrean' | 'Dikerjakan' | 'Menunggu Part' | 'Uji Kelaikan' | 'Selesai';
export type SPKPriority = 'Kritis (Grounded)' | 'Tinggi' | 'Normal' | 'Rendah';
export type SPKMaintenanceType = 'Preventive Maintenance' | 'Corrective Repair' | 'Breakdown Jalur' | 'Overhaul' | 'Body Repair';
export type SPKSubsystem = 'Pengereman & Pneumatik' | 'Mesin & Bahan Bakar' | 'Transmisi & Kopling' | 'Suspensi & Kaki-Kaki' | 'Kelistrikan, AC & Instrument' | 'Bodi & Interior';

export interface MaintenanceSPKItem {
  id: string;
  spkNumber: string;
  date: string;
  targetDate: string;
  busId: string;
  plate: string;
  chassis: string;
  odometer: string;
  pool: string;
  bay: string;
  source: 'Ramp Check Pre-Trip' | 'Keluhan Driver' | 'Servis Berkala (PM)' | 'Breakdown Jalur';
  refNumber?: string;
  maintenanceType: SPKMaintenanceType;
  subsystem: SPKSubsystem;
  priority: SPKPriority;
  complaint: string;
  plannedAction: string;
  foreman: string;
  leadMechanic: string;
  assistantMechanic?: string;
  estimatedHours: number;
  progressPercent: number;
  status: SPKStatus;
  parts: SPKPartRequisition[];
  laborCost: number;
  partsCost: number;
  totalCost: number;
  notes?: string;
  completionNotes?: string;
}

export interface ServiceRecord {
  id: string;
  busId: string;
  spkNumber: string;
  date: string;
  odometer: string;
  category: string;
  description: string;
  partsReplaced: string[];
  workshop: string;
  mechanic: string;
  cost: string;
  status: 'Selesai' | 'Garansi' | 'Dalam Pengerjaan';
  statusBadge: string;
}

export interface PoolData {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  capacity: number;
  occupied: number;
  washBays: number;
  mechanicBays: number;
  picName: string;
  phone: string;
  status: 'Aktif' | 'Penuh' | 'Maintenance';
}

export interface DepoData {
  id: string;
  name: string;
  code: string;
  city: string;
  depoType: 'Logistik & Suku Cadang' | 'Workshop & Overhaul' | 'Karoseri & Repair Bodi';
  areaSize: string;
  rackCount: number;
  mechanicsCount: number;
  picName: string;
  phone: string;
  status: 'Operasional 24 Jam' | 'Shift Terjadwal' | 'Renovasi';
}

export interface TrayekData {
  id: string;
  routeCode: string;
  origin: string;
  destination: string;
  corridor: string;
  distanceKm: number;
  estDuration: string;
  fleetCount: number;
  fareRange: string;
  skKemenhub: string;
  status: 'Aktif Resmi' | 'Musiman' | 'Tahap Evaluasi';
}
