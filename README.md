# Review Scraper Backend

A Node.js + Express backend API that scrapes product reviews from G2, Capterra, and TrustRadius. Returns structured JSON data with support for company search, date filtering, and multiple review sources.

## 🚀 Features

- **Multi-source Scraping**: G2, Capterra, and TrustRadius support
- **Date Filtering**: Filter reviews by specific date ranges
- **RESTful API**: Clean JSON API endpoints
- **Input Validation**: Robust error handling and parameter validation
- **Modular Architecture**: Well-structured, maintainable code
- **Mock Data Implementation**: Reliable demonstration without violating terms of service

## 📁 Project Structure
backend/
├── services/
│ ├── g2.js # G2 scraper implementation
│ ├── capterra.js # Capterra scraper implementation
│ ├── trustradius.js # TrustRadius scraper (third source - bonus)
│ └── mockScraper.js # Mock data for demonstration
├── utils/
│ ├── search.js # DuckDuckGo search helper
│ └── dateFilter.js # Date parsing and filtering
├── routes/
│ └── reviews.js # API routes
├── server.js # Express server
└── package.json # Dependencies and scripts


## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Quick Start

1. **Navigate to backend directory**:
   ```bash
   cd backend
2. **Install dependencies**:
    ```bash
    npm install

3. **Start the server**:
    ```bash
    npm run dev   
# or
npm start 


4 . **Server runs on**: http://localhost:5000

### 📡  API Documentation
## POST /api/reviews
Scrape reviews from specified source with optional filtering.

# Request Body:

    ```json
    {
        "company": "Slack",
        "companyUrl": "https://www.g2.com/product/slack/reviews", // Optional
        "startDate": "2024-01-01", // Optional
        "endDate": "2024-12-31",   // Optional
        "source": "g2"    // Required: g2 | capterra | trustradius
    }


***Success Response (200)***:

    ```json
{
  "count": 5,
  "reviews": [
    {
      "title": "Excellent product for team collaboration",
      "review": "We've been using this product for over a year...",
      "date": "2024-06-15T00:00:00.000Z",
      "rating": 4.5,
      "reviewer": "John Doe",
      "source": "g2",
      "url": "https://www.g2.com/products/slack/reviews"
    }
  ]
}

### 🎯 Usage Examples 
## Using curl
```bash

# Basic request with company name
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Slack",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "source": "g2"
  }'

# Request with direct URL
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "companyUrl": "https://www.g2.com/products/slack/reviews",
    "source": "g2"
  }'


### 🌟 Third Source: TrustRadius (Bonus)
Successfully integrated TrustRadius as the third     

**review source with full functionality**:

TrustRadius Usage:

bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Salesforce",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "source": "trustradius"
  }'

### 🔧 Development
Scripts:

npm start - Start production server

npm run dev - Start development server with nodemon

Dependencies:

Express.js - Web server framework

Axios - HTTP client

Cheerio - HTML parsing

Date-fns - Date manipulation

CORS - Cross-origin resource sharing


## 🧑‍💻 Author

**Sharath Chandra Akkaldevi**

---

## 📝 License

This project is part of a technical assignment and is intended for educational/demo purposes.
