import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('purchase_order')
export class PurchaseOrderController {
	constructor(private purchaseOrderService: PurchaseOrderService) {}

	// Get all purchase orders (protected)
	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll() {
		return this.purchaseOrderService.getAll();
	}

	// Get single purchase order by ID (protected)
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getOne(@Param('id') id: string) {
		return this.purchaseOrderService.findById(+id);
	}

	// Create purchase order (open - for demo)
	@Post()
	async create(@Body() body: { supplier_id: number; 
		employee_id: number; purchase_order_date: string; purchase_expected_date: string; 
		purchase_order_status: string; purchase_order_received_date?: string;}) {
		return this.purchaseOrderService.createPurchaseOrder(
			body.supplier_id, body.employee_id, body.purchase_order_date, 
			body.purchase_expected_date, body.purchase_order_status, body.purchase_order_received_date,
		);
	}

	// Update purchase order (protected)
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async update(@Param('id') id: string, @Body() body: any) {
		return this.purchaseOrderService.updatePurchaseOrder(+id, body);
	}

	// Delete purchase order (protected)
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.purchaseOrderService.deletePurchaseOrder(+id);
	}
}