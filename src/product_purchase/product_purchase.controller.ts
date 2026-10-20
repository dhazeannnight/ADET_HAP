import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProductPurchaseService } from './product_purchase.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('product_purchase')
export class ProductPurchaseController {
    constructor(private productPurchaseService: ProductPurchaseService) {}

    // Get all product purchases (protected)
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return this.productPurchaseService.getAll();
    }

    // Get single product purchase by ID (protected)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.productPurchaseService.findById(+id);
    }

    // Create product purchase (open - for demo)
    @Post()
    async create(@Body()body: { purchase_order_id: number;
		variant_id: number; product_purchase_quantity_ordered: number; product_purchase_status: string;
		product_purchase_quantity_received?: number; product_purchase_received_date?: string;}) {
        return this.productPurchaseService.createProductPurchase(
			body.purchase_order_id, body.variant_id, body.product_purchase_quantity_ordered, 
			body.product_purchase_status, body.product_purchase_quantity_received, body.product_purchase_received_date,
        );
    }

    // Update product purchase (protected)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.productPurchaseService.updateProductPurchase(+id, body);
    }

    // Delete product purchase (protected)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productPurchaseService.deleteProductPurchase(+id);
    }
}