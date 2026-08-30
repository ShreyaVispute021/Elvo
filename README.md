# 📈 Elvo

### Modern Fintech Platform for Portfolio Tracking & Paper Trading

**Elvo** is a full-stack fintech web application that combines **portfolio management, paper trading, stock analysis, watchlists, and market data** into a modern investment platform.

Built with a focus on **clean architecture, real-time market data, and premium fintech UI**, Elvo is designed to feel more like a real financial product than a traditional CRUD application.

---

## ✨ Features

* 🔐 **Authentication** — Secure registration, login, logout & sessions
* 💼 **Portfolio Management** — Add, edit, delete and track investments
* 💹 **Paper Trading** — Simulated BUY & SELL with wallet management
* 📊 **Portfolio Analytics** — Investment, current value & P/L calculations
* 📈 **Stock Analysis** — Search stocks and view market information
* ⭐ **Watchlist** — Track stocks you're interested in
* 🧾 **Transaction History** — Complete BUY/SELL trading history
* 📉 **Market Movers** — Top gainers and losers
* 📊 **Interactive Charts** — Visualize portfolio and market data
* 🌙 **Modern Dark UI** — Responsive fintech-inspired interface

---

## 🛠️ Tech Stack

**Frontend**

`EJS` `Bootstrap 5` `JavaScript` `Chart.js` `CSS3`

**Backend**

`Node.js` `Express.js` `REST APIs`

**Database**

`MongoDB` `Mongoose` `MongoDB Atlas`

**Authentication**

`bcryptjs` `express-session` `connect-mongo`

**Market Data**

`yahoo-finance2`

**Deployment**

`Render` `GitHub`

---

## 🏗️ Architecture

Elvo follows a layered architecture:

```text
Routes
   ↓
Controllers
   ↓
Services / Utils
   ↓
Models
   ↓
MongoDB
```

External market data is integrated through Yahoo Finance.

This separation keeps routing, business logic, and database operations modular and maintainable.

---

## 📁 Project Structure

```text
Elvo/
│
├── controllers/
├── models/
├── routes/
├── services/
├── utils/
│   ├── yahooService.js
│   ├── marketHelper.js
│   └── portfolioHelper.js
│
├── views/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── app.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Elvo.git
cd Elvo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
```

### 4. Start the application

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

## 🔮 Future Roadmap

* 📊 Portfolio performance timeline
* 🥧 Sector allocation
* 🎯 Portfolio health & risk analysis
* 🤖 AI-powered investment insights
* 🔔 Smart watchlist alerts
* 📰 Market news
* 📄 PDF portfolio reports
* 🚀 Production deployment

---

## ⚠️ Disclaimer

Elvo is an **educational paper-trading project**. It does not execute real stock-market trades and does not provide financial advice.

---

## 👨‍💻 Author

**Shreya Vispute**

---

⭐ **If you found Elvo interesting, consider starring the repository!**
