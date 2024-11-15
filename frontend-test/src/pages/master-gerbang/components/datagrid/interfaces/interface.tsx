import { IGerbang } from "../../../../../interfaces/gerbang";

export interface IDataGridProps {
    data: IGerbang[];
    loading: boolean;
    onEdit: (value: IGerbang) => void;
    onDelete: (value: IGerbang) => void; 
  }