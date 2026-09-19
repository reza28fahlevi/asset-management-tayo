import { WheelItem, BatteryItem } from '../types';

export const mockWheels: Record<string, WheelItem> = {
  "1L": { name: "Michelin X Multi Z", serial: "DOT MC-440-2024", odo: "48.200 km", tread: "11.0 mm", status: "Aman", badge: "1L Steer Kiri", color: "bg-emerald-600", psi: "125 PSI" },
  "1R": { name: "Michelin X Multi Z", serial: "DOT MC-440-2024", odo: "48.200 km", tread: "10.5 mm", status: "Aman", badge: "1R Steer Kanan", color: "bg-emerald-600", psi: "124 PSI" },
  "2L-O": { name: "Bridgestone R150", serial: "DOT BS-311-2311", odo: "78.400 km", tread: "5.8 mm", status: "Waspada", badge: "2L-Outer (Drive)", color: "bg-amber-500", psi: "118 PSI" },
  "2L-I": { name: "GT Radial Giti GAR820", serial: "DOT 93 U7 4122", odo: "94.320 km", tread: "4.6 mm", status: "Perhatian", badge: "2L-Inner (Drive)", color: "bg-amber-500", psi: "120 PSI" },
  "2R-I": { name: "Bridgestone R150", serial: "DOT BS-441-2401", odo: "52.100 km", tread: "9.2 mm", status: "Aman", badge: "2R-Inner (Drive)", color: "bg-emerald-600", psi: "122 PSI" },
  "2R-O": { name: "Gajah Tunggal Super Lug", serial: "DOT GT-112-2119", odo: "118.500 km", tread: "3.1 mm", status: "Wajib Ganti", badge: "2R-Outer (Drive)", color: "bg-error", psi: "112 PSI" },
  "SP-1": { name: "Goodyear Marathon LHS", serial: "DOT GY-884-2402", odo: "12.000 km", tread: "11.4 mm", status: "Standby", badge: "SP-1 Ban Serep", color: "bg-emerald-600", psi: "125 PSI" }
};

export const mockBatteries: BatteryItem[] = [
  {
    title: "Starter Bank 1 (Primary)",
    voltage: "12.8V",
    model: "GS Yuasa N120 HD",
    serial: "GS-HD-2409-8819A",
    cca: "890 CCA (Optimal)"
  },
  {
    title: "Starter Bank 2 (Pair)",
    voltage: "12.7V",
    model: "GS Yuasa N120 HD",
    serial: "GS-HD-2409-8820B",
    cca: "875 CCA (Optimal)"
  },
  {
    title: "Aux Inverter AC 220V",
    voltage: "223 VAC",
    model: "TBE Pure Sine Wave 3000W",
    serial: "INV-3000-PSW",
    cca: "92.4% Efisiensi",
    detail: "Beban: 32 Seat USB & Audio AVOD"
  }
];

export const mockTireLogs = [
  {
    date: "24 Okt 2024, 09:20",
    busId: "TY-082",
    serial: "DOT 93 U7 4122 (GT Radial)",
    transaction: "Rotasi 1R → 2L-I",
    mechanic: "Hendra Saputra",
    type: "rotation"
  },
  {
    date: "23 Okt 2024, 16:45",
    busId: "TY-104",
    serial: "DOT BR-882-0921 (Bridgestone)",
    transaction: "Kirim Vulkanisir",
    mechanic: "Bambang S.",
    type: "retread"
  }
];

