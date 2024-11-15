
export interface IGerbang {
    id: number;
    IdCabang: number;
    NamaGerbang: string;
    NamaCabang: string;
  }
  
  export interface IGerbangRows {
    count: number;
    rows: IGerbang[];
  }
  
  export interface IGerbangData {
    total_pages: number;
    current_page: number;
    count: number;
    rows: IGerbangRows;
  }

  export interface ISaveGerbangResponse {
    status: boolean;
    message: string;
    code: number;
    id: {
      id: number;
      IdCabang: number;
      NamaGerbang: string;
      NamaCabang: string;
      updatedAt: string;
      createdAt: string;
    };
  }

  export interface IDeleteGerbangResponse {
    status: boolean;
    message: string;
    code: number;
    IdGerbang: number;
    IdCabang: number;
  }
  
  export interface IGerbangApiResponse {
    status: boolean;
    message: string;
    code: number;
    data: IGerbangData;
  }
  