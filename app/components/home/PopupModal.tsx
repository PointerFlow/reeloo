// import { BlockStack, Box, Checkbox, EmptyState, InlineStack, Modal, ResourceItem, ResourceList, TextField, Thumbnail } from "@shopify/polaris";
// import {
//   SearchIcon
// } from '@shopify/polaris-icons';

// export default function PopupModal() {
//     return (
//         <>
//             <Modal
//                 open={isProductModalOpen}
//                 onClose={() => {
//                     setIsProductModalOpen(false);
//                     setSelectedProductIds(new Set());
//                     setProductSearchQuery("");
//                 }}
//                 title="Select Products"
//                 primaryAction={{
//                     content: `Add Selected (${selectedProductIds.size})`,
//                     onAction: addSelectedProducts,
//                     disabled: selectedProductIds.size === 0
//                 }}
//                 secondaryActions={[{
//                     content: 'Cancel',
//                     onAction: () => {
//                         setIsProductModalOpen(false);
//                         setSelectedProductIds(new Set());
//                         setProductSearchQuery("");
//                     }
//                 }]}
//             >
//                 <Modal.Section>
//                     <Box paddingBlockEnd="400">
//                         <TextField
//                             label="Search"
//                             autoComplete="off"
//                             value={productSearchQuery}
//                             onChange={setProductSearchQuery}
//                             placeholder="Search products..."
//                             prefix={<Icon source={SearchIcon} />}
//                             clearButton
//                             onClearButtonClick={() => setProductSearchQuery("")}
//                         />
//                     </Box>

//                     {!shopifyProducts || filteredProducts.length === 0 ? (
//                         <EmptyState
//                             heading="No products found"
//                             image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
//                         >
//                             <p>Try adjusting your search terms</p>
//                         </EmptyState>
//                     ) : (
//                         <ResourceList
//                             resourceName={{ singular: 'product', plural: 'products' }}
//                             items={filteredProducts}
//                             renderItem={(product: Product) => {
//                                 return (
//                                     <ResourceItem
//                                         id={product.id}
//                                         onClick={() => handleProductSelection(product.id)}
//                                     >
//                                         <InlineStack gap="300" blockAlign="center">
//                                             <Checkbox
//                                                 label=""
//                                                 checked={selectedProductIds.has(product.id)}
//                                                 onChange={() => handleProductSelection(product.id)} />
//                                             <Thumbnail
//                                                 source={product?.featuredMedia?.preview?.image?.url}
//                                                 alt={product.title}
//                                                 size="small" />
//                                             <BlockStack gap="100">
//                                                 <Text as="span" variant="bodyMd" fontWeight="medium">
//                                                     {product.title}
//                                                 </Text>
//                                             </BlockStack>
//                                         </InlineStack>
//                                     </ResourceItem>
//                                 );
//                             }}
//                         />
//                     )}
//                 </Modal.Section>
//             </Modal>
//         </>
//     );
// }


