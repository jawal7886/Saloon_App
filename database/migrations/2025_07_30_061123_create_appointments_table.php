<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
			$table->string('name');
			$table->string('email');
			$table->string('phone');
			$table->string('service');
			$table->date('appointment_date');
			$table->time('appointment_time');
			$table->string('barber');
			$table->text('notes')->nullable();
            $table->timestamps();

			$table->unique(['barber', 'appointment_date', 'appointment_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
