# CFD Trading Platform

A production-ready Contract for Difference (CFD) trading platform built with modern technologies. This full-stack monorepo enables users to trade cryptocurrency CFDs with leverage, real-time price updates, and automated risk management including stop-loss, take-profit, and automatic liquidation.

The platform achieves sub-30ms trade execution latency through in-memory order processing. Trade requests flow from the web interface through the API server to Kafka, where the trading engine processes orders in-memory for instant execution. Database persistence happens asynchronously via background workers, ensuring high-performance trading while maintaining data consistency.

## Architecture

The platform follows a microservices architecture with clear separation of concerns:

- **Web Application**: Next.js frontend providing the trading interface
- **API Server**: Express.js REST API for user authentication and trade requests
- **Trading Engine**: High-performance order processing and risk management service
- **Price Poller**: Real-time price feed service connecting to external exchanges
- **Database Worker**: Background service for asynchronous database operations
- **Message Queue**: Apache Kafka for inter-service communication
- **Database**: PostgreSQL with Prisma ORM for data persistence

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TailwindCSS**: Utility-first CSS framework
- **Zustand**: State management
- **Lightweight Charts**: Trading chart visualization

### Backend
- **Bun**: JavaScript runtime and package manager
- **Express.js**: Web framework
- **Prisma ORM**: Database toolkit
- **PostgreSQL**: Relational database
- **Apache Kafka**: Distributed event streaming platform
- **WebSocket**: Real-time bidirectional communication

## Project Structure

```
cfd-platform/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   └── store/              # Zustand state management
│   ├── server/                 # Express.js API server
│   │   ├── src/
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── middlewares/   # Express middlewares
│   │   │   ├── routes/         # API route definitions
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   └── utils/          # Utility functions
│   ├── engine/                 # Trading engine service
│   │   └── src/
│   │       ├── service/        # Business logic services
│   │       └── Store/          # In-memory data stores
│   ├── price_poller/           # Price feed service
│   └── db_worker/              # Database worker service
├── packages/
│   ├── database/               # Prisma schema and client
│   │   └── prisma/             # Database migrations
│   ├── kafka-client/           # Kafka client utilities
│   ├── config-eslint/          # ESLint configuration
│   └── config-typescript/      # TypeScript configuration
└── docker-compose.yml          # Docker services configuration
```

## Features

### Trading Features
- **Long and Short Positions**: Trade both directions with leverage
- **Leverage Trading**: Configurable leverage for amplified positions
- **Real-time Price Updates**: Live market data via WebSocket connections
- **Order Management**: Open, close, and monitor positions
- **Stop Loss**: Automatic position closure at specified loss threshold
- **Take Profit**: Automatic position closure at specified profit target
- **Automatic Liquidation**: Margin call protection with automatic position closure
- **Position Tracking**: Real-time PnL calculation and position monitoring

### User Features
- **User Authentication**: JWT-based secure authentication
- **Account Management**: User registration and login
- **Balance Management**: Real-time balance updates with trade execution
- **Trade History**: View open and closed positions
- **Responsive UI**: Modern, responsive trading interface

### Technical Features
- **Event-Driven Architecture**: Kafka-based message queue for service communication
- **In-Memory Stores**: High-performance order and price management
- **Snapshot System**: State persistence and recovery
- **Asynchronous Processing**: Background workers for database operations
- **Type Safety**: End-to-end TypeScript implementation
- **Monorepo Structure**: Efficient development and build pipeline

## Database Schema

### User Model
- User identification and authentication
- Account balance tracking
- Last login timestamp
- Relationship to trades

### Asset Model
- Supported trading assets (BTC, ETH, SOL)
- Asset metadata (symbol, name, image, decimals)

### ExistingTrade Model
- Order type (long/short)
- Order status (open/closed/pending)
- Entry and exit prices
- Profit and loss calculation
- Leverage and margin information
- Stop loss and take profit levels
- Liquidation status

### Snapshot Model
- System state snapshots for recovery
- JSON data storage for flexible state management

## Services

### Web Application (`apps/web`)
The frontend Next.js application providing the trading interface. Features include:
- Trading dashboard with real-time charts
- Order placement interface
- Position management
- Asset selection sidebar
- Responsive resizable panels

### API Server (`apps/server`)
Express.js REST API handling:
- User authentication (signup, signin)
- Trade operations (open, close)
- Order queries (open orders, closed orders)
- Asset information
- JWT token validation

### Trading Engine (`apps/engine`)
Core trading logic service responsible for:
- Order validation and execution
- Margin calculation
- PnL computation
- Liquidation monitoring
- Stop loss and take profit execution
- User balance management
- Kafka message consumption and production

### Price Poller (`apps/price_poller`)
Real-time price feed service:
- WebSocket connection to external exchange (Backpack Exchange)
- Price normalization and processing
- Kafka price update publishing
- WebSocket server for frontend connections

### Database Worker (`apps/db_worker`)
Background service for:
- Asynchronous database writes
- Order persistence
- User balance updates
- Trade history storage

## Getting Started

### Prerequisites
- Node.js >= 18
- Bun >= 1.2.17
- Docker and Docker Compose
- PostgreSQL database
- Apache Kafka (or Docker Compose setup)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sincerelyyyash/cfd-platform.git
cd cfd-platform
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create `.env` files in the following locations:
- `packages/database/.env`
- `apps/web/.env`
- `apps/server/.env`

