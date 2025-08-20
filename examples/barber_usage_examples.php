<?php

/**
 * Barber Model Usage Examples
 * 
 * This file demonstrates different ways to use the Barber model
 * to add data to the database in your Laravel barbershop application.
 */

use App\Models\Barber;
use App\Models\Salon;

// Example 1: Creating a single barber
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

// Example 2: Creating multiple barbers at once
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

// Example 3: Using the factory to create barbers
Barber::factory(5)->create(); // Creates 5 random barbers
Barber::factory()->active()->create(); // Creates one active barber
Barber::factory()->position('Senior Barber')->create(); // Creates barber with specific position

// Example 4: Creating barber with relationship
$salon = Salon::find(1);
$barber = new Barber([
    'name' => 'Sarah Davis',
    'position' => 'Stylist',
    'bio' => 'Sarah specializes in modern styling and hair treatments.',
    'experience' => '8 years',
    'specialties' => ['Hair Styling', 'Hair Treatments', 'Color'],
    'phone' => '+1 (555) 456-7890',
    'email' => 'sarah@barbershop.com',
    'is_active' => true,
    'sort_order' => 4
]);

$salon->barbers()->save($barber);

// Example 5: Updating an existing barber
$barber = Barber::find(1);
$barber->update([
    'position' => 'Master Barber',
    'experience' => '12+ years',
    'specialties' => ['Fades', 'Classic Cuts', 'Beard Trimming', 'Hair Coloring']
]);

// Example 6: Using model methods and attributes
$barber = Barber::find(1);

// Access computed attributes
echo $barber->full_name_with_position; // "John Smith - Senior Barber"
echo $barber->specialties_string; // "Fades, Classic Cuts, Beard Trimming"
echo $barber->image_url; // Full URL to image or default image

// Check barber status
if ($barber->hasImage()) {
    echo "Barber has a profile image";
}

if ($barber->hasContactInfo()) {
    echo "Barber has contact information";
}

// Example 7: Querying barbers with scopes
$activeBarbers = Barber::active()->get(); // Only active barbers
$orderedBarbers = Barber::ordered()->get(); // Ordered by sort_order and name
$salonBarbers = Barber::forSalon(1)->get(); // Barbers for specific salon

// Example 8: Using relationships
$salon = Salon::find(1);
$barbers = $salon->barbers; // Get all barbers for this salon

$barber = Barber::find(1);
$salon = $barber->salon; // Get the salon this barber works at

// Example 9: Mass assignment with validation
$barberData = [
    'name' => 'Alex Brown',
    'position' => 'Junior Barber',
    'bio' => 'Alex is passionate about creating unique styles.',
    'experience' => '2 years',
    'specialties' => ['Kids Cuts', 'Simple Styles'],
    'phone' => '+1 (555) 567-8901',
    'email' => 'alex@barbershop.com',
    'is_active' => true,
    'sort_order' => 5,
    'salon_id' => 1
];

// The model will automatically handle the specialties array conversion
$barber = Barber::create($barberData);

// Example 10: Deleting barbers
$barber = Barber::find(1);
$barber->delete(); // Soft delete if configured, or hard delete 