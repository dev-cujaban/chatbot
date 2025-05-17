# 🧠 Chatbot

A simple AI chatbot using OpenAI and currency conversion with Open Exchange Rates.

---

## 📦 Prerequisites

- Node.js: v22.14.0
- Yarn: v1.22.22

## 🔧 Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Configure environment variables:
   - Copy .env_example to .env
   - Fill in the required values

## 🔑 API Keys

### 🧠 OpenAI

- Go to https://platform.openai.com/api-keys and sign in
- Click Create new secret key
- (Optional) Name it, ensure it has full permissions
- Copy the generated key
- Paste it in your .env file as OPENAI_API_KEY

### 💱 Open Exchange Rates

- Sign up for a free account at https://openexchangerates.org/signup/free
- Verify your email
- Find your App ID
- Copy and paste it in your .env file as OPEN_EXCHANGE_APP_ID

### 🚀 Running the Project

From the root directory:

```bash
# Start frontend (http://localhost:5173)
yarn dev:frontend

# Start backend (http://localhost:3000)
yarn dev:backend

```

### 🧪 Testing the Chat Endpoint

Once the backend is running, you can test the chatbot using Postman or curl.

```bash
curl --location 'http://localhost:3000/chat' \
--header 'Content-Type: application/json' \
--data '{
    "message": "" // Example. convert 500 colombian pesos to euros
}'
```

```bash
curl --location 'http://localhost:3000/chat' \
--header 'Content-Type: application/json' \
--data '{
    "message": "" // Example. I am looking for a phone, what do you have in the catalog?
}'
```
