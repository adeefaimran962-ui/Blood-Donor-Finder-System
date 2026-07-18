# Blood Donor Finder System

A comprehensive web application for connecting blood donors with those in need. Built with modern web technologies to provide a seamless experience for blood donation management, donor search, and blood request tracking.

## Tech Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript, EJS Template Engine
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: express-session, bcryptjs
- **Flash Messages**: connect-flash
- **Development**: nodemon

## Features

### User Features
- **User Registration & Authentication**: Secure sign-up and login with bcrypt password hashing
- **User Profile Management**: View and edit profile information, change password
- **Donor Registration**: Users can register as blood donors with detailed profiles
- **Blood Donor Search**: Search for donors by blood group and city
- **Blood Request Creation**: Submit blood requests for patients in need
- **Request Tracking**: View and manage personal blood requests
- **User Dashboard**: Overview of statistics, recent requests, and quick actions

### Admin Features
- **Admin Dashboard**: Comprehensive overview with statistics and recent activity
- **User Management**: View all users, toggle admin status, delete users
- **Donor Management**: View and manage all donor profiles
- **Blood Request Management**: View, update status (Pending/Approved/Completed), and delete requests
- **Admin Authentication**: Protected admin routes with role-based access control

### UI/UX Features
- **Professional Responsive Design**: Bootstrap 5 based modern interface
- **Red & White Theme**: Consistent healthcare-themed color scheme
- **Font Awesome Icons**: Intuitive iconography throughout the application
- **Google Poppins Font**: Clean, modern typography
- **Smooth Animations**: Hover effects and transitions for enhanced user experience
- **Mobile-Friendly**: Fully responsive across desktop, tablet, and mobile devices
- **Custom 404 Page**: Beautiful error page with navigation back to home
- **Flash Messages**: User-friendly success and error notifications
- **Form Validation**: Client-side and server-side validation for all forms

### Security Features
- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: Secure express-session with configurable expiration
- **Route Protection**: Authentication middleware for protected routes
- **Admin Access Control**: Role-based access for admin-only features
- **Input Validation**: Comprehensive validation on all user inputs
- **Error Handling**: Global error handling to prevent application crashes

### Database Features
- **MongoDB Integration**: NoSQL database for flexible data storage
- **Mongoose Models**: Structured schemas with validation
- **Database Indexes**: Optimized queries with proper indexing
- **Relationship Management**: References between users, donors, and requests

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/blood_donor_finder
   SESSION_SECRET=your_secret_key_here
   ```

4. Start MongoDB server

5. Run the application:
   ```bash
   npm run dev
   ```

6. Open browser and navigate to `http://localhost:3000`

## Project Structure

```
blood-donor-finder/
├── app.js                      # Main application file
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
├── config/
│   └── db.js                  # MongoDB connection configuration
├── controllers/               # Route controllers
│   ├── authController.js      # Authentication logic
│   ├── donorController.js     # Donor management logic
│   ├── bloodRequestController.js  # Blood request logic
│   ├── adminController.js     # Admin dashboard logic
│   └── profileController.js   # User profile logic
├── middleware/                # Custom middleware
│   └── auth.js                # Authentication & authorization middleware
├── models/                    # Mongoose models
│   ├── User.js                # User schema
│   ├── Donor.js               # Donor schema
│   └── BloodRequest.js        # Blood request schema
├── routes/                    # Route definitions
│   ├── index.js               # Home page routes
│   ├── auth.js                # Authentication routes
│   ├── donor.js               # Donor management routes
│   ├── bloodRequest.js        # Blood request routes
│   ├── admin.js               # Admin routes
│   └── profile.js             # Profile routes
├── public/
│   ├── css/
│   │   └── style.css          # Custom styles
│   ├── js/
│   │   └── script.js          # Client-side JavaScript
│   └── images/                # Static images
└── views/                     # EJS templates
    ├── index.ejs              # Home page
    ├── register.ejs           # Registration page
    ├── login.ejs              # Login page
    ├── dashboard.ejs          # User dashboard
    ├── become-donor.ejs       # Donor registration form
    ├── search-donors.ejs      # Donor search page
    ├── blood-request.ejs      # Blood request form
    ├── my-requests.ejs        # User's blood requests
    ├── profile.ejs            # User profile page
    ├── change-password.ejs    # Change password page
    ├── 404.ejs                # Custom 404 page
    ├── admin/                 # Admin views
    │   ├── dashboard.ejs      # Admin dashboard
    │   ├── users.ejs          # User management
    │   ├── donors.ejs         # Donor management
    │   └── requests.ejs       # Blood request management
    └── partials/              # Reusable components
        ├── header.ejs         # Header component
        └── footer.ejs         # Footer component
```

## Scripts

- `npm start` - Start the application in production mode
- `npm run dev` - Start the application with nodemon for development

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - Secret key for session encryption
- `NODE_ENV` - Environment (development/production)

## Setting Up Admin Access

To create an admin user, you need to manually set the `isAdmin` field to `true` in the MongoDB database for a user. This can be done using MongoDB Compass or the MongoDB shell:

```javascript
// Using MongoDB shell
use blood_donor_finder
db.users.updateOne({ email: "admin@example.com" }, { $set: { isAdmin: true } })
```

## Screenshots

### Home Page
![Home Page](screenshots/home.png)
- Professional hero section with call-to-action
- Navigation menu with authentication state
- Feature highlights

### User Dashboard
![User Dashboard](screenshots/dashboard.png)
- Statistics overview
- Quick action buttons
- Recent blood requests table

### Donor Search
![Donor Search](screenshots/search-donors.png)
- Search by blood group and city
- Donor cards with availability status
- Responsive grid layout

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
- Comprehensive statistics
- Recent activity overview
- Quick action buttons for management

### Admin User Management
![Admin Users](screenshots/admin-users.png)
- User table with actions
- Toggle admin status
- Delete users with cascade

## Future Improvements

- Email notifications for blood requests
- Real-time chat between donors and requesters
- Blood donation history tracking
- Geolocation-based donor search
- Mobile app development
- Blood bank inventory management
- Donation reminders and scheduling
- Social media integration
- Advanced analytics and reporting
- SMS notifications for urgent requests
- Blood donation camp management
- Integration with blood banks
- Multi-language support
- Dark mode theme

## Author

**Blood Donor Finder System**

Developed as a comprehensive web application for connecting blood donors with those in need. This project demonstrates full-stack development skills with modern web technologies.

- **Technologies**: Node.js, Express.js, MongoDB, EJS, Bootstrap 5
- **Architecture**: MVC Pattern
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Session-based with bcrypt password hashing

## Deployment

### Deploy to Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: A secure random string
   - `PORT`: 3000 (or your preferred port)
5. Deploy!

### Deploy to Railway

1. Push your code to GitHub
2. Create a new project on Railway
3. Add MongoDB service
4. Add your application service
5. Configure environment variables
6. Deploy!

### Environment Variables

Make sure to set these environment variables in your deployment platform:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood_donor_finder
SESSION_SECRET=your_secure_random_string_here
PORT=3000
NODE_ENV=production
```

## License

ISC
