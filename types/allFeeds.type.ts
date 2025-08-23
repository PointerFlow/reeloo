export interface IFeedsDataAll {
  _id: string;
  createdAt: string;      
  updatedAt: string;      
  name: string;
  status: "active" | "draft"; 
  storeId: string;
  widgetType: string; 
  videos: string[]; 
  totalVideos:string;     
}