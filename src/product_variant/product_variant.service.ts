import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ProductVariantService {
	constructor(private db: DatabaseService) {}

	private pool = () => this.db.getPool();

	async createProductVariant(product_id: number,
		size_id: number,
		color_id: number,
		variant_stock_quantity: number,
		variant_location: string,
		variant_status: string,
		variant_last_restock_date: string) {

		const [result] = await this.pool().execute<OkPacket>(
			`INSERT INTO product_variant (product_id, size_id, color_id, variant_stock_quantity, 
			variant_location, variant_status, variant_last_restock_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[product_id, size_id, color_id, variant_stock_quantity,
				variant_location, variant_status, variant_last_restock_date],
		);
		return { id: result.insertId, product_id, size_id, color_id, variant_stock_quantity,
			variant_location, variant_status, variant_last_restock_date };
	}

	async findById(id: number) {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			`SELECT * FROM product_variant WHERE product_variant_id = ?`,
			[id],
		);
		return rows[0];
	}

	async getAll() {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			`SELECT * FROM product_variant`,
		);
		return rows;
	}

	async updateProductVariant(id: number, partial: {
		product_id?: number; size_id?: number; color_id?: number; 
		variant_stock_quantity?: number; variant_location?: string;
		variant_status?: string; variant_last_restock_date?: string;}) {
		const fields: string[] = [];
		const values: any[] = [];

		if (partial.product_id) {
			fields.push('product_id = ?');
			values.push(partial.product_id);
		}

		if (partial.size_id) {
			fields.push('size_id = ?');
			values.push(partial.size_id);
		}

		if (partial.color_id) {
			fields.push('color_id = ?');
			values.push(partial.color_id);
		}

		if (partial.variant_stock_quantity !== undefined) {
			fields.push('variant_stock_quantity = ?');
			values.push(partial.variant_stock_quantity);
		}

		if (partial.variant_location) {
			fields.push('variant_location = ?');
			values.push(partial.variant_location);
		}

		if (partial.variant_status) {
			fields.push('variant_status = ?');
			values.push(partial.variant_status);
		}

		if (partial.variant_last_restock_date) {
			fields.push('variant_last_restock_date = ?');
			values.push(partial.variant_last_restock_date);
		}

		if (fields.length === 0) return await this.findById(id);
		values.push(id);
		const sql = `UPDATE product_variant SET ${fields.join(', ')} WHERE product_variant_id = ?`;
		await this.pool().execute(sql, values);
		return this.findById(id);
	}

	async deleteProductVariant(id: number) {
		const [res] = await this.pool().execute<OkPacket>(`DELETE FROM product_variant WHERE product_variant_id = ?`, [id],);
		return res.affectedRows > 0;
	}
}