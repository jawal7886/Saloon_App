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
        Schema::table('contact_messages', function (Blueprint $table) {
            // Drop the old columns that exist
            $table->dropColumn(['service_type', 'appointment_date', 'appointment_time', 'special_requests']);
            
            // Add the new columns
            $table->enum('urgency', ['low', 'medium', 'high'])->default('medium')->after('subject');
            $table->enum('appointment_type', ['walk_in', 'scheduled', 'consultation', 'other'])->default('other')->after('urgency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            // Drop the new columns
            $table->dropColumn(['urgency', 'appointment_type']);
            
            // Add back the old columns
            $table->string('service_type')->nullable()->after('email');
            $table->date('appointment_date')->nullable()->after('service_type');
            $table->time('appointment_time')->nullable()->after('appointment_date');
            $table->text('special_requests')->nullable()->after('appointment_time');
        });
    }
};
