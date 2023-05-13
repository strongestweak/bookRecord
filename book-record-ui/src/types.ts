export interface FileItem {
  id: number;
  name: string;
  isPath?: boolean;
  ParentId?: number | null;
  Parent?: FileItem;
}

export interface StateLoading<Type> {
  isLoading: boolean;
  data?: Type;
  error?: string;
}
