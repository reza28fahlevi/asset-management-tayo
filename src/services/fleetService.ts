import apiClient from './api';
import { BusAsset } from '../types';
import { mockBuses } from '../data/mockFleet';

export const fleetService = {
  /**
   * Mengambil daftar master armada bus dari Laravel
   * GET /api/buses
   */
  async getBuses(pool?: string): Promise<BusAsset[]> {
    try {
      const response = await apiClient.get<{ data: BusAsset[] } | BusAsset[]>('/buses', {
        params: { pool },
      });
      return 'data' in response.data ? response.data.data : response.data;
    } catch {
      return mockBuses;
    }
  },

  /**
   * Mengambil detail armada spesifik
   * GET /api/buses/{id}
   */
  async getBusById(id: string): Promise<BusAsset | null> {
    try {
      const response = await apiClient.get<{ data: BusAsset } | BusAsset>(`/buses/${id}`);
      return 'data' in response.data ? response.data.data : response.data;
    } catch {
      return mockBuses.find((b) => b.id === id) || null;
    }
  },

  /**
   * Memperbarui status armada (Ready, On-Trip, Standby, Bengkel)
   * PATCH /api/buses/{id}/status
   */
  async updateStatus(id: string, status: string): Promise<void> {
    await apiClient.patch(`/buses/${id}/status`, { status });
  },
};

export default fleetService;

