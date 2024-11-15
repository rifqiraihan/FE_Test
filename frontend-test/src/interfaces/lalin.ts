
export interface ILalin {
    id: number;
    IdCabang: number;
    IdGerbang: number;
    Tanggal: string;
    Shift: number;
    IdGardu: number;
    Golongan: number;
    IdAsalGerbang: number;
    Tunai: number;
    DinasOpr: number;
    DinasMitra: number;
    DinasKary: number;
    eMandiri: number;
    eBri: number;
    eBni: number;
    eBca: number;
    eNobu: number;
    eDKI: number;
    eMega: number;
    eFlo: number;
}

export interface ILalinApiResponse {
    status: boolean;
    message: string;
    code: number;
    data: {
        total_pages: number;
        current_page: number;
        count: number;
        rows: {
            count: number;
            rows: ILalin[];
        };
    };
}