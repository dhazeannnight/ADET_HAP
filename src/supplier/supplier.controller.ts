import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('supplier')
export class SupplierController {
	constructor(private supplierService: SupplierService) {}

	// Get all suppliers (protected)
	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll() {
		return this.supplierService.getAll();
	}

	// Get single supplier by ID (protected)
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getOne(@Param('id') id: string) {
		return this.supplierService.findById(+id);
	}

	// Create supplier (open - for demo)
	@Post()
	async create(@Body() body: { supplier_name: string;
		supplier_contact_number: string; supplier_email: string;
		supplier_address: string; supplier_status: string;}) {
		return this.supplierService.createSupplier( body.supplier_name, 
            body.supplier_contact_number, body.supplier_email, 
            body.supplier_address, body.supplier_status
		);
	}

	// Update supplier (protected)
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async update(@Param('id') id: string, @Body() body: any) {
		return this.supplierService.updateSupplier(+id, body);
	}

	// Delete supplier (protected)
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.supplierService.deleteSupplier(+id);
	}
}