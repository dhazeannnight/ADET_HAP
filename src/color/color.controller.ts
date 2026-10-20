import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ColorService } from './color.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('color')
export class ColorController {
	constructor(private colorService: ColorService) {}

	// Get all colors (protected)
	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll() {
		return this.colorService.getAll();
	}

	// Get single color by ID (protected)
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getOne(@Param('id') id: string) {
		return this.colorService.findById(+id);
	}

	// Create color (open - for demo)
	@Post()
	async create(@Body() body: { color_name: string;
		color_group: string; color_type: string;
		color_status: string;}) {
		return this.colorService.createColor(
			body.color_name, body.color_group,
			body.color_type, body.color_status
		);
	}

	// Update color (protected)
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async update(@Param('id') id: string, @Body() body: any) {
		return this.colorService.updateColor(+id, body);
	}

	// Delete color (protected)
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.colorService.deleteColor(+id);
	}
}