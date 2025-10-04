# Backend Implementation Guide

This document outlines all the API endpoints and WebSocket events your backend needs to implement for the Shield Network Monitor application to work seamlessly.

## Base Configuration

Update these URLs in `src/config/backend.ts`:
- `API_URL`: Your REST API base URL (e.g., `https://api.yourbackend.com`)
- `WS_URL`: Your WebSocket server URL (e.g., `wss://api.yourbackend.com/ws`)

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "optional_username",
  "full_name": "Optional Full Name"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "full_name": "Full Name",
    "avatar_url": "optional_url"
  },
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** Same as register

### POST /api/auth/logout
Logout user (invalidate tokens).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "user": { /* user object */ },
  "token": "new_jwt_access_token"
}
```

### POST /api/auth/reset-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

## Device Endpoints

### GET /api/devices
Get all devices for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "iPhone 14",
    "type": "smartphone",
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF",
    "status": "online",
    "lastSeen": "2025-10-04T12:00:00Z",
    "bandwidth": 1024,
    "userId": "user_uuid",
    "owner": "John Doe",
    "isGuest": false
  }
]
```

**Device Types:** `laptop | smartphone | tv | other`
**Status:** `online | offline`

### POST /api/devices
Add a new device.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "iPhone 14",
  "type": "smartphone",
  "ip": "192.168.1.100",
  "mac": "AA:BB:CC:DD:EE:FF",
  "status": "online",
  "lastSeen": "2025-10-04T12:00:00Z",
  "bandwidth": 1024,
  "owner": "John Doe",
  "isGuest": false
}
```

**Response:** Created device object

### PUT /api/devices/:id
Update device information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Partial device object with fields to update

**Response:** Updated device object

### DELETE /api/devices/:id
Remove a device.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Device deleted successfully"
}
```

## Network Stats Endpoints

### GET /api/network-stats?limit=10
Get network statistics for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of records to return (default: 10)

**Response:**
```json
[
  {
    "id": "uuid",
    "downloadSpeed": 100.5,
    "uploadSpeed": 50.2,
    "ping": 15,
    "stability": 98.5,
    "devices": 5,
    "activeOptimizations": 2,
    "timestamp": "2025-10-04T12:00:00Z",
    "userId": "user_uuid"
  }
]
```

### POST /api/network-stats
Add new network statistics.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "downloadSpeed": 100.5,
  "uploadSpeed": 50.2,
  "ping": 15,
  "stability": 98.5,
  "devices": 5,
  "activeOptimizations": 2,
  "timestamp": "2025-10-04T12:00:00Z"
}
```

**Response:** Created stats object

## Security Events Endpoints

### GET /api/security-events?resolved=false&limit=50
Get security events for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `resolved`: Filter by resolved status (optional)
- `limit`: Number of records to return (default: 50)

**Response:**
```json
[
  {
    "id": "uuid",
    "deviceId": "device_uuid",
    "eventType": "new_device",
    "severity": "medium",
    "description": "New device detected on network",
    "timestamp": "2025-10-04T12:00:00Z",
    "resolved": false,
    "userId": "user_uuid"
  }
]
```

**Event Types:** `new_device | suspicious_activity | network_change | other`
**Severity:** `low | medium | high`

### POST /api/security-events
Create a new security event.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "deviceId": "device_uuid",
  "eventType": "new_device",
  "severity": "medium",
  "description": "New device detected on network",
  "timestamp": "2025-10-04T12:00:00Z",
  "resolved": false
}
```

**Response:** Created event object

### PUT /api/security-events/:id
Update security event (typically to mark as resolved).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "resolved": true
}
```

**Response:** Updated event object

## User Profile Endpoints

### GET /api/profile
Get user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "avatar_url": "url",
  "created_at": "2025-10-04T12:00:00Z",
  "updated_at": "2025-10-04T12:00:00Z"
}
```

### PUT /api/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Partial profile object

**Response:** Updated profile object

### GET /api/settings
Get user settings.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "userId": "user_uuid",
  "real_time_monitoring": true,
  "push_notifications": true,
  "auto_device_scanning": true,
  "intrusion_detection": true,
  "device_alerts": true,
  "security_alerts": true,
  "scan_interval": 30,
  "pi_ip_address": "192.168.1.1"
}
```

### PUT /api/settings
Update user settings.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Partial settings object

**Response:** Updated settings object

## WebSocket Implementation

### Connection
Connect to WebSocket with JWT token in query parameter:
```
wss://api.yourbackend.com/ws?token=<jwt_token>
```

### Message Format
All WebSocket messages should follow this format:
```json
{
  "event": "event_name",
  "data": { /* event data */ }
}
```

### Events to Emit (Server → Client)

#### device:connected
Emitted when a device connects to the network.
```json
{
  "event": "device:connected",
  "data": {
    "id": "uuid",
    "name": "iPhone 14",
    "type": "smartphone",
    "ip": "192.168.1.100",
    "status": "online"
  }
}
```

#### device:disconnected
Emitted when a device disconnects from the network.
```json
{
  "event": "device:disconnected",
  "data": {
    "id": "uuid",
    "name": "iPhone 14",
    "status": "offline"
  }
}
```

#### device:updated
Emitted when device information is updated.
```json
{
  "event": "device:updated",
  "data": {
    /* full device object */
  }
}
```

#### stats:updated
Emitted when new network statistics are available.
```json
{
  "event": "stats:updated",
  "data": {
    "downloadSpeed": 100.5,
    "uploadSpeed": 50.2,
    "ping": 15,
    "stability": 98.5,
    "devices": 5
  }
}
```

#### security:event
Emitted when a new security event occurs.
```json
{
  "event": "security:event",
  "data": {
    "id": "uuid",
    "eventType": "suspicious_activity",
    "severity": "high",
    "description": "Unusual traffic detected",
    "timestamp": "2025-10-04T12:00:00Z"
  }
}
```

## Authentication & Authorization

- Use JWT tokens for authentication
- Include token in `Authorization: Bearer <token>` header for all protected endpoints
- All data should be user-scoped (users can only access their own data)
- Implement token refresh mechanism for long-lived sessions

## Error Responses

All errors should follow this format:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Testing

Once your backend is implemented:
1. Update `src/config/backend.ts` with your URLs
2. Test authentication flow (register, login, logout)
3. Test device CRUD operations
4. Test WebSocket real-time updates
5. Verify all endpoints return proper error messages
