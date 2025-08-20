<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\{Sale, SaleItem, SalePayment};

class PosSaleController extends Controller
{
	public function index()
	{
		$sales = Sale::with(['items', 'customer'])
			->orderBy('created_at', 'desc')
			->get()
			->map(function ($sale) {
				return [
					'id' => $sale->id,
					'invoice_no' => $sale->invoice_no,
					'customer_name' => $sale->customer ? $sale->customer->name : null,
					'barber' => $sale->barber,
					'grand_total' => (float)$sale->grand_total,
					'payment_status' => $sale->payment_status,
					'created_at' => $sale->created_at,
					'items' => $sale->items->map(function ($item) {
						return [
							'name' => $item->name_snapshot,
							'qty' => (int)$item->qty,
							'unit_price' => (float)$item->unit_price,
							'line_total' => (float)$item->line_total,
						];
					})
				];
			});

		return response()->json($sales);
	}

	public function show($id)
	{
		$sale = Sale::with(['items','payments','customer'])->findOrFail($id);
		return response()->json($sale);
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'customer_id' => 'nullable|exists:customers,id',
			'barber' => 'nullable|string|max:255',
			'items' => 'required|array|min:1',
			'items.*.item_type' => 'required|in:service,product',
			'items.*.item_id' => 'required|integer',
			'items.*.name' => 'required|string',
			'items.*.qty' => 'required|numeric|min:0.01',
			'items.*.unit_price' => 'required|numeric|min:0',
			'items.*.line_discount' => 'nullable|numeric|min:0',
			'items.*.tax_rate' => 'nullable|numeric|min:0',
			'discount_total' => 'nullable|numeric|min:0',
			'tax_total' => 'nullable|numeric|min:0',
			'paid_total' => 'required|numeric|min:0',
			'payment_method' => 'required|string|max:50',
			'notes' => 'nullable|string',
		]);

		return DB::transaction(function () use ($validated) {
			$subtotal = 0; $discount = (float)($validated['discount_total'] ?? 0); $taxTotal = 0;
			foreach ($validated['items'] as $row) {
				$qty = (float)$row['qty'];
				$price = (float)$row['unit_price'];
				$lineDiscount = (float)($row['line_discount'] ?? 0);
				$line = max(0, $qty * $price - $lineDiscount);
				$lineTax = (float)($row['tax_rate'] ?? 0) * $line / 100.0;
				$subtotal += $qty * $price;
				$taxTotal += $lineTax;
			}
			$grand = max(0, $subtotal - $discount + $taxTotal);
			$paid = (float)$validated['paid_total'];
			$balance = max(0, $grand - $paid);
			$status = $balance <= 0 ? 'paid' : ($paid > 0 ? 'partial' : 'unpaid');

			$invoice = 'INV-'.date('Ym').'-'.Str::upper(Str::random(5));

			$sale = Sale::create([
				'invoice_no' => $invoice,
				'customer_id' => $validated['customer_id'] ?? null,
				'barber' => $validated['barber'] ?? null,
				'subtotal' => $subtotal,
				'discount_total' => $discount,
				'tax_total' => $taxTotal,
				'grand_total' => $grand,
				'paid_total' => $paid,
				'balance' => $balance,
				'payment_status' => $status,
				'payment_method' => $validated['payment_method'],
				'notes' => $validated['notes'] ?? null,
			]);

			foreach ($validated['items'] as $row) {
				$qty = (float)$row['qty'];
				$price = (float)$row['unit_price'];
				$lineDiscount = (float)($row['line_discount'] ?? 0);
				$line = max(0, $qty * $price - $lineDiscount);
				$lineTax = (float)($row['tax_rate'] ?? 0) * $line / 100.0;
				SaleItem::create([
					'sale_id' => $sale->id,
					'item_type' => $row['item_type'],
					'item_id' => $row['item_id'],
					'name_snapshot' => $row['name'],
					'qty' => $qty,
					'unit_price' => $price,
					'line_discount' => $lineDiscount,
					'tax_amount' => $lineTax,
					'line_total' => $line + $lineTax,
				]);
			}

			if ($paid > 0) {
				SalePayment::create([
					'sale_id' => $sale->id,
					'method' => $validated['payment_method'],
					'amount' => $paid,
					'reference' => $validated['notes'] ?? null,
				]);
			}

			return response()->json([
				'id' => $sale->id,
				'invoice_no' => $sale->invoice_no,
				'grand_total' => (float)$sale->grand_total,
				'payment_status' => $sale->payment_status,
			], 201);
		});
	}
}


