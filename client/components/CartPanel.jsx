import { useEffect, useState } from "react";

const functionDescription = `
Call this function when a user wants to update their shopping cart.
`;

const sessionUpdate = {
  type: "session.update",
  session: {
    tools: [
      {
        type: "function",
        name: "update_cart",
        description: functionDescription,
        parameters: {
          type: "object",
          strict: true,
          properties: {
            action: {
              type: "string",
              enum: ["add", "remove", "clear"],
              description: "Action to perform on the cart",
            },
            product: {
              type: "object",
              properties: {
                sku: { type: "string" },
                name: { type: "string" },
                price: { type: "number" },
                quantity: { type: "number" },
              },
              required: ["sku", "name", "price", "quantity"],
            },
          },
          required: ["action"],
        },
      },
    ],
    tool_choice: "auto",
  },
};

function CartDisplay({ cart }) {
  const total = cart.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-md p-4 shadow-sm">
        <h3 className="font-bold mb-4">Shopping Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.sku} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="flex justify-between mt-4 pt-2 border-t font-bold">
              <p>Total:</p>
              <p>${total.toFixed(2)} USD</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CartPanel({ isSessionActive, sendClientEvent, events }) {
  const [functionAdded, setFunctionAdded] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!events || events.length === 0) return;

    const firstEvent = events[events.length - 1];
    if (!functionAdded && firstEvent.type === "session.created") {
      sendClientEvent(sessionUpdate);
      setFunctionAdded(true);
    }

    const mostRecentEvent = events[0];
    if (
      mostRecentEvent.type === "response.done" &&
      mostRecentEvent.response.output
    ) {
      mostRecentEvent.response.output.forEach((output) => {
        if (output.type === "function_call" && output.name === "update_cart") {
          const { action, product } = JSON.parse(output.arguments);
          
          if (action === "clear") {
            setCart([]);
          } else if (action === "add" && product) {
            setCart(prevCart => {
              const existingItem = prevCart.find(item => item.sku === product.sku);
              const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
              
              if (existingItem) {
                return prevCart.map(item => 
                  item.sku === product.sku 
                    ? { ...item, quantity: item.quantity + product.quantity }
                    : item
                );
              }
              return [...prevCart, {...product, price}];
            });
          } else if (action === "remove" && product) {
            setCart(prevCart => prevCart.filter(item => item.sku !== product.sku));
          }
        }
      });
    }
  }, [events]);

  useEffect(() => {
    if (!isSessionActive) {
      setFunctionAdded(false);
      setCart([]);
    }
  }, [isSessionActive]);

  return (
    <section className="h-full w-full flex flex-col gap-4">
      <div className="h-full bg-gray-50 rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Shopping Cart</h2>
        {isSessionActive ? (
          <CartDisplay cart={cart} />
        ) : (
          <p>Start the session to use the shopping cart...</p>
        )}
      </div>
    </section>
  );
}