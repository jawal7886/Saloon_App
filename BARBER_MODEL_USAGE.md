# Barber Model Usage Guide

This guide explains how to use the Barber model to add data to the database in your Laravel barbershop application.

## Overview

The Barber model is designed to manage barber information including personal details, specialties, contact information, and salon relationships.

## Database Structure

The `barbers` table includes the following fields:

- `id` - Primary key
- `name` - Barber's full name
- `position` - Position/title (e.g., Senior Barber, Master Barber)
- `bio` - Biography/description
- `image` - Profile image URL or file path
- `experience` - Years of experience
- `specialties` - JSON array of specialties
- `phone` - Contact phone number
- `email` - Contact email
- `social_media` - JSON array of social media links
- `is_active` - Whether the barber is currently active
- `sort_order` - For ordering barbers in display
- `salon_id` - Foreign key to salon
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Basic Usage

### Creating a Single Barber

```php
use App\Models\Barber;

$barber = Barber::create([
    'name' => 'John Smith',
    'position' => 'Senior Barber',
    'bio' => 'John has over 10 years of experience in men\'s grooming.',
    'image' => '/images/barbers/john-smith.jpg',
    'experience' => '10+ years',
    'specialties' => ['Fades', 'Classic Cuts', 'Beard Trimming'],
    'phone' => '+1 (555) 123-4567',
    'email' => 'john@barbershop.com',
    'social_media' => [
        'instagram' => '@johnsmith_barber',
        'facebook' => 'johnsmith.barber'
    ],
    'is_active' => true,
    'sort_order' => 1,
    'salon_id' => 1
]);
```

### Creating Multiple Barbers

```php
$barbers = [
    [
        'name' => 'Mike Johnson',
        'position' => 'Master Barber',
        'bio' => 'Mike is our master barber with expertise in all types of cuts.',
        'experience' => '15+ years',
        'specialties' => ['All Styles', 'Hair Coloring', 'Styling'],
        'phone' => '+1 (555) 234-5678',
        'email' => 'mike@barbershop.com',
        'is_active' => true,
        'sort_order' => 2,
        'salon_id' => 1
    ],
    [
        'name' => 'David Wilson',
        'position' => 'Junior Barber',
        'bio' => 'David brings fresh perspectives and modern techniques.',
        'experience' => '3 years',
        'specialties' => ['Modern Cuts', 'Skin Fades', 'Design Work'],
        'phone' => '+1 (555) 345-6789',
        'email' => 'david@barbershop.com',
        'is_active' => true,
        'sort_order' => 3,
        'salon_id' => 1
    ]
];

foreach ($barbers as $barberData) {
    Barber::create($barberData);
}
```

## Using the Factory

The Barber model includes a factory for creating test data:

```php
// Create 5 random barbers
Barber::factory(5)->create();

// Create one active barber
Barber::factory()->active()->create();

// Create barber with specific position
Barber::factory()->position('Senior Barber')->create();

// Create barber with specific specialties
Barber::factory()->specialties(['Fades', 'Beard Trimming'])->create();
```

## Model Features

### Query Scopes

The model includes several query scopes for filtering:

```php
// Get only active barbers
$activeBarbers = Barber::active()->get();

// Get barbers ordered by sort_order and name
$orderedBarbers = Barber::ordered()->get();

// Get barbers for a specific salon
$salonBarbers = Barber::forSalon(1)->get();
```

### Computed Attributes

The model provides several computed attributes:

```php
$barber = Barber::find(1);

// Get full name with position
echo $barber->full_name_with_position; // "John Smith - Senior Barber"

// Get specialties as comma-separated string
echo $barber->specialties_string; // "Fades, Classic Cuts, Beard Trimming"

// Get image URL (with fallback to default)
echo $barber->image_url; // Full URL to image or default image

// Get social media links
$socialMedia = $barber->social_media_links;

// Get contact information
$contactInfo = $barber->contact_info;
```

### Helper Methods

```php
$barber = Barber::find(1);

// Check if barber has image
if ($barber->hasImage()) {
    echo "Barber has a profile image";
}

// Check if barber has contact information
if ($barber->hasContactInfo()) {
    echo "Barber has contact information";
}
```

## Relationships

### Salon Relationship

Each barber belongs to a salon:

```php
// Get the salon a barber works at
$barber = Barber::find(1);
$salon = $barber->salon;

// Get all barbers for a salon
$salon = Salon::find(1);
$barbers = $salon->barbers;
```

## API Usage

The Barber model is integrated with the API through the BarberController:

### GET /api/barbers
Returns all barbers (ordered by sort_order)

### POST /api/barbers
Creates a new barber

### GET /api/barbers/{id}
Returns a specific barber

### PUT /api/barbers/{id}
Updates a barber

### DELETE /api/barbers/{id}
Deletes a barber

## Console Commands

### Create Sample Barbers

Run the following command to create sample barbers:

```bash
php artisan barbers:create-sample
```

This will create sample barbers with realistic data for testing.

## Seeding

The BarberSeeder can be used to populate the database with sample data:

```bash
php artisan db:seed --class=BarberSeeder
```

## Validation

When creating or updating barbers, the following validation rules apply:

- `name` - Required, string, max 255 characters
- `position` - Optional, string, max 255 characters
- `bio` - Optional, string
- `image` - Optional, string, max 255 characters
- `experience` - Optional, string, max 255 characters
- `specialties` - Optional, array of strings
- `phone` - Optional, string, max 255 characters
- `email` - Optional, valid email, max 255 characters
- `social_media` - Optional, array
- `is_active` - Boolean
- `sort_order` - Integer
- `salon_id` - Optional, must exist in salons table

## Data Types

### Specialties
The `specialties` field is stored as JSON and automatically cast to/from array:

```php
// Setting specialties
$barber->specialties = ['Fades', 'Beard Trimming', 'Hair Coloring'];

// Getting specialties
$specialties = $barber->specialties; // Returns array
```

### Social Media
The `social_media` field is stored as JSON and automatically cast to/from array:

```php
// Setting social media
$barber->social_media = [
    'instagram' => '@johnsmith_barber',
    'facebook' => 'johnsmith.barber',
    'twitter' => '@johnsmith_barber'
];

// Getting social media
$socialMedia = $barber->social_media; // Returns array
```

## Best Practices

1. **Always validate data** before creating or updating barbers
2. **Use the factory** for creating test data
3. **Use query scopes** for filtering barbers
4. **Handle relationships** properly when creating barbers
5. **Use computed attributes** for formatted data
6. **Check for salon existence** before assigning salon_id

## Example Controller Usage

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'position' => 'nullable|string|max:255',
        'bio' => 'nullable|string',
        'experience' => 'nullable|string',
        'specialties' => 'nullable|array',
        'phone' => 'nullable|string',
        'email' => 'nullable|email',
        'salon_id' => 'nullable|exists:salons,id'
    ]);

    $barber = Barber::create($validated);
    return response()->json($barber, 201);
}

public function index()
{
    $barbers = Barber::active()->ordered()->with('salon')->get();
    return response()->json($barbers);
}
```

This completes the Barber model setup for your Laravel barbershop application! 