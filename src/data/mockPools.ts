import { PoolItem, PoolData, DepoData, TrayekData } from '../types';

export const mockPools: PoolItem[] = [
  {
    name: "Pulogebang (Pusat)",
    loc: "Jakarta Timur",
    slots: "38 / 50 Slot",
    ready: 26,
    free: 12,
    pic: "Hendra Saputra",
    tel: "(021) 4870-9821"
  },
  {
    name: "Surabaya Waru",
    loc: "Sidoarjo, Jatim",
    slots: "22 / 35 Slot",
    ready: 17,
    free: 13,
    pic: "Agus Santoso",
    tel: "(031) 853-4412"
  },
  {
    name: "Solo Tirtonadi",
    loc: "Surakarta, Jateng",
    slots: "15 / 25 Slot",
    ready: 12,
    free: 10,
    pic: "Budi Santoso",
    tel: "(0271) 714-229"
  },
  {
    name: "Poris Plawad",
    loc: "Tangerang, Banten",
    slots: "14 / 20 Slot",
    ready: 11,
    free: 6,
    pic: "Dedi Kurniawan",
    tel: "(021) 5578-1002"
  }
];

export const initialPools: PoolData[] = [
  {
    id: "POOL-001",
    name: "Pool Utama Pulogebang",
    code: "PLG-01",
    city: "Jakarta Timur",
    address: "Kawasan Sentra Primer Timur, Cakung, Jakarta Timur",
    capacity: 50,
    occupied: 38,
    washBays: 4,
    mechanicBays: 6,
    picName: "Hendra Saputra",
    phone: "(021) 4870-9821",
    status: "Aktif"
  },
  {
    id: "POOL-002",
    name: "Pool Surabaya Waru",
    code: "SBY-01",
    city: "Sidoarjo",
    address: "Jl. Letjend Sutoyo No. 140, Medaeng, Waru, Sidoarjo",
    capacity: 35,
    occupied: 22,
    washBays: 3,
    mechanicBays: 4,
    picName: "Agus Santoso",
    phone: "(031) 853-4412",
    status: "Aktif"
  },
  {
    id: "POOL-003",
    name: "Pool Solo Tirtonadi",
    code: "SLO-01",
    city: "Surakarta",
    address: "Jl. Ahmad Yani No. 200, Gilingan, Banjarsari, Solo",
    capacity: 25,
    occupied: 15,
    washBays: 2,
    mechanicBays: 3,
    picName: "Budi Santoso",
    phone: "(0271) 714-229",
    status: "Aktif"
  },
  {
    id: "POOL-004",
    name: "Pool Poris Plawad",
    code: "TNG-01",
    city: "Tangerang",
    address: "Jl. Benteng Betawi, Poris Plawad, Cipondoh, Tangerang",
    capacity: 20,
    occupied: 14,
    washBays: 2,
    mechanicBays: 2,
    picName: "Dedi Kurniawan",
    phone: "(021) 5578-1002",
    status: "Aktif"
  }
];

export const initialDepos: DepoData[] = [
  {
    id: "DPO-001",
    name: "Depo Logistik Sentral Cakung",
    code: "DPO-CKG-01",
    city: "Jakarta Timur",
    depoType: "Logistik & Suku Cadang",
    areaSize: "1.850 m²",
    rackCount: 48,
    mechanicsCount: 16,
    picName: "Mulyadi Siregar",
    phone: "(021) 460-2291",
    status: "Operasional 24 Jam"
  },
  {
    id: "DPO-002",
    name: "Depo Workshop & Heavy Overhaul Waru",
    code: "DPO-WRU-02",
    city: "Sidoarjo",
    depoType: "Workshop & Overhaul",
    areaSize: "2.400 m²",
    rackCount: 32,
    mechanicsCount: 22,
    picName: "Kuncoro Jati",
    phone: "(031) 854-9981",
    status: "Operasional 24 Jam"
  },
  {
    id: "DPO-003",
    name: "Depo Karoseri & Painting Restorasi",
    code: "DPO-SLO-03",
    city: "Surakarta",
    depoType: "Karoseri & Repair Bodi",
    areaSize: "1.200 m²",
    rackCount: 20,
    mechanicsCount: 12,
    picName: "Sunarto Hadi",
    phone: "(0271) 728-119",
    status: "Shift Terjadwal"
  }
];

export const initialTrayeks: TrayekData[] = [
  {
    id: "TRK-001",
    routeCode: "TRY-JKT-SBY-01",
    origin: "Jakarta (Pulogebang / Poris)",
    destination: "Surabaya (Waru / Bungurasih)",
    corridor: "Tol Trans-Jawa • Semarang • Solo • Kertosono",
    distanceKm: 785,
    estDuration: "10 - 11 Jam",
    fleetCount: 24,
    fareRange: "Rp 380.000 - Rp 550.000",
    skKemenhub: "SK.892/AJ.201/DJDAT/2023",
    status: "Aktif Resmi"
  },
  {
    id: "TRK-002",
    routeCode: "TRY-JKT-MLG-02",
    origin: "Jakarta (Pulogebang / Tj. Priok)",
    destination: "Malang (Arjosari)",
    corridor: "Tol Trans-Jawa • Ngawi • Mojokerto • Pandaan",
    distanceKm: 850,
    estDuration: "12 - 13 Jam",
    fleetCount: 16,
    fareRange: "Rp 410.000 - Rp 590.000",
    skKemenhub: "SK.904/AJ.201/DJDAT/2023",
    status: "Aktif Resmi"
  },
  {
    id: "TRK-003",
    routeCode: "TRY-BDG-YOG-03",
    origin: "Bandung (Cicaheum)",
    destination: "Yogyakarta (Giwangan)",
    corridor: "Jalur Selatan • Tasik • Purwokerto • Kebumen",
    distanceKm: 420,
    estDuration: "8 - 9 Jam",
    fleetCount: 12,
    fareRange: "Rp 220.000 - Rp 340.000",
    skKemenhub: "SK.450/AJ.201/DJDAT/2024",
    status: "Aktif Resmi"
  },
  {
    id: "TRK-004",
    routeCode: "TRY-JKT-MDN-04",
    origin: "Jakarta (Pulogebang)",
    destination: "Madiun (Purboyo)",
    corridor: "Tol Trans-Jawa • Sragen • Ngawi • Madiun",
    distanceKm: 640,
    estDuration: "8 - 9 Jam",
    fleetCount: 14,
    fareRange: "Rp 320.000 - Rp 450.000",
    skKemenhub: "SK.712/AJ.201/DJDAT/2023",
    status: "Aktif Resmi"
  }
];
