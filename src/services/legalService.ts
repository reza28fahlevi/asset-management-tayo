import apiClient from './api';
import { LegalItem, LegalScheduleItem } from '../types';
import { mockLegalData, mockLegalSchedules } from '../data/mockLegal';

export const legalService = {
  /**
   * Mengambil status legalitas seluruh armada bus
   * GET /api/legal/documents
   */
  async getDocuments(): Promise<LegalItem[]> {
    try {
      const response = await apiClient.get<{ data: LegalItem[] } | LegalItem[]>('/legal/documents');
      return 'data' in response.data ? response.data.data : response.data;
    } catch {
      return mockLegalData;
    }
  },

  /**
   * Memperbarui / Memperpanjang Masa Berlaku Dokumen (KIR, KPS, STNK)
   * POST /api/legal/renew
   */
  async renewDocument(payload: {
    busId: string;
    docType: 'kir' | 'kps' | 'stnk';
    newExpiryDate: string;
    docNumber?: string;
    location?: string;
    notes?: string;
  }): Promise<void> {
    try {
      await apiClient.post('/legal/renew', payload);
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'true') {
        throw error;
      }
    }
  },

  /**
   * Mengambil jadwal uji berkala KIR Dishub
   * GET /api/legal/schedules
   */
  async getSchedules(): Promise<LegalScheduleItem[]> {
    try {
      const response = await apiClient.get<{ data: LegalScheduleItem[] } | LegalScheduleItem[]>('/legal/schedules');
      return 'data' in response.data ? response.data.data : response.data;
    } catch {
      return mockLegalSchedules;
    }
  },

  /**
   * Menambahkan jadwal uji berkala baru ke Laravel
   * POST /api/legal/schedules
   */
  async createSchedule(payload: Partial<LegalScheduleItem>): Promise<LegalScheduleItem> {
    try {
      const response = await apiClient.post<{ data: LegalScheduleItem } | LegalScheduleItem>('/legal/schedules', payload);
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as LegalScheduleItem;
      }
      throw error;
    }
  },
};

export default legalService;

