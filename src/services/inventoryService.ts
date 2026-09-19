import apiClient from './api';
import { PartItem, GoodsReceiptItem, GoodsIssueItem, StockMutationItem, StockOpnameItem } from '../types';
import { mockParts, mockGoodsReceipts } from '../data/mockInventory';

export const inventoryService = {
  /**
   * Mengambil katalog suku cadang dari Laravel
   * GET /api/inventory/parts
   */
  async getParts(): Promise<PartItem[]> {
    try {
      const response = await apiClient.get<{ data: PartItem[] } | PartItem[]>('/inventory/parts');
      return 'data' in response.data ? response.data.data : response.data;
    } catch {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return mockParts;
      }
      return [];
    }
  },

  /**
   * Menambahkan Master SKU Suku Cadang baru
   * POST /api/inventory/parts
   */
  async createPart(payload: Partial<PartItem>): Promise<PartItem> {
    try {
      const response = await apiClient.post<{ data: PartItem } | PartItem>('/inventory/parts', payload);
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as PartItem;
      }
      throw error;
    }
  },

  /**
   * Mengambil riwayat penerimaan barang (GRN) dari vendor/PO
   * GET /api/inventory/receipts
   */
  async getGoodsReceipts(): Promise<GoodsReceiptItem[]> {
    try {
      const response = await apiClient.get<{ data: GoodsReceiptItem[] } | GoodsReceiptItem[]>('/inventory/receipts');
      return 'data' in response.data ? response.data.data : response.data;
    } catch {
      return mockGoodsReceipts;
    }
  },

  /**
   * Mencatat Penerimaan Barang Baru (GRN)
   * POST /api/inventory/receipts
   */
  async createGoodsReceipt(payload: Partial<GoodsReceiptItem>): Promise<GoodsReceiptItem> {
    try {
      const response = await apiClient.post<{ data: GoodsReceiptItem } | GoodsReceiptItem>('/inventory/receipts', payload);
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as GoodsReceiptItem;
      }
      throw error;
    }
  },

  /**
   * Mencatat Pengeluaran Suku Cadang ke Bengkel (Goods Issue)
   * POST /api/inventory/issues
   */
  async createGoodsIssue(payload: Partial<GoodsIssueItem>): Promise<GoodsIssueItem> {
    try {
      const response = await apiClient.post<{ data: GoodsIssueItem } | GoodsIssueItem>('/inventory/issues', payload);
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as GoodsIssueItem;
      }
      throw error;
    }
  },

  /**
   * Mencatat Mutasi Antar-Gudang Depo Pool
   * POST /api/inventory/mutations
   */
  async createStockMutation(payload: Partial<StockMutationItem>): Promise<StockMutationItem> {
    try {
      const response = await apiClient.post<{ data: StockMutationItem } | StockMutationItem>('/inventory/mutations', payload);
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as StockMutationItem;
      }
      throw error;
    }
  },

  /**
   * Mencatat Hasil Audit Stock Opname Fisik
   * POST /api/inventory/opnames
   */
  async createStockOpname(payload: Partial<StockOpnameItem>): Promise<StockOpnameItem> {
    try {
      const response = await apiClient.post<{ data: StockOpnameItem } | StockOpnameItem>('/inventory/opnames', payload);
      return 'data' in response.data ? response.data.data : response.data;
    } catch (error) {
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return payload as StockOpnameItem;
      }
      throw error;
    }
  },
};

export default inventoryService;

