import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sizes')
export class SizesController {
	constructor(private sizesService: SizesService) {}

	// Get all sizes (protected)
	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll() {
		return this.sizesService.getAll();
	}

	// Get single size by ID (protected)
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getOne(@Param('id') id: string) {
		return this.sizesService.findById(+id);
	}

	// Create size (open - for demo)
	@Post()
	async create(@Body() body: { size_name: string;
		size_category: string; size_unit: string;
		size_status: string;}) {
		return this.sizesService.createSize(
			body.size_name, body.size_category,
			body.size_unit, body.size_status
		);
	}

	// Update size (protected)
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async update(@Param('id') id: string, @Body() body: any) {
		return this.sizesService.updateSize(+id, body);
	}

	// Delete size (protected)
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.sizesService.deleteSize(+id);
	}
}