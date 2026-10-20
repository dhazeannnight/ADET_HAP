import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProductVariantService } from './product_variant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('product_variant')
export class ProductVariantController {
	constructor(private productVariantService: ProductVariantService) {}

	// Get all product variants (protected)
	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll() {
		return this.productVariantService.getAll();
	}

	// Get single product variant by ID (protected)
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getOne(@Param('id') id: string) {
		return this.productVariantService.findById(+id);
	}

	// Create product variant (open - for demo)
	@Post()
	async create(@Body() body: { product_id: number; size_id: number; color_id: number; variant_stock_quantity: number;
		variant_location: string; variant_status: string; variant_last_restock_date: string;}) {
		return this.productVariantService.createProductVariant( 
			body.product_id, body.size_id, body.color_id,
			body.variant_stock_quantity, body.variant_location,
			body.variant_status, body.variant_last_restock_date
		);
	}

	// Update product variant (protected)
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async update(@Param('id') id: string, @Body() body: any) {
		return this.productVariantService.updateProductVariant(+id, body);
	}

	// Delete product variant (protected)
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.productVariantService.deleteProductVariant(+id);
	}
}