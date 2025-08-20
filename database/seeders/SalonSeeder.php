<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Salon;

class SalonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Salon::create([
            'name' => 'Dubai Saloon',
            'tag_line' => 'Professional Grooming Services',
            'logo' => '',
            'address' => 'Talwandi Bhindran\n12',
            'phone1' => '03212328397',
            'phone2' => '',
            'email1' => 'sajawalali7886@gmail.com',
            'email2' => '',
            'description' => 'Professional barbershop offering quality grooming services',
            'social_media' => json_encode([
                'facebook' => '',
                'instagram' => '',
                'twitter' => ''
            ]),
            'hours' => json_encode([
                'monday' => '9:00 AM - 7:00 PM',
                'tuesday' => '9:00 AM - 7:00 PM',
                'wednesday' => '9:00 AM - 7:00 PM',
                'thursday' => '9:00 AM - 8:00 PM',
                'friday' => '9:00 AM - 8:00 PM',
                'saturday' => '8:00 AM - 6:00 PM',
                'sunday' => 'CLOSED'
            ])
        ]);
    }
}
