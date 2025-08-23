import { IShopifyProduct } from "types/shopifyProduct.type";

export const getProductById = (id: string, allProducts: IShopifyProduct[])=>{
    const product : IShopifyProduct | undefined = allProducts.find((product)=> product.id === id );
    return product;
}

export const getProductByIds = (ids: string[], allProducts: IShopifyProduct[])=>{
    const products : IShopifyProduct[] = ids.map((id)=>getProductById(id, allProducts) as IShopifyProduct);
    return products;
}