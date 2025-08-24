# IstinyeGo 🚌

**A comprehensive university shuttle booking and management system - Graduation Project**

IstinyeGo is a full-stack mobile application designed to streamline university transportation services. This project serves as a graduation project, providing students, drivers, and administrators with an efficient platform to manage shuttle bookings, routes, and transportation logistics.

## 📱 Project Overview

IstinyeGo is a digital solution for university shuttle management that connects students with available transportation options. The system enables real-time booking, route tracking, and administrative oversight of the entire shuttle network.

### Key Features

- **Student Portal**: Book shuttle rides, view favorite routes, manage wallet balance
- **Driver Interface**: Manage assigned shuttles, view trip schedules
- **Admin Dashboard**: Oversee users, routes, shuttles, and system analytics
- **Real-time Booking**: Instant shuttle reservation system
- **Wallet System**: Digital payment and balance management
- **Route Management**: Dynamic route planning and optimization
- **User Authentication**: Secure login with email verification
- **Location Services**: GPS-based tracking and navigation

## 🛠️ Technology Stack

### Frontend (Mobile App)
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **React Navigation** - Navigation library
- **React Native Maps** - Map integration and directions
- **Axios** - HTTP client for API communication

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service integration

### Development Tools
- **ts-node-dev** - TypeScript development server
- **Prettier** - Code formatting
- **ESLint** - Code linting (implied)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- MongoDB (local or cloud instance)
- Expo CLI (for mobile development)
- Android Studio/Xcode (for device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HishamElhamayel/istinyego.git
   cd istinyego
   ```

2. **Setup Backend Server**
   ```bash
   cd server
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the server directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   MAILTRAP_USER=your_mailtrap_username
   MAILTRAP_PASS=your_mailtrap_password
   VERIFICATION_EMAIL=your_verification_email
   PASSWORD_RESET_LINK=your_password_reset_link
   SIGN_IN_URL=your_sign_in_url
   PORT=8989
   ```

4. **Start the Backend Server**
   ```bash
   npm run dev
   ```

5. **Setup Mobile Client**
   ```bash
   cd ../client
   npm install
   ```

6. **Start the Mobile App**
   ```bash
   npm start
   # or
   expo start
   ```

### Running on Devices

- **Android**: `npm run android` or use Expo Go app
- **iOS**: `npm run ios` or use Expo Go app
- **Web**: `npm run web`

## 📁 Project Structure

```
istinyego/
├── client/                 # React Native mobile application
│   ├── app/               # Main application code
│   │   ├── components/    # Reusable UI components
│   │   ├── views/         # Screen components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Redux store and slices
│   │   ├── navigator/     # Navigation configuration
│   │   └── API/           # API service functions
│   ├── assets/            # Images, fonts, and static assets
│   └── package.json       # Dependencies and scripts
│
├── server/                # Node.js/Express backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # MongoDB/Mongoose models
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions
│   │   ├── db/            # Database configuration
│   │   └── public/        # Static files
│   └── package.json       # Dependencies and scripts
│
└── README.md              # Project documentation
```

## 🎯 Core Functionality

### User Roles

1. **Students**: 
   - Browse and book available shuttle routes
   - Manage personal wallet and payment methods
   - View booking history and upcoming trips
   - Save favorite routes for quick access

2. **Drivers**:
   - View assigned shuttle and schedule
   - Manage trip status and passenger information
   - Access route details and navigation

3. **Administrators**:
   - Oversee all users, shuttles, and routes
   - Manage system settings and configurations
   - Monitor booking analytics and reports
   - Handle user verification and support

### API Endpoints

The backend provides RESTful APIs for:
- `/auth` - User authentication and registration
- `/booking` - Shuttle booking management
- `/route` - Route information and management
- `/shuttle` - Shuttle fleet management
- `/trip` - Trip scheduling and tracking
- `/wallet` - Digital wallet operations
- `/admin` - Administrative functions
- `/profile` - User profile management

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email verification system
- Role-based access control
- Secure password reset functionality

## 📧 Email Integration

The system includes automated email services for:
- Account verification
- Password reset requests
- Booking confirmations
- System notifications

## 🗂️ Database Schema

The MongoDB database includes collections for:
- Users (students, drivers, admins)
- Shuttles and vehicle information
- Routes and location data
- Bookings and reservations
- Wallet transactions
- Authentication tokens

## 🎓 Academic Context

This project was developed as a graduation project to demonstrate proficiency in:
- Full-stack web and mobile development
- Database design and management
- User experience and interface design
- Real-time systems and location services
- Authentication and security implementation
- API design and integration

## 🤝 Contributing

This is a graduation project, but contributions and suggestions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is developed as an academic graduation project. Please contact the author for any usage permissions.

## 👨‍💻 Author

**Hisham Elhamayel**
- GitHub: [@HishamElhamayel](https://github.com/HishamElhamayel)

## 🙏 Acknowledgments

- University faculty and advisors
- React Native and Expo communities
- Open source contributors and maintainers
- Fellow students and project collaborators

---

*This project represents the culmination of academic learning in software engineering and mobile application development.*