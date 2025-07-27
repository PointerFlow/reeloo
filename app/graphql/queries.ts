// get all products
export const getAllProductsQuery = `#graphql
query GetAllProducts($after: String) {
  products(first: 250, after: $after) {
    edges {
      node {
        id
        title
				featuredMedia{
          preview{
            image{
              url
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

export const getFileByIdQuery = `#graphql
  query GetFileById($id: ID!) {
    node(id: $id) {
      id
      ... on MediaImage {
        image {
          url
        }
      }
    }
  }
`;

// get all collections
export const getAllCollectionsQuery = `#graphql
query GetAllCollections($after: String) {
  collections(first: 250, after: $after) {
    edges {
      node {
        id
        title
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;



export const getVideoFileByIdQuery = `#graphql
  query GetFileById($id: ID!) {
    node(id: $id) {
      id
      ... on GenericFile {
        url
        alt
        originalFileSize
        mimeType
        createdAt
        updatedAt
      }
      ... on Video {
        sources {
          url
          mimeType
          width
          height
        }
        originalSource {
          url
        }
        alt
        duration
        filename
      }
    }
  }
`;
