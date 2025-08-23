export interface singleProduct {
  id: string;
  image: string;
  title: string;
  featuredMedia: {
    preview: {
      image: {
        url: string;
      };
    };
  };
};
