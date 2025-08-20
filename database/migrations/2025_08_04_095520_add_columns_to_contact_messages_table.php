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
            $table->string('name')->after('id');
            $table->string('phone')->after('name');
            $table->string('email')->after('phone');
            $table->string('preferred_service')->nullable()->after('email');
            $table->datetime('preferred_datetime')->nullable()->after('preferred_service');
            $table->text('message')->after('preferred_datetime');
            $table->enum('status', ['unread', 'read', 'replied'])->default('unread')->after('message');
        });

        Schema::create('contact_information', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->text('address');
            $table->string('phone');
            $table->string('email');
            $table->string('website')->nullable();
            $table->json('business_hours');
            $table->text('additional_info')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn(['name', 'phone', 'email', 'preferred_service', 'preferred_datetime', 'message', 'status']);
        });

        Schema::dropIfExists('contact_information');
    }
};
