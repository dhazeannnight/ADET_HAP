import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('product')
export class ProductController {
	constructor(private productService: ProductService) {}

	// Get all products (protected)
	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll() {
		return this.productService.getAll();
	}

	// Get single product by ID (protected)
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getOne(@Param('id') id: string) {
		return this.productService.findById(+id);
	}

	// Create product (open - for demo)
	@Post()
	async create(@Body() body: { category_id: number; product_name: string; product_brand: string;
		product_type: string; product_gender: string; product_age_group: string; product_status: string;}) {
		return this.productService.createProduct(
			body.category_id, body.product_name, body.product_brand,
			body.product_type, body.product_gender,
			body.product_age_group, body.product_status
		);
	}

	// Update product (protected)
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async update(@Param('id') id: string, @Body() body: any) {
		return this.productService.updateProduct(+id, body);
	}

	// Delete product (protected)
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.productService.deleteProduct(+id);
	}
}