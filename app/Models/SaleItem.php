<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
	protected $fillable = [
		'sale_id','item_type','item_id','name_snapshot','qty','unit_price','line_discount','tax_amount','line_total'
	];

	public function sale()
	{
		return $this->belongsTo(Sale::class);
	}
}


