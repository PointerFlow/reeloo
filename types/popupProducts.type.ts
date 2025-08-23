import { IAllproduct } from "./allproduct.type";
import { singleProduct } from "./singleproduct.type";

export interface popupProducts {
  isProductModalOpen: boolean;
  setIsProductModalOpen: (val: boolean) => void;
  setSelectedProductIds: (ids: Set<string>) => void;
  selectedProductIds: Set<string>;
  shopifyProducts: IAllproduct;
  filteredProducts: singleProduct[];
  addSelectedProducts: () => void;
  handleProductSelection: (id: string) => void;
}