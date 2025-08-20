<?php

namespace Database\Factories;

use App\Models\Barber;
use App\Models\Salon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Barber>
 */
class BarberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $positions = ['Senior Barber', 'Master Barber', 'Junior Barber', 'Stylist', 'Hair Specialist'];
        $specialties = [
            ['Fades', 'Beard Trimming', 'Hair Coloring'],
            ['Classic Cuts', 'Modern Styles', 'Kids Cuts'],
            ['Hair Extensions', 'Hair Treatments', 'Styling'],
            ['Beard Grooming', 'Haircuts', 'Hair Care'],
            ['Fashion Cuts', 'Hair Dyeing', 'Hair Styling']
        ];

        return [
            'name' => fake()->name(),
            'position' => fake()->randomElement($positions),
            'bio' => fake()->paragraph(3),
            'image' => null, // Will be set manually or via upload
            'experience' => fake()->numberBetween(1, 20) . ' years',
            'specialties' => fake()->randomElement($specialties),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'social_media' => [
                'instagram' => 'https://instagram.com/' . fake()->userName(),
                'facebook' => 'https://facebook.com/' . fake()->userName(),
                'twitter' => 'https://twitter.com/' . fake()->userName(),
            ],
            'is_active' => fake()->boolean(80), // 80% chance of being active
            'sort_order' => fake()->numberBetween(0, 100),
            'salon_id' => Salon::factory(),
        ];
    }

    /**
     * Indicate that the barber is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the barber is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Set the barber's position.
     */
    public function position(string $position): static
    {
        return $this->state(fn (array $attributes) => [
            'position' => $position,
        ]);
    }

    /**
     * Set the barber's specialties.
     */
    public function specialties(array $specialties): static
    {
        return $this->state(fn (array $attributes) => [
            'specialties' => $specialties,
        ]);
    }
} 