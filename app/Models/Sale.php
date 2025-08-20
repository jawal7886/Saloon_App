<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
	protected $fillable = [
		'invoice_no','customer_id','barber','subtotal','discount_total','tax_total','grand_total','paid_total','balance','payment_status','payment_method','notes'
	];

	public function items()
	{
		return $this->hasMany(SaleItem::class);
	}

	public function payments()
	{
		return $this->hasMany(SalePayment::class);
	}

	public function customer()
	{
		return $this->belongsTo(Customer::class);
	}
}


