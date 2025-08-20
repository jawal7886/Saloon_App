<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Barber;
use App\Models\Salon;

class CreateSampleBarbers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'barbers:create-sample';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create sample barbers for demonstration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating sample barbers...');

        // Get or create a salon first
        $salon = Salon::firstOrCreate(
            ['name' => 'Main Street Barbershop'],
            [
                'address' => '123 Main Street',
                'phone' => '+1 (555) 123-4567',
                'email' => 'info@mainstreetbarbershop.com',
                'hours' => 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
                'is_active' => true
            ]
        );

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
                'salon_id' => $salon->id
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
                'salon_id' => $salon->id
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
                'salon_id' => $salon->id
            ]
        ];

        foreach ($barbers as $barberData) {
            $barber = Barber::create($barberData);
            $this->info("Created barber: {$barber->name} - {$barber->position}");
        }

        $this->info('Sample barbers created successfully!');
        
        // Display created barbers
        $this->info("\nCreated barbers:");
        $createdBarbers = Barber::with('salon')->get();
        
        foreach ($createdBarbers as $barber) {
            $this->line("- {$barber->name} ({$barber->position}) at {$barber->salon->name}");
            $this->line("  Specialties: {$barber->specialties_string}");
            $this->line("  Contact: {$barber->phone} | {$barber->email}");
            $this->line("");
        }
    }
} 