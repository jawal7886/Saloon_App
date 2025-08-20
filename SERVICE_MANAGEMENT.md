# Service Management - Admin Dashboard

## Overview
The admin dashboard provides comprehensive service management capabilities for the barbershop application. Administrators can add, edit, view, delete, and toggle the status of services.

## Features

### 1. Service Management
- **Add New Service**: Create new services with all required details
- **Edit Service**: Modify existing service information
- **View Service Details**: View complete service information in a modal
- **Delete Service**: Remove services with confirmation
- **Toggle Service Status**: Activate/deactivate services

### 2. Service Properties
Each service includes the following properties:
- **Name** (Required): Service name (2-255 characters)
- **Category** (Required): Service category (2-255 characters)
- **Price** (Required): Service price (minimum $0.00)
- **Duration** (Required): Service duration (2-255 characters)
- **Description** (Optional): Detailed service description (max 1000 characters)
- **Image URL** (Optional): Service image URL
- **Status** (Optional): Active/Inactive toggle

### 3. Database Structure
The services table includes:
- `id` - Primary key
- `name` - Service name
- `description` - Service description
- `price` - Decimal price with 2 decimal places
- `duration` - Service duration
- `category` - Service category
- `image` - Image URL
- `is_active` - Boolean status
- `salon_id` - Foreign key to salons table
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

### Service Management API
- `GET /api/services` - List all services
- `POST /api/services` - Create new service
- `GET /api/services/{id}` - Get specific service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

### Request/Response Format
```json
// Create/Update Service Request
{
    "name": "Service Name",
    "description": "Service description",
    "price": 25.00,
    "duration": "30 min",
    "category": "Haircut",
    "image": "https://example.com/image.jpg",
    "is_active": true,
    "salon_id": 1
}

// Service Response
{
    "id": 1,
    "name": "Service Name",
    "description": "Service description",
    "price": "25.00",
    "duration": "30 min",
    "category": "Haircut",
    "image": "https://example.com/image.jpg",
    "is_active": true,
    "salon_id": 1,
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

## Usage Instructions

### Adding a New Service
1. Navigate to Admin Dashboard → Services
2. Click "Add Service" button
3. Fill in required fields (marked with *)
4. Optionally add description and image URL
5. Set service status (Active/Inactive)
6. Click "Add Service" to save

### Editing a Service
1. Click the edit (pencil) icon on any service card
2. Modify the desired fields
3. Click "Update Service" to save changes

### Viewing Service Details
1. Click the view (eye) icon on any service card
2. Review all service information
3. Click "Edit Service" to modify or "Close" to exit

### Deleting a Service
1. Click the delete (trash) icon on any service card
2. Confirm deletion in the modal
3. Click "Delete Service" to permanently remove

### Toggling Service Status
1. Click the status button (Active/Inactive) on any service card
2. The status will toggle immediately

## Validation Rules

### Frontend Validation
- Name: Required, 2-255 characters
- Category: Required, 2-255 characters
- Price: Required, minimum $0.00
- Duration: Required, 2-255 characters
- Description: Optional, maximum 1000 characters
- Image URL: Optional, maximum 255 characters

### Backend Validation
- All frontend rules plus:
- `salon_id`: Must exist in salons table
- `is_active`: Boolean value
- Price: Numeric with 2 decimal places

## Error Handling

### Common Error Messages
- "Please fill in all required fields" - Missing required data
- "Service not found" - Invalid service ID
- "Validation failed" - Invalid data format
- "Failed to create/update/delete service" - Server error

### Error Display
- Success messages: Green background, auto-dismiss after 3 seconds
- Error messages: Red background, auto-dismiss after 5 seconds
- Validation errors: Display specific field errors

## Technical Implementation

### Frontend (React/TypeScript)
- Service interface with proper typing
- Form validation with HTML5 and custom validation
- Modal components for add/edit/view/delete operations
- Real-time status updates
- Error handling and user feedback

### Backend (Laravel/PHP)
- RESTful API endpoints
- Comprehensive validation rules
- Database relationships (Service belongs to Salon)
- Proper error handling and logging
- CSRF protection

### Database
- Foreign key constraints
- Proper indexing
- Cascade deletes for salon relationships
- Boolean casting for is_active field

## Security Features
- CSRF token protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Proper error handling without exposing sensitive data

## Performance Considerations
- Efficient database queries
- Proper indexing on frequently queried fields
- Optimized API responses
- Frontend state management
- Debounced form submissions

## Troubleshooting

### Common Issues
1. **Services not loading**: Check API endpoint and network connectivity
2. **Form submission fails**: Verify all required fields are filled
3. **Update not working**: Ensure service ID is valid
4. **Delete confirmation not showing**: Check modal component rendering

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check Laravel logs for backend errors
4. Validate database connections and relationships 