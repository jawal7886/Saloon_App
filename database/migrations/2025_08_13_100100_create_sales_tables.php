<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		// Create sales table if missing
		if (!Schema::hasTable('sales')) {
			Schema::create('sales', function (Blueprint $table) {
			$table->id();
			$table->string('invoice_no')->unique();
			$table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
			$table->string('barber')->nullable();
			$table->decimal('subtotal', 10, 2)->default(0);
			$table->decimal('discount_total', 10, 2)->default(0);
			$table->decimal('tax_total', 10, 2)->default(0);
			$table->decimal('grand_total', 10, 2)->default(0);
			$table->decimal('paid_total', 10, 2)->default(0);
			$table->decimal('balance', 10, 2)->default(0);
			$table->string('payment_status')->default('unpaid'); // paid, partial, unpaid
			$table->string('payment_method')->nullable();
			$table->text('notes')->nullable();
			$table->timestamps();
			});
		}

		// Create sale_items table if missing
		if (!Schema::hasTable('sale_items')) {
			Schema::create('sale_items', function (Blueprint $table) {
			$table->id();
			$table->foreignId('sale_id')->constrained('sales')->cascadeOnDelete();
			$table->enum('item_type', ['service', 'product']);
			$table->unsignedBigInteger('item_id');
			$table->string('name_snapshot');
			$table->decimal('qty', 10, 2)->default(1);
			$table->decimal('unit_price', 10, 2)->default(0);
			$table->decimal('line_discount', 10, 2)->default(0);
			$table->decimal('tax_amount', 10, 2)->default(0);
			$table->decimal('line_total', 10, 2)->default(0);
			$table->timestamps();
			});
		}

		// Create sale_payments table if missing
		if (!Schema::hasTable('sale_payments')) {
			Schema::create('sale_payments', function (Blueprint $table) {
			$table->id();
			$table->foreignId('sale_id')->constrained('sales')->cascadeOnDelete();
			$table->string('method'); // cash, card, bank
			$table->decimal('amount', 10, 2)->default(0);
			$table->string('reference')->nullable();
			$table->timestamps();
			});
		}
	}

	public function down(): void
	{
		Schema::dropIfExists('sale_payments');
		Schema::dropIfExists('sale_items');
		Schema::dropIfExists('sales');
	}
};


