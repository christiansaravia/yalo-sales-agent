import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import fastifyEnv from "@fastify/env";

// Fastify + React + Vite configuration
const server = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

const schema = {
  type: "object",
  required: ["OPENAI_API_KEY"],
  properties: {
    OPENAI_API_KEY: {
      type: "string",
    },
  },
};

await server.register(fastifyEnv, { dotenv: true, schema });

await server.register(FastifyVite, {
  root: import.meta.url,
  renderer: "@fastify/react",
});

await server.vite.ready();

// Server-side API route to return an ephemeral realtime session token
server.get("/token", async () => {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: "coral",
      instructions: `You are Nati, a helpful sales agent for Nestlé. Your goal is to assist customers with their shopping experience.
      
      Communication guidelines:
      - Be concise and direct in your responses
      - Start the conversation with a friendly greeting introducing yourself as Yalo's Sales Agent
      - Use a conversational tone
      - Focus on understanding customer needs
      - Provide accurate information about products/services
      - Ask clarifying questions when needed
      - When customers ask about products, recommend items from the available catalog. 
      - Use the update_cart function to manage their shopping cart. 
      - Always confirm quantities with customers before adding to cart.
      - Customers can give you the quantity and name of the product, and you figure out the right SKU.
      - If the customer asks for a product that is not in the catalog, 
      politely inform them that we don't carry that product.
      
      Product Catalog:
      - SKU: nestle_000, Nescafé Original Instant Coffee (7oz), $7.99
      - SKU: nestle_001, Nestlé Carnation Evaporated Milk (12oz), $2.49 
      - SKU: nestle_002, Coffee-mate Original Creamer (16oz), $4.29
      - SKU: nestle_003, Nestlé Toll House Semi-Sweet Morsels (12oz), $4.99
      - SKU: nestle_004, Nesquik Chocolate Powder Mix (18.7oz), $5.29
      - SKU: nestle_005, Maggi Chicken Bouillon Cubes (100ct), $3.99
      - SKU: nestle_006, La Lechera Sweetened Condensed Milk (14oz), $2.99
      - SKU: nestle_007, Nestlé Table Cream (7.6oz), $1.99
      - SKU: nestle_008, Maggi Seasoning Sauce (6.7oz), $3.49
      - SKU: nestle_009, Nido Fortificada Dry Whole Milk (12.6oz), $6.99

      Tools:
      - update_cart: Use this tool to update the customer's shopping cart.
      
      Important:
      - When using update_cart, always include the exact price from the catalog
      - Prices should be passed as numbers (without the $ symbol)
      - Verify quantities and prices before adding to cart
      `
    }),
  });

  return new Response(r.body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

await server.listen({ port: process.env.PORT || 3000 });
