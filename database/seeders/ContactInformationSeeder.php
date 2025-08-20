<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ContactInformation;

class ContactInformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContactInformation::create([
            'business_name' => 'Dubai Saloon',
            'address' => 'Talwandi Bhindran\n12',
            'phone' => '03212328397',
            'email' => 'sajawalali7886@gmail.com',
            'website' => '',
            'business_hours' => [
                'monday' => '9:00 AM - 7:00 PM',
                'tuesday' => '9:00 AM - 7:00 PM',
                'wednesday' => '9:00 AM - 7:00 PM',
                'thursday' => '9:00 AM - 8:00 PM',
                'friday' => '9:00 AM - 8:00 PM',
                'saturday' => '8:00 AM - 6:00 PM',
                'sunday' => 'CLOSED'
            ],
            'additional_info' => 'Walk ins Welcome'
        ]);
    }
}
