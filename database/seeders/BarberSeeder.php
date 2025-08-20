<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Barber;
use App\Models\Salon;

class BarberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample barbers using factory
        Barber::factory(10)->create();

        // Create specific barbers for demonstration
        $barbers = [
            [
                'name' => 'John Smith',
                'position' => 'Senior Barber',
                'bio' => 'John has over 10 years of experience in men\'s grooming. He specializes in modern fades and classic cuts.',
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
            ],
            [
                'name' => 'Mike Johnson',
                'position' => 'Master Barber',
                'bio' => 'Mike is our master barber with expertise in all types of cuts and styles. He loves working with clients to achieve their perfect look.',
                'image' => '/images/barbers/mike-johnson.jpg',
                'experience' => '15+ years',
                'specialties' => ['All Styles', 'Hair Coloring', 'Styling'],
                'phone' => '+1 (555) 234-5678',
                'email' => 'mike@barbershop.com',
                'social_media' => [
                    'instagram' => '@mikejohnson_master',
                    'twitter' => '@mikejohnson_barber'
                ],
                'is_active' => true,
                'sort_order' => 2,
                'salon_id' => 1
            ],
            [
                'name' => 'David Wilson',
                'position' => 'Junior Barber',
                'bio' => 'David is our newest addition to the team. He brings fresh perspectives and modern techniques to our shop.',
                'image' => '/images/barbers/david-wilson.jpg',
                'experience' => '3 years',
                'specialties' => ['Modern Cuts', 'Skin Fades', 'Design Work'],
                'phone' => '+1 (555) 345-6789',
                'email' => 'david@barbershop.com',
                'social_media' => [
                    'instagram' => '@davidwilson_cuts'
                ],
                'is_active' => true,
                'sort_order' => 3,
                'salon_id' => 1
            ]
        ];

        foreach ($barbers as $barber) {
            Barber::create($barber);
        }
    }
}
