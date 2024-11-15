import { IGerbang } from "../../../../../interfaces/gerbang";

export interface IGerbangFormProps  {
    open: boolean
    loading: boolean
    formType: string
    defaultValue: IGerbang | null;
    onClose: () => void;
    onConfirm: (data: IGerbang) => void;
  }