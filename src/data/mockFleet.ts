import { BusAsset, ServiceRecord } from '../types';

export const mockBuses: BusAsset[] = [
  {
    id: "T-015",
    plate: "B 7123 VGA",
    year: "2024",
    color: "Putih Biru",
    chassis: "Mercedes-Benz OH 1626 L",
    vin: "WDB3820251A987612",
    engine: "OM906LA.V/1-002148",
    body: "Adiputro Jetbus 5 MHD",
    type: "Sleeper Suite (22 Seat)",
    layout: "1-1 Capsule Deck",
    odo: "84.320 Km",
    pool: "Pulogebang (Jkt)",
    status: "Ready",
    statusClass: "bg-emerald-100 text-emerald-800"
  },
  {
    id: "T-088",
    plate: "B 7942 KGA",
    year: "2023",
    color: "Electric Navy",
    chassis: "Scania K410IB 6x2*4",
    vin: "YS2K6X20002145920",
    engine: "DC13-107-Euro5",
    body: "Laksana Legacy SR3 Double Decker",
    type: "Kombinasi (34 Seat)",
    layout: "Lower: 6 Sleeper • Upper: 28 Exec",
    odo: "218.490 Km",
    pool: "Tol Cipali KM 166",
    status: "On-Trip",
    statusClass: "bg-blue-100 text-blue-800"
  },
  {
    id: "T-102",
    plate: "AD 1880 CF",
    year: "2023",
    color: "Grey Silver",
    chassis: "Hino RM280 Space Frame",
    vin: "MHHJ8JL89PK009381",
    engine: "J08E-WD-Euro4",
    body: "Tentrem Avante H8 Facelift",
    type: "Super Executive (28 Seat)",
    layout: "Konfigurasi 2-2 + Legrest",
    odo: "142.100 Km",
    pool: "Pool Solo Tirtonadi",
    status: "Standby",
    statusClass: "bg-amber-100 text-amber-800"
  },
  {
    id: "T-044",
    plate: "L 7801 UA",
    year: "2022",
    color: "Sapphire Cyan",
    chassis: "Mercedes-Benz O 500 RS 1836",
    vin: "WDB3821031A562309",
    engine: "OM457LA.E3/1-984210",
    body: "Adiputro Jetbus 3+ SHD",
    type: "Executive (30 Seat)",
    layout: "Konfigurasi 2-2 USB port",
    odo: "312.800 Km",
    pool: "Bengkel Pulogebang",
    status: "Under Maintenance",
    statusClass: "bg-orange-100 text-orange-800"
  }
];