Required environment variables (local development):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cfd_platform"
SESSION_SECRET="your-secret-key"
KAFKA_BROKERS="localhost:9092"
WS_PORT=8080      # local WebSocket port
PORT=8000         # local API server port
```

> When running via Docker Compose, these values are provided by `docker-compose.yml`:
> - `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/cfd_platform`
> - `KAFKA_BROKERS=kafka:29092`
> - `PORT=3001` (API server)
> - `WS_PORT=3002` (price WebSocket)

4. Run database migrations (local development):
```bash
bun run db:migrate:dev
```

5. Seed the database (optional, local development):
```bash
bun run db:seed
```

6. Start all services in development mode (without Docker):
```bash
bun run dev
```

This will start all services concurrently using Turborepo.

### Running with Docker (backend services only)

This setup starts **PostgreSQL, Kafka (KRaft, no Zookeeper), migrations, API server, trading engine, price poller, and DB worker** in Docker.  
The web app (`apps/web`) is **not** started in Docker by design.

1. From the project root, build and start all services:
```bash
docker-compose up --build
```

This will:
- Start `postgres` and `kafka` (single-node KRaft)
- Run Prisma migrations once via the `migrate` service
- Start:
  - `server` (API) on `http://localhost:3001`
  - `price_poller` (WebSocket) on `ws://localhost:3002`
  - `engine`
  - `db_worker`

2. To run in the background:
```bash
docker-compose up -d --build
```

3. To stop everything:
```bash
docker-compose down
```

4. To stop and remove all data volumes (clean slate):
```bash
docker-compose down -v
```

5. To rebuild only the API server image (for API code changes):
```bash
docker-compose build server
docker-compose up -d server
```

### Individual Service Commands

Start services individually:

```bash
# Web application
cd apps/web && bun run dev

# API server
cd apps/server && bun run dev

# Trading engine
cd apps/engine && bun run dev

# Price poller
cd apps/price_poller && bun run dev

# Database worker
cd apps/db_worker && bun run dev
```

## Development

### Build
Build all packages and apps:
```bash
bun run build
```

### Linting
Run ESLint across all packages:
```bash
bun run lint
```

### Formatting
Format code with Prettier:
```bash
bun run format
```

### Database Commands
```bash
# Create and apply migration
bun run db:migrate:dev

# Deploy migrations (production)
bun run db:migrate:deploy

# Push schema changes (development)
bun run db:push

# Seed database
bun run db:seed
```

## API Endpoints

### Authentication
- `POST /api/v1/user/signup` - User registration
- `POST /api/v1/user/signin` - User login
- `GET /api/v1/user/me` - Get current user (protected)

### Trading
- `POST /api/v1/trade/open` - Open a new position (protected)
- `POST /api/v1/trade/close` - Close an existing position (protected)
- `GET /api/v1/trade/open-orders` - List open positions (protected)
- `GET /api/v1/trade/closed-orders` - List closed positions (protected)

### Assets
- `GET /api/v1/asset` - Get all available trading assets

## Trading Logic

### Order Types
- **Long**: Buy position expecting price increase
- **Short**: Sell position expecting price decrease

### Margin Calculation
- Margin = (Quantity × Entry Price) / Leverage
- Short positions require 110% of calculated margin

### PnL Calculation
Profit and Loss is calculated based on:
- Order type (long/short)
- Entry price vs current price
- Position quantity
- Leverage multiplier

### Liquidation
Positions are automatically liquidated when:
- Equity (margin + PnL) <= 0
- Stop loss price is reached
- Take profit price is reached

## WebSocket Protocol

The price poller service exposes a WebSocket server for real-time price updates:

- **Local dev (bun)**: `ws://localhost:8080`
- **Docker Compose**: `ws://localhost:3002`

Kafka connectivity in Docker:
- In-cluster services use `KAFKA_BROKERS=kafka:29092`.
- From the host, use the advertised listener `localhost:9092`.

**Message Format**:
```json
{
  "asset": "BTC",
  "price": 45000,
  "bid": 44950,
  "ask": 45050,
  "decimals": 4
}
```

## Kafka Topics

The platform uses the following Kafka topics:
- `trade_stream`: Price updates from price poller
- `trade`: Trade execution requests and responses
- `db`: Database operation requests
- `user`: User-related operations

## State Management

### In-Memory Stores
The trading engine maintains in-memory stores for:
- **OrderStore**: Active orders and positions
- **PriceStore**: Latest asset prices
- **UserStore**: User balances and account information

### Snapshot System
Periodic snapshots are taken to enable:
- System recovery after restart
- State persistence
- Data consistency

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with Zod
- Protected API routes

## Performance Considerations

- In-memory stores for low-latency order processing
- Asynchronous database operations via workers
- Event-driven architecture for scalability
- Efficient decimal arithmetic for financial calculations
- WebSocket connections for real-time updates

## Decimal Precision

The platform uses fixed-point arithmetic for financial calculations:
- **Balance**: 2 decimal places (multiplier: 100)
- **Price**: 4 decimal places (multiplier: 10,000)
- **Quantity**: 4 decimal places (multiplier: 10,000)

