<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\Salon;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first salon or create one if none exists
        $salon = Salon::first();
        
        if (!$salon) {
            $salon = Salon::create([
                'name' => 'Sample Salon',
                'tag_line' => 'Your trusted barbershop',
                'address' => '123 Main Street',
                'phone1' => '+1234567890',
                'email1' => 'info@samplebarbershop.com',
            ]);
        }

        $services = [
            [
                'name' => 'Classic Haircut',
                'description' => 'Traditional men\'s haircut with wash and style',
                'price' => 25.00,
                'duration' => '30 min',
                'category' => 'Haircut',
                'image' => '/assets/1.png',
                'is_active' => true,
                'salon_id' => $salon->id,
            ],
            [
                'name' => 'Beard Trim',
                'description' => 'Professional beard trimming and shaping',
                'price' => 15.00,
                'duration' => '20 min',
                'category' => 'Beard',
                'image' => '/assets/2.png',
                'is_active' => true,
                'salon_id' => $salon->id,
            ],
            [
                'name' => 'Haircut & Beard Combo',
                'description' => 'Complete grooming package including haircut and beard trim',
                'price' => 35.00,
                'duration' => '45 min',
                'category' => 'Combo',
                'image' => '/assets/3.png',
                'is_active' => true,
                'salon_id' => $salon->id,
            ],
            [
                'name' => 'Kids Haircut',
                'description' => 'Specialized haircut for children under 12',
                'price' => 18.00,
                'duration' => '25 min',
                'category' => 'Haircut',
                'image' => '/assets/4.jpg',
                'is_active' => true,
                'salon_id' => $salon->id,
            ],
            [
                'name' => 'Hair Coloring',
                'description' => 'Professional hair coloring and highlights',
                'price' => 60.00,
                'duration' => '90 min',
                'category' => 'Styling',
                'image' => '/assets/5.jpg',
                'is_active' => true,
                'salon_id' => $salon->id,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
} 