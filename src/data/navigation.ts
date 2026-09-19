import { NavSection } from '../types';

export const navSections: NavSection[] = [
  {
    section: "Utama",
    items: [
      { path: "/", label: "Dashboard Overview", icon: "dashboard" }
    ]
  },
  {
    section: "Manajemen Aset",
    items: [
      { path: "/master-armada", label: "Master Data Armada", icon: "directions_bus" },
      { path: "/pelacakan-ban-komponen", label: "Tracking Ban & Aki", icon: "tire_repair" },
      { path: "/master-pool-trayek", label: "Master Pool & Trayek", icon: "alt_route" }
    ]
  },
  {
    section: "Operasional Dispatch",
    items: [
      { path: "/inspeksi-pre-trip", label: "Pre-Trip Inspection", icon: "fact_check" },
      { path: "/dispatch-serah-terima", label: "Serah Terima & Odometer", icon: "sync_alt" },
      { path: "/log-insiden", label: "Incident & Road Trouble", icon: "warning", badge: "3 Aktif" }
    ]
  },
  {
    section: "Workshop & Inventory",
    items: [
      { path: "/perawatan-spk", label: "Work Order SPK & PM", icon: "build" },
      { path: "/gudang-suku-cadang", label: "Gudang Suku Cadang", icon: "inventory_2", badge: "3 Kritis" }
    ]
  },
  {
    section: "Governance & Finansial",
    items: [
      { path: "/legalitas-regulasi", label: "Legalitas KIR & KPS", icon: "verified", badge: "3 Kritis" },
      { path: "/analitik-biaya-km", label: "Cost per KM & TCO", icon: "monitoring" }
    ]
  }
];

