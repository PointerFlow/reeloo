import { IAllVideo } from "./allVideo.type";
import { IShopifyProduct } from "./shopifyProduct.type";

export interface videoCard {
    allVideos: IAllVideo[];
    deleteHandler: (id: string) => void;
    shopifyProducts: IShopifyProduct[];
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedProductIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    videoIdHandler?:any;
}