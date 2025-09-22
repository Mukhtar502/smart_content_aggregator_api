# Smart Content Aggregator API

A simple yet powerful content recommendation system built with Node.js, TypeScript, and MongoDB.

## What This Project Does

This API helps users discover articles they might like based on their interests. Users can create profiles, browse articles, and get personalized recommendations. It is like a simple version of what you would find on platforms like Medium or Reddit.

## Quick Start

### What You Need First

Make sure you have these installed on your computer:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/downloads)

### Setting Up the Project

1. **Clone or download this project**

   on bash
   git clone <your-repo-url>
   cd smart_content_aggregator_api

2. **Install the required packages**

   on bash
   npm install

3. **Set up your database connection**

   - Create a file called `.env` in the main folder
   - Add this line (replace with your MongoDB connection):

   DATABASE_URL=mongodb://localhost:27017/content_aggregator

4. **Build and start the server**

   ```bash
   npm run build
   npm start
   ```

   For development (with auto-reload):

   ```bash
   npm run dev
   ```

5. **Check if it is working**
   - Open your browser and go to: http://localhost:8005/health
   - You should see: `{"ok": true}`

## How to Use the API

### Create a New User

```bash
curl -X POST http://localhost:8005/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "interests": ["technology", "sports"]}'
```

### Create an Article

```bash
curl -X POST http://localhost:8005/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "Tech News", "content": "Latest updates...", "author": "writer", "tags": ["technology"]}'
```

### Get All Articles

```bash
curl "http://localhost:8005/api/articles?limit=10&offset=0"
```

### Get One Article

```bash
curl "http://localhost:8005/api/articles/ARTICLE_ID_HERE"
```

### Record User Interaction

```bash
curl -X POST http://localhost:8005/api/interactions \
  -H "Content-Type: application/json" \
  -d '{"user_id": "USER_ID", "article_id": "ARTICLE_ID", "interaction_type": "view"}'
```

### Get Personalized Recommendations

```bash
curl "http://localhost:8005/api/recommendations/USER_ID_HERE"
```

## Available Endpoints

| Method | Endpoint                        | What It Does                              |
| ------ | ------------------------------- | ----------------------------------------- |
| POST   | `/api/users`                    | Creates a new user account                |
| POST   | `/api/articles`                 | Adds a new article                        |
| GET    | `/api/articles`                 | Gets list of articles (with pagination)   |
| GET    | `/api/articles/:id`             | Gets one specific article                 |
| POST   | `/api/interactions`             | Records when user views/likes an article  |
| GET    | `/api/recommendations/:user_id` | Gets personalized article recommendations |
| GET    | `/health`                       | Checks if the server is running           |

## Technology Choices

### Why I Chose These Tools

**TypeScript + Node.js + Express**

- TypeScript catches errors early and makes code easier to understand
- Express is simple and widely used for building APIs
- Node.js is fast and great for handling many users at once

**MongoDB (NoSQL Database)**

- Perfect for storing articles and user data that can vary in structure
- Easy to scale as the app grows
- Great for storing arrays (like user interests and article tags)

**Project Structure**

```
src/
├── models/          # Database schemas (User, Article, Interaction)
├── controllers/     # Business logic for each endpoint
├── routes/          # URL routing and endpoint definitions
├── middlewares/     # Error handling and other middleware
├── app.ts          # Main application setup
└── server.ts       # Server startup
```

## How the Recommendation System Works

### My Simple But Effective Approach

I built a rule-based recommendation system that works in two steps:

1. **Interest Matching**

   - Look at what topics the user is interested in (like "technology" or "sports")
   - Find articles that have matching tags
   - Show these first because they're most relevant

2. **Popular Articles Fallback**
   - If we need more recommendations, find articles that other users interact with most
   - Skip articles the user has already seen
   - This helps users discover trending content

### Why This Works Well

- **Fast**: No complex calculations needed
- **Accurate**: Matches exactly what users said they like
- **Discoverable**: Includes popular content they might not know about
- **Avoids Repeats**: Will not recommend articles they have already seen

### Example Flow

1. User "john" likes "technology" and "sports"
2. System finds articles tagged with "technology" or "sports"
3. If not enough found, adds popular articles from other categories
4. Returns up to 10 recommendations with reasons ("matches your interests" or "popular with other users")

## What I Would Add Next

If I had more time, here is what I would improve:

### Better Features

- **User Authentication**: Login system with passwords and sessions
- **Better Search**: Search articles by title, content, or tags
- **User Profiles**: Let users update their interests and see their reading history
- **Article Categories**: Organize articles into clear categories
- **Commenting System**: Let users discuss articles

### Technical Improvements

- **Automated Testing**: Write tests to catch bugs before they happen
- **Better Error Handling**: More specific error messages and logging
- **Rate Limiting**: Prevent users from making too many requests too quickly
- **Caching**: Store frequently-requested data to make responses faster
- **Advanced Recommendations**: Use machine learning for smarter suggestions

### Production Ready Features

- **Docker Setup**: Make it easy to deploy anywhere
- **Environment Configs**: Separate settings for development and production
- **Database Backups**: Automatically backup user data
- **Monitoring**: Track how well the API is performing
- **Documentation**: Interactive API documentation with examples

## Testing the API

### Manual Testing Options

You can test the API using any of these tools:

**Option 1: Postman (Recommended)**

- Download Postman from https://www.postman.com/
- Import our endpoints or create requests manually
- Easy to save and organize your test requests
- Great visual interface for seeing responses

**Option 2: curl (Command line)**

- Use the curl examples shown above
- Good for quick testing and automation
- Works directly from your terminal

### API Documentation (Future Enhancement)

**Swagger/OpenAPI Documentation**
I could have added interactive API documentation with Swagger, but due to the 72-hour time limit, I focused on core functionality first. This would include:

```bash
npm install swagger-jsdoc swagger-ui-express
# Add interactive API docs at /api-docs
```

Benefits of Swagger documentation:

- Interactive "try it out" buttons for each endpoint
- Automatic request/response examples
- Clear parameter descriptions and validation rules
- Easy sharing with frontend developers or API users

### Automated Testing (Future Enhancement)

To add proper automated tests later:

```bash
npm install --save-dev jest @types/jest supertest
npm run test
```

## Common Issues

**Server will not start?**

- Make sure MongoDB is running
- Check if port 8005 is already in use
- Verify your `.env` file has the correct database URL

**Cannot connect to database?**

- Make sure MongoDB is installed and running
- Check your connection string in `.env`
- Make sure the database name exists

**Getting "user not found" errors?**

- Make sure you are using the correct user ID from the user creation response
- User IDs are long strings like "60f7c2b8e1d2a3b4c5d6e7f8"

## Project Stats

- **Language**: TypeScript
- **Runtime**: Node.js
- **Database**: MongoDB
- **API Style**: RESTful
- **Code Quality**: ESLint + Prettier
- **Development Time**: Built to meet 72-hour assessment timeline

---

**Built by**: Efunkunle Mukhtar
**Date**: September 2025  
**Purpose**: Backend Developer Assessment Project
