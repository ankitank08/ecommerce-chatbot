// backend/index.js
const express = require("express");
const cors = require("cors");
const loadCSV = require("./utils/loadCSV");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let products = [];
let orders = [];

// Load products.csv and orders.csv from ../dataset (assumes dataset is one folder above backend)
function safeLoadCSV(filename, name) {
  const fullPath = path.join(__dirname, "..", "dataset", filename);
  console.log(`Loading ${name} from: ${fullPath}`);
  return loadCSV(fullPath);
}

safeLoadCSV("products.csv", "products")
  .then((data) => {
    products = data;
    console.log(`✅ Loaded ${products.length} products`);
  })
  .catch((err) => {
    console.error(`❌ Error loading products.csv:`, err);
  });

safeLoadCSV("orders.csv", "orders")
  .then((data) => {
    orders = data;
    console.log(`✅ Loaded ${orders.length} orders`);
  })
  .catch((err) => {
    console.error(`❌ Error loading orders.csv:`, err);
  });

// Home route
app.get("/", (req, res) => {
  res.send("🟢 Backend for Customer Support Chatbot is running!");
});

// 🔹 API: Top 5 most sold products
// Since orders.csv has no product reference, reply with explanatory message
app.get("/api/top-products", (req, res) => {
  res.json({ error: "Order data does not include product references. Cannot compute top products." });
});

// 🔹 API: Order status by order ID
app.get("/api/order-status/:id", (req, res) => {
  const orderId = req.params.id;
  const order = orders.find((o) => o.order_id === orderId);
  if (order) {
    return res.json({
      order_id: order.order_id,
      status: order.status,
    });
  } else {
    return res.status(404).json({ error: "Order not found" });
  }
});

// 🔹 API: Stock by product name (mocked based on fixed stock count 1000 minus total sold from orders, but here total sold cannot be calculated properly)
app.get("/api/stock", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Missing product name query parameter" });
  }
  const product = products.find((p) => p.name?.toLowerCase() === name.toLowerCase());
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  // Since orders have no product link, we cannot calculate totalSold accurately
  // Provide a dummy stock number for now
  const estimatedStock = 500; // fixed number as dummy
  return res.json({
    product_name: product.name,
    estimated_stock: estimatedStock,
  });
});

// 🔹 API: Chatbot route
app.post('/api/chat', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Invalid input." });
  }

  const lowerQuery = message.toLowerCase();

  // 1. Greeting
  if (lowerQuery.includes('hi') || lowerQuery.includes('hello')) {
    return res.json({ reply: "Hi! How can I help you today?" });
  }

  // 2. Top 5 most sold products - inform user of missing data
  if (lowerQuery.includes('top 5') || lowerQuery.includes('most sold')) {
    return res.json({
      reply: "Sorry, order data does not include product references, so I cannot provide top sold products at the moment."
    });
  }

  // 3. Order status
  const orderMatch = lowerQuery.match(/order id (\d+)/);
  if (orderMatch) {
    const orderId = orderMatch[1];
    const order = orders.find(o => o.order_id === orderId);
    if (order) {
      return res.json({
        reply: `The status of order ID ${orderId} is: ${order.status}`
      });
    } else {
      return res.json({
        reply: `Sorry, I couldn't find an order with ID ${orderId}.`
      });
    }
  }

  // 4. Product stock - improved regex matching
  let stockMatch = lowerQuery.match(/how many (.+?) (?:are left|in stock)/);
  if (!stockMatch) {
    stockMatch = lowerQuery.match(/how many (.+)/); // fallback to capture product name roughly
  }
  if (stockMatch) {
    const name = stockMatch[1].trim().toLowerCase();
    const product = products.find((p) => p.name?.toLowerCase().includes(name));
    if (product) {
      // Dummy stock value as we cannot derive from orders properly
      const estimatedStock = 500; 
      return res.json({
        reply: `There are approximately ${estimatedStock} ${product.name} left in stock.`,
      });
    } else {
      return res.json({
        reply: `I couldn’t find the product "${name}" in our inventory.`,
      });
    }
  }

  // 5. Default fallback
  return res.json({
    reply: "Sorry, I couldn't understand that. Try asking about order status or stock."
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});