# HBSchools - School Management System

A comprehensive Angular-based school management system with user authentication, role-based access control, and multilingual support.

![Angular](https://img.shields.io/badge/Angular-18.2.1-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication** - Secure login/logout system
- **Role-based Access Control (RBAC)** - Granular permission management
- **Route Guards** - Protected routes based on authentication status
- **Session Management** - Automatic token handling and renewal
- **Password Security** - Secure password policies and validation

### 👥 User Management
- **Complete CRUD Operations** - Create, read, update, delete users
- **User Profiles** - Comprehensive user information management
- **Account Status Management** - Activate/deactivate user accounts
- **Bulk Operations** - Export users to CSV, Excel, and PDF
- **Advanced Search & Filtering** - Find users quickly with multiple filters
- **User Details View** - Detailed user information with edit capabilities

### 🛡️ Role & Permission Management
- **Dynamic Role Creation** - Create custom roles with specific permissions
- **Permission Tree Structure** - Hierarchical permission organization
- **Role Assignment** - Assign multiple roles to users
- **Permission Groups** - Organize permissions by functional areas
- **Real-time Role Testing** - API testing dashboard for role endpoints

### 🌐 Internationalization (i18n)
- **Multilingual Support** - English and Arabic languages
- **RTL Support** - Right-to-left layout for Arabic
- **Dynamic Language Switching** - Switch languages without reload
- **Comprehensive Translations** - All UI elements and messages translated
- **Alert Translations** - Multilingual alert and notification system

### 🎨 User Interface
- **Modern Design** - Clean, responsive Bootstrap-based UI
- **Dark/Light Theme** - Theme switching capability
- **Mobile Responsive** - Works seamlessly on all devices
- **Interactive Components** - Rich UI components and form controls
- **Loading States** - Visual feedback for all operations
- **Toast Notifications** - User-friendly success/error messages

### 📊 Data Management
- **Advanced Tables** - Sortable, filterable data tables with pagination
- **Export Functionality** - Export data to multiple formats
- **Date Formatting** - Intelligent date display and formatting
- **Search & Filter** - Powerful search capabilities across all modules
- **Bulk Operations** - Perform actions on multiple records

### 🔧 Technical Features
- **Angular 18** - Latest Angular framework with standalone components
- **TypeScript** - Full type safety and modern JavaScript features
- **RxJS** - Reactive programming with observables
- **HTTP Interceptors** - Centralized API request/response handling
- **Error Handling** - Comprehensive error management system
- **Form Validation** - Client-side validation with real-time feedback
- **API Integration** - RESTful API integration with standardized responses

## 🏗️ Architecture

### Project Structure
```
src/
├── app/
│   ├── core/                    # Core services and guards
│   │   ├── guards/             # Authentication and authorization guards
│   │   └── services/           # Business logic services
│   ├── views/
│   │   ├── layout/             # Main layout components
│   │   ├── pages/              # Feature pages
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── users/          # User management
│   │   │   └── roles/          # Role management
│   │   └── partials/           # Reusable UI components
│   └── assets/
│       └── i18n/               # Translation files
└── styles/                     # SCSS stylesheets
```

### Key Services
- **AuthService** - Authentication and session management
- **UserService** - User data operations with new API format
- **RoleService** - Role and permission management
- **AlertService** - Centralized alert and notification system
- **ErrorHandlerService** - Global error handling
- **ExportService** - Data export functionality

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- Angular CLI (v18.2.1)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/boodyelgml/HBSchools.git
   cd HBSchools/UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Update API endpoints in services if needed
   # Default backend URL: http://localhost:9090/api/v1
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Open application**
   ```
   Navigate to http://localhost:4200/
   ```

## 🚀 Development

### Development Server
```bash
npm start
# Application will be available at http://localhost:4200/
```

### Building for Production
```bash
npm run build
# Build artifacts will be stored in the dist/ directory
```

### Running Tests
```bash
npm test        # Unit tests
npm run e2e     # End-to-end tests
```

### Code Scaffolding
```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

## 🔑 Default Credentials

For development and testing:
- **Email**: admin@demo.com
- **Password**: 12345678

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/authenticate` - User login
- `POST /api/v1/auth/register` - User registration

### User Management Endpoints
- `GET /api/v1/auth/users` - Get all users
- `GET /api/v1/auth/user/{id}` - Get user by ID
- `POST /api/v1/auth/users` - Create user
- `PUT /api/v1/auth/user/update` - Update user
- `DELETE /api/v1/auth/users/{id}` - Delete user

### Role Management Endpoints
- `GET /api/v1/auth/roles_with_permissions_tree` - Get roles with permissions
- `POST /api/v1/auth/create_role` - Create new role
- `POST /api/v1/auth/update_role_name` - Update role name
- `POST /api/v1/auth/attachRolesToUser` - Assign roles to user

### API Response Format
All API responses follow a standardized format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-10-02T10:30:00Z"
}
```

## 🎨 Theming & Customization

### Theme Configuration
- Bootstrap 5.3 based design system
- CSS custom properties for easy theming
- SCSS variables for color customization
- Responsive breakpoints and grid system

### Adding New Languages
1. Create translation file in `src/assets/i18n/`
2. Add language configuration in app module
3. Update language selector component

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interfaces
- Mobile-optimized navigation
- Progressive Web App (PWA) ready

## 🧪 Testing

### Unit Testing
- Jest/Jasmine test framework
- Comprehensive component testing
- Service and utility function tests

### E2E Testing
- Protractor/Cypress integration
- User workflow testing
- Cross-browser compatibility

## 🚀 Deployment

### Production Build
```bash
npm run build --prod
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 80
CMD ["npx", "http-server", "dist", "-p", "80"]
```

### Environment Variables
- `API_BASE_URL` - Backend API base URL
- `DEFAULT_LANGUAGE` - Default application language
- `ENABLE_DEBUG` - Enable debug logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Angular style guide
- Use TypeScript strict mode
- Write unit tests for new features
- Update documentation
- Follow semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: Abdelrahman Fathy
- **Repository**: [boodyelgml/HBSchools](https://github.com/boodyelgml/HBSchools)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/boodyelgml/HBSchools/issues)
- **Documentation**: See `/docs` directory
- **Email**: admin@demo.com

## 🔄 Changelog

### v3.0.0 (Latest)
- ✅ Complete roles and permissions system
- ✅ Multilingual support (English/Arabic)
- ✅ Comprehensive alert translation system
- ✅ New API response format integration
- ✅ Enhanced user management with export features
- ✅ Improved authentication flow
- ✅ Mobile-responsive design updates

### v2.0.0
- User management system
- Authentication integration
- Basic role management

### v1.0.0
- Initial project setup
- Basic Angular application structure

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] File upload and management system
- [ ] Calendar and scheduling features
- [ ] Mobile application (React Native/Flutter)
- [ ] Advanced security features (2FA, SSO)
- [ ] API rate limiting and caching
- [ ] Microservices architecture migration

---

**Built with ❤️ using Angular 18 and modern web technologies**
