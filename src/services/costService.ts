import apiClient from './api';
import { FleetCostRecord, RebodySimulationItem } from '../types';
import { mockCostRecords, mockRebodySimulations } from '../data/mockCostAnalytics';

export const costService = {
  /**
   * Mengambil log realisasi beban biaya operasional armada per KM
   * GET /api/analytics/costs
   */
  async getCostRecords(): Promise<FleetCostRecord[]> {
    try {
      const response = await apiClient.get<{ data: FleetCostRecord[] } | FleetCostRecord[]>('/analytics/costs');
      return 'data' in response.data ? response.data.data : response.data;
    } catch {
      return mockCostRecords;
    }
  },

  /**
   * Mencatat realisasi biaya operasional bulanan armada
   * POST /api/analytics/costs
   */
  async createCostRecord(payload: Partial<FleetCostRecord>): Promise<FleetCostRecord> {
    try {
      const response = await apiClient.post<{ data: FleetCostRecord } | FleetCostRecord>('/analytics/costs', payload);
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as FleetCostRecord;
      }
      throw error;
    }
  },

  /**
   * Mengambil daftar kajian kelayakan simulasi Re-Body vs Beli Baru
   * GET /api/analytics/rebody-simulations
   */
  async getRebodySimulations(): Promise<RebodySimulationItem[]> {
    try {
      const response = await apiClient.get<{ data: RebodySimulationItem[] } | RebodySimulationItem[]>(
        '/analytics/rebody-simulations'
      );
      return 'data' in response.data ? response.data.data : response.data;
    } catch {
      return mockRebodySimulations;
    }
  },

  /**
   * Menyimpan kajian kelayakan simulasi Re-Body baru
   * POST /api/analytics/rebody-simulations
   */
  async createRebodySimulation(payload: Partial<RebodySimulationItem>): Promise<RebodySimulationItem> {
    try {
      const response = await apiClient.post<{ data: RebodySimulationItem } | RebodySimulationItem>(
        '/analytics/rebody-simulations',
        payload
      );
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as RebodySimulationItem;
      }
      throw error;
    }
  },
};

export default costService;

