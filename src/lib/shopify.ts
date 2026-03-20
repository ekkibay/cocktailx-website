import Client from "shopify-buy";

const client = Client.buildClient({
  domain: "cocktail-x.myshopify.com",
  storefrontAccessToken: "placeholder-token",
  apiVersion: "2024-01",
});

export default client;

export async function getProducts() {
  const products = await client.product.fetchAll();
  return products;
}
