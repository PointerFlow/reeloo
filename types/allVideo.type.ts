export interface IAllVideo {
  _id: string;
  storeId: string;
  title: string;
  url: string;
  source: string;
  products: any[]; 
  productCount: number;
  views: number;
  status: "active" | "inactive" | string;
  width: number;
  height: number;
  duration: number;
  format: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}
