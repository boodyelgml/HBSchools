# Basic Solution - Spring Boot Application

A comprehensive Spring Boot application with authentication, role-based access control, and user management features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role and permission management
- **User Management**: Complete CRUD operations for users with profile management
- **Role & Permission System**: Hierarchical role-permission structure with tree-based organization
- **Database Support**: PostgreSQL integration with H2 for development
- **API Documentation**: Swagger/OpenAPI 3.0 integration
- **Unified Response System**: Consistent API responses with comprehensive error handling
- **Service Layer Architecture**: Clean separation of concerns with proper layering
- **Builder Pattern**: Lombok builders implemented across all data classes

## 🏗️ Architecture

```
src/main/java/com/ask/basic/
├── SchoolApplication.java              # Main application entry point
├── auth/
│   ├── controller/
│   │   └── AuthController.java         # REST endpoints for authentication
│   ├── data/                           # DTOs and request/response objects
│   │   ├── AttachRolesToUserRequest.java
│   │   ├── CreateRoleRequest.java
│   │   ├── UpdateRoleRequest.java
│   │   ├── UpdateUserRequest.java
│   │   ├── TreeNodeDTO.java
│   │   ├── RoleDto.java
│   │   └── PermissionDto.java
│   ├── domain/                         # JPA entities
│   │   ├── User.java
│   │   ├── Role.java
│   │   ├── Permission.java
│   │   ├── UserRepository.java
│   │   ├── RoleRepository.java
│   │   └── PermissionRepository.java
│   ├── request/                        # Request DTOs
│   │   ├── LoginRequest.java
│   │   └── RegisterRequest.java
│   ├── response/                       # Response DTOs
│   │   └── LoginResponse.java
│   └── service/                        # Business logic layer
│       ├── AuthWritePlatformService.java
│       ├── AuthWritePlatformServiceImpl.java
│       ├── UserService.java
│       ├── UserServiceImpl.java
│       ├── RoleService.java
│       ├── RoleServiceImpl.java
│       ├── PermissionService.java
│       └── PermissionServiceImpl.java
└── infrastructure/
    ├── auth/                           # Security configuration
    │   ├── AuthConfig.java
    │   ├── CorsConfig.java
    │   ├── JwtFilter.java
    │   └── JwtService.java
    ├── exceptions/                     # Global exception handling
    │   ├── BaseCustomExceptionHandler.java
    │   ├── NotFoundException.java
    │   ├── ValidationException.java
    │   └── UnauthorizedException.java
    ├── response/                       # Unified response system
    │   └── ApiResponse.java
    └── SwaggerConfig.java              # API documentation config
```

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL (Production), H2 (Development)
- **Security**: Spring Security with JWT
- **Documentation**: SpringDoc OpenAPI 3.0 (Swagger)
- **Build Tool**: Maven
- **ORM**: Spring Data JPA with Hibernate

### Dependencies

- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Validation
- Spring Boot Starter Actuator
- SpringDoc OpenAPI Starter WebMVC UI
- JWT (jjwt-api, jjwt-impl, jjwt-jackson)
- Lombok
- PostgreSQL Driver

## 🔧 Setup & Installation

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher

### Database Configuration

The application is configured to use PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=org.postgresql.Driver
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Setup PostgreSQL Database**
   ```sql
   CREATE DATABASE postgres;
   CREATE USER root WITH PASSWORD 'root';
   GRANT ALL PRIVILEGES ON DATABASE postgres TO root;
   ```

3. **Build the application**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   Or run the JAR file:
   ```bash
   java -jar target/basic-0.0.1-SNAPSHOT.war
   ```

The application will start on `http://localhost:9090`.

### Default User

The application automatically creates a default admin user on startup:
- **Email**: admin@demo.com
- **Password**: 12345678
- **Name**: abdelrahman fathy

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:9090/swagger-ui.html
- **OpenAPI JSON**: http://localhost:9090/v3/api-docs

## 🔐 Authentication

The application uses JWT-based authentication. To access protected endpoints:

1. **Register a new user** or **login** with existing credentials
2. **Include the JWT token** in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/authenticate` - Login with email/password

## 📋 API Endpoints

### User Management
- `GET /api/v1/auth/users` - Get all users
- `GET /api/v1/auth/user/{id}` - Get user by ID
- `PUT /api/v1/auth/user/update` - Update user information

### Role Management
- `POST /api/v1/auth/create_role` - Create a new role
- `POST /api/v1/auth/update_role_name` - Update role name
- `DELETE /api/v1/auth/roles/{id}` - Delete a role
- `POST /api/v1/auth/attachRolesToUser` - Attach roles to a user

### Permission & Tree Structure
- `GET /api/v1/auth/roles_with_permissions_tree` - Get roles with permissions in tree structure
- `GET /api/v1/auth/roles_with_permissions_grouped_by_group_name_tree` - Get grouped permissions tree
- `GET /api/v1/auth/permissions_grouped_by_group_name` - Get permissions grouped by category

## 📊 Unified API Response Format

All API endpoints return responses in a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "timestamp": "2025-10-02T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE",
  "timestamp": "2025-10-02T10:30:00",
  "path": "/api/v1/auth/endpoint"
}
```

## 🏛️ Service Layer Architecture

The application follows a clean architecture pattern:

- **Controllers**: Handle HTTP requests/responses only
- **Services**: Contain all business logic and validation
- **Repositories**: Handle data persistence
- **DTOs**: Data transfer objects with validation

### Key Services

- **UserService**: User management operations
- **RoleService**: Role and permission management
- **PermissionService**: Permission organization and retrieval
- **AuthWritePlatformService**: Authentication and registration

## 🛡️ Security Features

- **JWT Authentication**: Stateless authentication with configurable expiration
- **Password Encoding**: BCrypt password hashing
- **CORS Configuration**: Cross-origin request handling
- **Role-Based Access Control**: Hierarchical permission system
- **Input Validation**: Comprehensive request validation
- **Exception Handling**: Global error handling with unified responses

## 🔧 Configuration

### Application Properties

Key configuration options in `application.properties`:

```properties
# Server Configuration
server.port=9090

# Database Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Swagger Configuration
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
```

## 🧪 Testing

The application includes comprehensive error handling and validation:

- **Input Validation**: Bean validation with custom messages
- **Business Logic Validation**: Service-layer validation
- **Exception Handling**: Global exception handler with unified responses
- **Edge Case Handling**: Null safety and defensive programming

## 🚀 Deployment

### Production Deployment

1. **Update application.properties** for production database
2. **Build the WAR file**:
   ```bash
   mvn clean package
   ```
3. **Deploy to application server** (Tomcat, etc.)

### Docker Deployment (Optional)

Create a `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/basic-0.0.1-SNAPSHOT.war app.war
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "/app.war"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Spring Boot and modern Java practices**
