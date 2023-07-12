import {
    HIDDEN_PRODUCT_TAG,
    SHOPIFY_GRAPHQL_API_ENDPOINT,
    TAGS,
  } from "./constants";
  import { getProductsQuery } from "./querys/product";
  import { isShopifyError } from "./type-guards";
  
  import {
    Connection,
    Product,
    ShopifyProduct,
    ShopifyProductsOperation,
  } from "./types";
  
  const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
  const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
  const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
  
  type ExtractVariables<T> = T extends { variables: object }
    ? T["variables"]
    : never;
  
  export async function shopifyFetch<T>({
    cache = "force-cache",
    headers,
    query,
    tags,
    variables,
  }: {
    cache?: RequestCache;
    headers?: HeadersInit;
    query: string;
    tags?: string[];
    variables?: ExtractVariables<T>;
  }): Promise<{ status: number; body: T } | never> {
    try {
      const result = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": key,
          ...headers,
        },
        body: JSON.stringify({
          ...(query && { query }),
          ...(variables && { variables }),
        }),
        cache,
        ...(tags && { next: { tags } }),
      });
  
      const body = await result.json();
  
      if (body.errors) {
        throw body.errors[0];
      }
  
      return {
        status: result.status,
        body,
      };
    } catch (e) {
      if (isShopifyError(e)) {
        throw {
          status: e.status || 500,
          message: e.message,
          query,
        };
      }
  
      throw {
        error: e,
        query,
      };
    }
  }
  
  const removeEdgesAndNodes = (array: Connection<any>) => {
    return array.edges.map((edge) => edge?.node);
  };
  
  const reshapeProduct = (
    product: ShopifyProduct,
    filterHiddenProducts: boolean = true
  ) => {
    if (
      !product ||
      (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
    ) {
      return undefined;
    }
  
    const { images, variants, ...rest } = product;
  
    return {
      ...rest,
      images: removeEdgesAndNodes(images),
      variants: removeEdgesAndNodes(variants),
    };
  };
  
  const reshapeProducts = (products: ShopifyProduct[]) => {
    const reshapedProducts = [];
  
    for (const product of products) {
      if (product) {
        const reshapedProduct = reshapeProduct(product);
  
        if (reshapedProduct) {
          reshapedProducts.push(reshapedProduct);
        }
      }
    }
  
    return reshapedProducts;
  };
  
  export async function getProducts({
    query,
    reverse,
    sortKey,
  }: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]> {
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      tags: [TAGS.products],
      variables: {
        query,
        reverse,
        sortKey,
      },
    });
  
    return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
  }