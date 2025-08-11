export interface IAllproduct {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        featuredMedia?: {
          preview?: {
            image?: {
              url?: string;
            };
          };
        };
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
}


