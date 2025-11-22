# Admin Panel Documentation

## Overview
The Finance Academy LMS Admin Panel provides comprehensive management capabilities for your learning management system.

## Access
- **URL**: `/admin/login`
- **Default Admin Credentials**: Set in `.env` file
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

## Features

### 1. Dashboard (`/admin/dashboard`)
- Overview statistics (users, sessions, courses, audit logs)
- Quick access to key metrics
- Activity monitoring

### 2. Users Management (`/admin/users`)
- View all users with filters (role, status)
- Create new users with email/password
- Edit user details (name, role, status)
- Delete users
- Toggle user active/verified status
- Search and pagination

**User Roles:**
- `student` - Regular learners
- `instructor` - Course creators
- `admin` - Full system access

### 3. Roles Management (`/admin/roles`)
- Create custom roles with specific permissions
- Assign permissions to roles
- Edit role permissions
- Delete roles
- View all roles and their capabilities

**Available Permissions:**
- `user.read`, `user.write`, `user.delete`
- `course.read`, `course.write`, `course.delete`
- `content.read`, `content.write`, `content.delete`
- `admin.access`, `analytics.view`

### 4. Groups Management (`/admin/groups`)
- Create user groups
- Assign permissions to groups
- Add users to groups for batch permission management
- Edit and delete groups

### 5. Sessions Management (`/admin/sessions`)
- View all active user sessions
- Monitor device types and IP addresses
- Revoke sessions for security
- Track session expiration

### 6. Audit Logs (`/admin/audit-logs`)
- Complete activity tracking
- Filter by user ID or action type
- View detailed metadata
- Monitor system security
- Track user behavior

**Common Actions Logged:**
- `user.register` - New user registration
- `auth.login` - User login
- `auth.logout` - User logout
- `user.update` - User profile updates
- `user.delete` - User deletion

## Security Features

### Authentication
- JWT-based authentication
- Secure token storage
- Role-based access control (RBAC)
- Admin-only endpoints

### Session Management
- Session tracking with device info
- IP address logging
- Session revocation capability
- Automatic expiration

### Audit Trail
- Complete activity logging
- User agent tracking
- IP address recording
- Detailed metadata storage

## API Integration

All admin endpoints are protected and require:
1. Valid JWT access token
2. Admin role (role === 'admin')

**Base URL**: `http://localhost:8000/admin`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

## Components

### AdminLayout
Provides consistent navigation and layout for all admin pages.
- Side drawer navigation
- User profile menu
- Logout functionality

### AdminRoute
Protected route component that:
- Checks for valid authentication token
- Verifies admin role
- Redirects non-admins to home page
- Redirects unauthenticated users to login

## Usage Tips

1. **Creating Users**: Use strong passwords (min 8 chars)
2. **Role Assignment**: Start with 'student' role, upgrade as needed
3. **Session Monitoring**: Regularly check for suspicious activity
4. **Audit Logs**: Use filters to investigate specific events
5. **Groups**: Use for batch permission management

## Development

### Adding New Admin Pages
1. Create page component in `src/pages/admin/`
2. Import in `App.jsx`
3. Add route with `<AdminRoute>` wrapper
4. Add menu item to `AdminLayout.jsx`

### Styling
- Uses Material-UI (MUI) components
- Consistent theme across all pages
- Responsive design for mobile/tablet

## Troubleshooting

**Can't access admin panel:**
- Verify user has `role: 'admin'`
- Check JWT token is valid
- Ensure backend is running

**Stats not loading:**
- Check backend `/admin/stats` endpoint
- Verify database connection
- Check browser console for errors

**Users not appearing:**
- Verify `/admin/users` endpoint works
- Check database has user records
- Look for CORS issues

## Security Recommendations

1. Use strong admin passwords
2. Enable 2FA when available
3. Regularly review audit logs
4. Revoke old/suspicious sessions
5. Limit admin role assignments
6. Keep JWT tokens secure
7. Use HTTPS in production

## Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Bulk user operations
- Export audit logs
- Email notifications for critical events
- Two-factor authentication management
- Course management interface
- Content moderation tools
