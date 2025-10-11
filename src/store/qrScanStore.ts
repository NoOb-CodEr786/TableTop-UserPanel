import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QRScanUser {
  id: string;
  name: string;
  email: string;
}

interface QRScanTable {
  id: string;
  tableNumber: string;
  capacity: number;
  status: string;
}

interface QRScanHotel {
  id: string;
  name: string;
}

interface QRScanBranch {
  id: string;
  name: string;
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}

interface QRScanMenu {
  categories: any[];
  totalCategories: number;
  totalItems: number;
  lastUpdated: string;
}

interface QRScanData {
  hotelId: string;
  branchId: string;
  tableNo: string;
  scannedAt: string;
}

interface QRScanState {
  // Scan data
  isAuthenticated: boolean;
  user: QRScanUser | null;
  table: QRScanTable | null;
  hotel: QRScanHotel | null;
  branch: QRScanBranch | null;
  menu: QRScanMenu | null;
  scanData: QRScanData | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setScanResult: (data: {
    authenticated: boolean;
    user: QRScanUser;
    table: QRScanTable;
    hotel: QRScanHotel;
    branch: QRScanBranch;
    menu: QRScanMenu;
    scanData: QRScanData;
  }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearScanData: () => void;
  
  // Current scan parameters (temporary state)
  currentScanParams: {
    hotelId: string;
    branchId: string;
    tableNo: string;
  } | null;
  setCurrentScanParams: (params: { hotelId: string; branchId: string; tableNo: string }) => void;
}

export const useQRScanStore = create<QRScanState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      table: null,
      hotel: null,
      branch: null,
      menu: null,
      scanData: null,
      isLoading: false,
      error: null,
      currentScanParams: null,

      // Actions
      setScanResult: (data) => {
        set({
          isAuthenticated: data.authenticated,
          user: data.user,
          table: data.table,
          hotel: data.hotel,
          branch: data.branch,
          menu: data.menu,
          scanData: data.scanData,
          error: null,
          isLoading: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearScanData: () => {
        set({
          isAuthenticated: false,
          user: null,
          table: null,
          hotel: null,
          branch: null,
          menu: null,
          scanData: null,
          error: null,
          isLoading: false,
          currentScanParams: null,
        });
      },

      setCurrentScanParams: (params) => {
        set({ currentScanParams: params });
      },
    }),
    {
      name: 'qr-scan-storage',
      partialize: (state) => ({
        // Only persist the scan result data, not loading states or current params
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        table: state.table,
        hotel: state.hotel,
        branch: state.branch,
        menu: state.menu,
        scanData: state.scanData,
      }),
    }
  )
);
