import apiClient from './api';
import { MaintenanceSPKItem, SPKStatus } from '../types';

export interface SPKFilterParams {
  status?: SPKStatus | 'all';
  category?: string;
  bay?: string;
  search?: string;
}

export const workshopService = {
  /**
   * Mengambil daftar SPK Perawatan Bengkel dari Laravel
   * GET /api/work-orders
   */
  async getWorkOrders(params?: SPKFilterParams): Promise<MaintenanceSPKItem[]> {
    try {
      const response = await apiClient.get<{ data: MaintenanceSPKItem[] } | MaintenanceSPKItem[]>('/work-orders', { params });
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        console.warn('[WorkshopService] Backend Laravel belum aktif, menggunakan fallback data lokal.');
        return [];
      }
      throw error;
    }
  },

  /**
   * Menerbitkan SPK Baru ke Laravel
   * POST /api/work-orders
   */
  async createWorkOrder(payload: Partial<MaintenanceSPKItem>): Promise<MaintenanceSPKItem> {
    try {
      const response = await apiClient.post<{ data: MaintenanceSPKItem } | MaintenanceSPKItem>('/work-orders', payload);
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as MaintenanceSPKItem;
      }
      throw error;
    }
  },

  /**
   * Memperbarui status pengerjaan bay SPK (Dikerjakan, Menunggu Part, Selesai)
   * PATCH /api/work-orders/{id}/status
   */
  async updateStatus(spkId: string, status: SPKStatus, notes?: string): Promise<void> {
    await apiClient.patch(`/work-orders/${spkId}/status`, { status, notes });
  },

  /**
   * Alokasi mekanik kepala & pembantu ke SPK
   * POST /api/work-orders/{id}/assign-mechanic
   */
  async assignMechanic(spkId: string, leadMechanic: string, assistantMechanic?: string): Promise<void> {
    await apiClient.post(`/work-orders/${spkId}/assign-mechanic`, { leadMechanic, assistantMechanic });
  }
};

export default workshopService;

