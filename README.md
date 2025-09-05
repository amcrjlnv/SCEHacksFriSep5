# HackATeam

HackATeam is an AI-powered platform designed to help hackathon participants find their ideal teammates. It uses AI to match users based on their skills, interests, and availability, allowing them to focus on building innovative projects rather than searching for team members.

## Features

- **AI-Powered Matching:** Utilizes advanced algorithms to find the most compatible teammates.
- **Smart Compatibility:** Matches users with complementary skills and shared project interests.
- **Instant Results:** Provides potential teammate matches in seconds.

## Technologies Used

### Frontend

- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with shadcn/ui components
- **Routing:** React Router
- **Dependencies:** See `Frontend/package.json` for a full list.

### Backend

- **Framework:** FastAPI (Python)
- **Database:** MongoDB (optional)
- **AI:** Google Generative AI
- **Dependencies:** See `Backend/Requirements.txt` for a full list.

## Getting Started

### Prerequisites

- Node.js and npm (for Frontend)
- Python 3.8+ and pip (for Backend)
- MongoDB instance (optional)
- Google Generative AI API Key

### Frontend Setup

1.  Navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

### Backend Setup

1.  Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install the Python dependencies:
    ```bash
    pip install -r Requirements.txt
    ```
3.  Create a `.env` file and add your `MONGO_URI` and `GEMINI_API_KEY`:
    ```env
    MONGO_URI="your_mongodb_uri"
    GEMINI_API_KEY="your_gemini_api_key"
    ```
4.  Start the backend server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will be available at `http://localhost:8000`.
