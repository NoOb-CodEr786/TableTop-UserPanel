import instance from './axiosInstance';

interface QRScanParams {
  hotelId: string;
  branchId: string;
  tableNo: string;
}

interface QRScanResponse {
  statusCode: number;
  data: {
    authenticated: boolean;
    user: {
      id: string;
      name: string;
      email: string;
    };
    table: {
      id: string;
      tableNumber: string;
      capacity: number;
      status: string;
    };
    hotel: {
      id: string;
      name: string;
    };
    branch: {
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
    };
    menu: {
      categories: any[];
      totalCategories: number;
      totalItems: number;
      lastUpdated: string;
    };
    scanData: {
      hotelId: string;
      branchId: string;
      tableNo: string;
      scannedAt: string;
    };
  };
  message: string;
  success: boolean;
}

export const qrScanAPI = {
  /**
   * Scan QR code and validate authentication
   */
  scanQR: async (params: QRScanParams): Promise<QRScanResponse> => {
    const response = await instance.get('/scan', {
      params: {
        hotelId: params.hotelId,
        branchId: params.branchId,
        tableNo: params.tableNo,
      },
    });
    return response.data;
  },
};
