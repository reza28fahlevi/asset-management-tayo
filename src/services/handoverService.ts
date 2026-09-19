import apiClient from './api';
import { HandoverRecordItem } from '../types';
import { mockHandoverRecords, mockPoolFleetStatus } from '../data/mockHandover';

export interface HandoverFilterParams {
  type?: string;
  status?: string;
  search?: string;
  pool?: string;
}

export const handoverService = {
  /**
   * Mengambil daftar log BASTK Serah Terima dari Laravel
   * GET /api/handovers
   */
  async getHandovers(params?: HandoverFilterParams): Promise<HandoverRecordItem[]> {
    try {
      const response = await apiClient.get<{ data: HandoverRecordItem[] } | HandoverRecordItem[]>('/handovers', {
        params,
      });
      const data = 'data' in response.data ? response.data.data : response.data;
      return data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        console.warn('[HandoverService] Menggunakan data mock karena backend Laravel belum aktif.');
        return mockHandoverRecords;
      }
      throw error;
    }
  },

  /**
   * Menyimpan form Check-In (Tiba di Pool) baru ke Laravel
   * POST /api/handovers/check-in
   */
  async createCheckIn(payload: Partial<HandoverRecordItem>): Promise<HandoverRecordItem> {
    try {
      const response = await apiClient.post<{ data: HandoverRecordItem } | HandoverRecordItem>(
        '/handovers/check-in',
        payload
      );
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        const mockItem: HandoverRecordItem = {
          id: `HND-${Date.now().toString().slice(-4)}`,
          bastkNumber: payload.bastkNumber || `BASTK-${Date.now().toString().slice(-4)}`,
          busId: payload.busId || 'TY-088',
          plate: payload.plate || 'B 7942 KGA',
          chassis: payload.chassis,
          type: 'Check-In (Tiba di Pool)',
          date: payload.date || new Date().toISOString().slice(0, 10),
          time: payload.time || '08:30 WIB',
          originPool: payload.originPool || 'Pool Surabaya Waru',
          destinationPool: payload.destinationPool || 'Pool Pusat Pulogebang',
          driverName: payload.driverName || 'Driver',
          coDriverName: payload.coDriverName,
          dispatcherName: payload.dispatcherName || 'Dispatcher Ramp',
          canbusOdometer: Number(payload.canbusOdometer || 0),
          physicalOdometer: Number(payload.physicalOdometer || 0),
          odometerDiff: Number(payload.odometerDiff || 0),
          fuelLevelPercent: Number(payload.fuelLevelPercent || 0),
          fuelLiters: Number(payload.fuelLiters || 0),
          adBlueLevel: payload.adBlueLevel,
          cabinCleanliness: payload.cabinCleanliness || 'Standar',
          toiletStatus: payload.toiletStatus || 'Perlu Kuras & Isi Air',
          safetyItemsComplete: Boolean(payload.safetyItemsComplete),
          documentsComplete: Boolean(payload.documentsComplete),
          passengerAmenitiesCount: payload.passengerAmenitiesCount || '34 Selimut',
          handoverStatus: payload.handoverStatus || 'Masuk Cuci & Sanitasi',
          statusBadge: payload.statusBadge || 'bg-blue-100 text-blue-800',
          driverComplaint: payload.driverComplaint,
          notes: payload.notes,
        };
        return mockItem;
      }
      throw error;
    }
  },

  /**
   * Menyimpan form Check-Out (Dispatch Keberangkatan SPJ) ke Laravel
   * POST /api/handovers/check-out
   */
  async createCheckOut(payload: Partial<HandoverRecordItem>): Promise<HandoverRecordItem> {
    try {
      const response = await apiClient.post<{ data: HandoverRecordItem } | HandoverRecordItem>(
        '/handovers/check-out',
        payload
      );
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        const mockItem: HandoverRecordItem = {
          id: `HND-${Date.now().toString().slice(-4)}`,
          bastkNumber: payload.bastkNumber || `BASTK-OUT-${Date.now().toString().slice(-4)}`,
          busId: payload.busId || 'TY-104',
          plate: payload.plate || 'B 7201 UGA',
          chassis: payload.chassis,
          type: 'Check-Out (Keberangkatan SPJ)',
          date: payload.date || new Date().toISOString().slice(0, 10),
          time: payload.time || '15:30 WIB',
          originPool: payload.originPool || 'Pool Pusat Pulogebang',
          destinationPool: payload.destinationPool || 'Pool Surabaya Waru',
          driverName: payload.driverName || 'Driver 1',
          coDriverName: payload.coDriverName,
          dispatcherName: payload.dispatcherName || 'Dispatcher Ramp',
          canbusOdometer: Number(payload.physicalOdometer || 0),
          physicalOdometer: Number(payload.physicalOdometer || 0),
          odometerDiff: 0,
          fuelLevelPercent: 100,
          fuelLiters: 400,
          cabinCleanliness: 'Sangat Bersih',
          toiletStatus: 'Bersih & Air Penuh',
          safetyItemsComplete: true,
          documentsComplete: true,
          passengerAmenitiesCount: '32 Selimut Laundry',
          handoverStatus: 'Ready / Siap Jalan',
          statusBadge: 'bg-emerald-100 text-emerald-800',
          notes: payload.notes,
        };
        return mockItem;
      }
      throw error;
    }
  },

  /**
   * Mengambil status ketersediaan armada per pool dari Laravel
   * GET /api/pools/fleet-status
   */
  async getPoolFleetStatus() {
    try {
      const response = await apiClient.get('/pools/fleet-status');
      return response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return mockPoolFleetStatus;
      }
      throw error;
    }
  },
};

export default handoverService;