export const mockServiceHistory: Record<string, ServiceRecord[]> = {
  "T-015": [
    {
      id: "SRV-015-01",
      busId: "T-015",
      spkNumber: "SPK-2024-0982",
      date: "12 Okt 2024",
      odometer: "80.120 Km",
      category: "Preventive Maintenance",
      description: "Paket Servis Rutin 80K KM: Penggantian Oli Mesin, Filter Oli, dan Separator Solar Racor",
      partsReplaced: ["Oli Delvac MX 15W-40 (28L)", "Filter Oli MB A906", "Filter Solar Separator 1000FH"],
      workshop: "Pool Pulogebang - Bay 02",
      mechanic: "Hendra Saputra",
      cost: "Rp 3.850.000",
      status: "Selesai",
      statusBadge: "bg-emerald-100 text-emerald-800"
    },
    {
      id: "SRV-015-02",
      busId: "T-015",
      spkNumber: "SPK-2024-0711",
      date: "28 Agu 2024",
      odometer: "68.450 Km",
      category: "Pneumatic & Brake",
      description: "Penggantian Kampas Rem Roda Depan & Re-Torque Slack Adjuster Pneumatic",
      partsReplaced: ["Kampas Rem Tromol HD (2 Set)", "Seal Hub Roda MB"],
      workshop: "Pool Solo Tirtonadi - Pit 01",
      mechanic: "Budi Santoso",
      cost: "Rp 2.650.000",
      status: "Selesai",
      statusBadge: "bg-emerald-100 text-emerald-800"
    },
    {
      id: "SRV-015-03",
      busId: "T-015",
      spkNumber: "SPK-2024-0490",
      date: "15 Jun 2024",
      odometer: "52.000 Km",
      category: "Kelistrikan & AC",
      description: "Servis Kompresor AC Denso, Kuras Freon R134a & Penggantian Filter Blower Kabin",
      partsReplaced: ["Freon R134a (4 Kaleng)", "Filter Blower Cabin Cabin", "Magnetic Clutch Shim"],
      workshop: "Pool Pulogebang - AC Bay",
      mechanic: "Yanto Prasetyo",
      cost: "Rp 4.200.000",
      status: "Selesai",
      statusBadge: "bg-emerald-100 text-emerald-800"
    },
    {
      id: "SRV-015-04",
      busId: "T-015",
      spkNumber: "SPK-2024-0231",
      date: "04 Mar 2024",
      odometer: "30.200 Km",
      category: "Preventive Maintenance",
      description: "Inspeksi Pertama 30K KM, Balancing & Spooring 6 Roda, Cek Torsi Baut Sasis",
      partsReplaced: ["Gemuk Chassis Hi-Temp NLGI-2", "Dowel Pin Suspensi"],
      workshop: "Pool Surabaya Waru - Pit 03",
      mechanic: "Agus Santoso",
      cost: "Rp 1.450.000",
      status: "Garansi",
      statusBadge: "bg-blue-100 text-blue-800"
    }
  ],
  "T-088": [
    {
      id: "SRV-088-01",
      busId: "T-088",
      spkNumber: "SPK-2024-1002",
      date: "18 Okt 2024",
      odometer: "210.000 Km",
      category: "Powertrain & Kopling",
      description: "Penggantian Clutch Disc & Pressure Plate Scania Opticruise 6x2 Double Decker",
      partsReplaced: ["Clutch Kit Scania DC13 OE", "Release Bearing Scania"],
      workshop: "Bengkel Pulogebang - Heavy Bay",
      mechanic: "Ahmad Rivai",
      cost: "Rp 14.800.000",
      status: "Selesai",
      statusBadge: "bg-emerald-100 text-emerald-800"
    },
    {
      id: "SRV-088-02",
      busId: "T-088",
      spkNumber: "SPK-2024-0822",
      date: "02 Sep 2024",
      odometer: "195.400 Km",
      category: "Kaki-kaki & Suspensi",
      description: "Pergantian Balon Udara Kiri Belakang & Bellow Axle 3 Tag Axle Steering",
      partsReplaced: ["Air Spring Bellow Scania (2 Pcs)", "Levelling Valve Linkage"],
      workshop: "Pool Solo Tirtonadi - Pit 02",
      mechanic: "Budi Santoso",
      cost: "Rp 5.750.000",
      status: "Selesai",
      statusBadge: "bg-emerald-100 text-emerald-800"
    }
  ],
  "T-102": [
    {
      id: "SRV-102-01",
      busId: "T-102",
      spkNumber: "SPK-2024-0941",
      date: "05 Okt 2024",
      odometer: "140.000 Km",
      category: "Preventive Maintenance",
      description: "Tune Up Common-Rail Hino J08E, Kalibrasi Injektor Euro4 & Penggantian Filter",
      partsReplaced: ["Fuel Filter Pre & Main Hino", "Air Cleaner Element HD"],
      workshop: "Pool Solo Tirtonadi - Bay 01",
      mechanic: "Slamet Riyadi",
      cost: "Rp 3.100.000",
      status: "Selesai",
      statusBadge: "bg-emerald-100 text-emerald-800"
    }
  ],
  "T-044": [
    {
      id: "SRV-044-01",
      busId: "T-044",
      spkNumber: "SPK-2024-1102",
      date: "22 Okt 2024",
      odometer: "312.800 Km",
      category: "Powertrain & Kopling",
      description: "Overhaul Cylinder Head & Penggantian Packing Set Mesin OM457LA",
      partsReplaced: ["Gasket Kit OM457", "Water Pump Assembly", "Thermostat Dual-Stage"],
      workshop: "Bengkel Pulogebang - Major Pit 02",
      mechanic: "Hendra Saputra",
      cost: "Rp 18.500.000",
      status: "Dalam Pengerjaan",
      statusBadge: "bg-orange-100 text-orange-800"
    }
  ]
};
