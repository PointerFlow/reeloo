export interface Product {
    id: string;
    title: string;
    image: {
        featuredMedia: {
            preview: {
                image: string;
            };
        };
    };
    price?: string;
    vendor?: string;
    isSelected?: boolean;
}
