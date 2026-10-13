import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ProductService {
	constructor(private db: DatabaseService) {}

	private pool = () => this.db.getPool();

	async createProduct(category_id: number,
		product_name: string, 
        product_brand: string,
		product_type: string,
		product_gender: string,
		product_age_group: string,
		product_status: string) {
        // const hashed = await bcrypt.hash(password, 10);

		const [result] = await this.pool().execute<OkPacket>(
			`INSERT INTO product (category_id, product_name, product_brand, product_type, product_gender, 
            product_age_group, product_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[category_id, product_name, product_brand, product_type,
			product_gender, product_age_group, product_status],
		);
		return { id: result.insertId, category_id, product_name, product_brand, product_type, 
            product_gender, product_age_group, product_status };
	}

	async findById(id: number) {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			'SELECT * FROM product WHERE product_id = ?',
			[id],
		);
		return rows[0];
	}

	async getAll() {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			'SELECT * FROM product',
		);
		return rows;
	}

	async updateProduct(id: number, partial: {
		category_id?: number; product_name?: string; product_brand?: string;
		product_type?: string; product_gender?: string;
		product_age_group?: string; product_status?: string;}) {
		const fields: string[] = [];
		const values: any[] = [];

		if (partial.category_id !== undefined) {
			fields.push('category_id = ?');
			values.push(partial.category_id);
		}

		if (partial.product_name) {
			fields.push('product_name = ?');
			values.push(partial.product_name);
		}

		if (partial.product_brand) {
			fields.push('product_brand = ?');
			values.push(partial.product_brand);
		}

		if (partial.product_type) {
			fields.push('product_type = ?');
			values.push(partial.product_type);
		}

		if (partial.product_gender) {
			fields.push('product_gender = ?');
			values.push(partial.product_gender);
		}

		if (partial.product_age_group) {
			fields.push('product_age_group = ?');
			values.push(partial.product_age_group);
		}

		if (partial.product_status) {
			fields.push('product_status = ?');
			values.push(partial.product_status);
		}

		if (fields.length === 0) return await this.findById(id);
		values.push(id);
		const sql = `UPDATE product SET ${fields.join(', ')} WHERE product_id = ?`;
		await this.pool().execute(sql, values);
		return this.findById(id);
	}

	async deleteProduct(id: number) {
		const [res] = await this.pool().execute<OkPacket>('DELETE FROM product WHERE product_id = ?', [id]);
		return res.affectedRows > 0;
	}
}