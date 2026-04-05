# Mars Rover Grid Simulator

A full-stack JavaScript application for simulating a Mars Rover navigating a configurable grid.

## Project Structure

```
Rover/
├── client/               # React frontend (Create React App)
│   ├── public/
│   └── src/
│       └── components/   # GridSetup and future feature components
├── server/               # Node.js + Express backend
│   ├── index.js
│   └── __tests__/
├── package.json          # Root scripts (dev, test)
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** v7 or higher

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Jeffrey460/Rover.git
   cd Rover
   ```

2. Install root dependencies (provides `concurrently`):

   ```bash
   npm install
   ```

3. Install server dependencies:

   ```bash
   npm install --prefix server
   ```

4. Install client dependencies:

   ```bash
   npm install --prefix client
   ```

### Running the Application

Start both the React frontend and Express backend concurrently in development mode:

```bash
npm run dev
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |

## API Endpoints

| Method | Path         | Description                  | Response            |
|--------|--------------|------------------------------|---------------------|
| GET    | /api/health  | Server health check          | `{ status: "ok" }`  |

## Running Tests

| Command                | Description                          |
|------------------------|--------------------------------------|
| `npm test`             | Runs all server **and** client tests |
| `npm run test:server`  | Runs server tests with Jest          |
| `npm run test:client`  | Runs client tests with Jest + RTL    |

## Features

- **Grid Size Setup** — Enter a grid size in plain English (e.g. *"5 by 5"*), get instant validation and confirmation.
- Production build of the React app is served statically by the Express server.

## License

MIT

