# Ecommerce Chatbot

A simple customer support chatbot backend and frontend for an e-commerce app.  
This chatbot leverages product and order data from CSV files to respond to user queries about order status, stock levels, and greetings.

---


---

## Setup & Run

### Backend
1. Navigate to backend folder:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the backend server:
    ```bash
    npm start
    ```
   Backend runs on [http://localhost:5000](http://localhost:5000)

Make sure your CSV files (`products.csv`, `orders.csv`, and `users.csv`) exist in the `ecommerce-chatbot/dataset/` folder (one level above backend).

---

### Frontend
1. Navigate to frontend folder:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the frontend React app:
    ```bash
    npm start
    ```
   Frontend runs on [http://localhost:3000](http://localhost:3000)

---

## Chatbot Capabilities

### Supported Question Types

The chatbot currently supports the following types of questions:

#### 1. Greetings
- *Examples:*  
  - "Hi"  
  - "Hello"  
  - "Hey there"

#### 2. Order Status by Order ID
- The chatbot looks up an order's status if you provide an order ID.
- *Examples:*  
  - "What is the status of order ID 12345?"  
  - "Tell me the status of order ID 8"  
  - "Order id 99999 status?"

#### 3. Product Stock Queries
- The chatbot estimates stock levels based on a fixed stock value since orders do **not** include product references.
- *Examples:*  
  - "How many Classic T-Shirts are left in stock?"  
  - "How many Low Profile Dyed Cotton Twill Cap are in stock?"  
  - "How many jackets are left?"

---

### Not Supported / Limitations

#### 1. Top 5 Most Sold Products
- Currently, the chatbot **cannot** provide accurate top-selling products.
- **Reason:** The `orders.csv` data does not contain product references, so orders can't be linked to products.
- The chatbot responds with an apology informing you of this limitation.
- *Example question:* "What are the top 5 most sold products?"

#### 2. Detailed Product-Order Relations
- Cannot map orders to specific products or calculate sales per product.

#### 3. Unsupported or Ambiguous Queries
- Chatbot gives a default fallback reply for anything outside its supported query types.
- *Examples:*  
  - "Tell me a joke"  
  - "Can you dance?"  
  - "Do you have discounts today?"

---

## Known Improvements / Future Work

- **Add product references in orders data:** To enable top-selling products and real stock availability calculations.
- **Enhance Natural Language Understanding:** Improve regex and add NLP to interpret more query variations.
- **Add user authentication and personalized order lookup**
- **Support multi-product orders**

---

## Troubleshooting

- If you get errors about missing CSV files, verify your `dataset` folder is at `ecommerce-chatbot/dataset/` and contains the required `.csv` files.
- Ensure frontend sends requests with `{ message: "your question" }` payload to the backend `/api/chat` endpoint.

---

## Contact

For questions or help, please open an issue in the GitHub repository.

---
