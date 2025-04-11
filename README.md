# Smart Vyapar - Complete Business Management Solution

A comprehensive business management system that includes invoicing, inventory management, and customer relationship management.

## Project Structure

```
smart-vyapar/
├── backend/           # Node.js + Express backend
├── frontend/          # React.js frontend
└── mobile/           # React Native mobile app
```

## Features

- 🔐 User Authentication & Authorization
- 📊 Dashboard & Analytics
- 📝 Invoice Management
- 📦 Inventory Control
- 👥 Customer Management
- 💰 Payment Processing
- 📱 Mobile Application
- 🔔 Real-time Notifications

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Socket.IO

### Frontend
- React.js
- Redux
- Material-UI
- Socket.IO Client

### Mobile
- React Native
- Redux
- Native Base

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/smart-vyapar.git
cd smart-vyapar
```

2. Install Backend Dependencies
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
cp .env.example .env
# Configure your .env file
npm start
```

4. Install Mobile Dependencies
```bash
cd ../mobile
npm install
cp .env.example .env
# Configure your .env file
npm start
```

## Environment Variables

Create .env files in both backend and frontend directories. Example variables:

### Backend
```
NODE_ENV=development
PORT=3000
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
```

### Frontend
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SOCKET_URL=http://localhost:3000
```

## API Documentation

API documentation is available at `/api-docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 