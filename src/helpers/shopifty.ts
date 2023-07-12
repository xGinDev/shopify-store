// helpers/shopify.js

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN;

export async function callShopify(query: any, variables = {}) {
  const fetchUrl = `https://${domain}/api/2023-04/graphql.json`;

  console.log(fetchUrl, " fetch url");

  const fetchOptions: any = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json()
    );
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Could not fetch products!");
  }
}

const gql = String.raw;

export const AllProducts = gql`
  query Products {
    products(first: 22) {
      edges {
        node {
          id
          title
          handle
          images(first: 10) {
            edges {
              node {
                url
                width
                height
              }
            }
          }
          priceRange {
            maxVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
`;
