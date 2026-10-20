import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CategoryService {
	constructor(private db: DatabaseService) {}

	private pool = () => this.db.getPool();

	async createCategory(category_name: string,
		category_type: string,
		category_section: string,
		category_status: string) {
		// const hashed = await bcrypt.hash(password, 10);

		const [result] = await this.pool().execute<OkPacket>(
			`INSERT INTO category (category_name, category_type,
			category_section, category_status) VALUES (?, ?, ?, ?)`,
			[category_name, category_type, category_section, category_status],
		);
		return { id: result.insertId, category_name, category_type, category_section, category_status };
	}

	async findById(id: number) {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			`SELECT * FROM category WHERE category_id = ?`,
			[id],
		);
		return rows[0];
	}

	async getAll() {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			`SELECT * FROM category`,
		);
		return rows;
	}

	async updateCategory(id: number, partial: {
		category_name?: string; category_type?: string;
		category_section?: string; category_status?: string;}) {
		const fields: string[] = [];
		const values: any[] = [];

		if (partial.category_name) {
			fields.push('category_name = ?');
			values.push(partial.category_name);
		}

		if (partial.category_type) {
			fields.push('category_type = ?');
			values.push(partial.category_type);
		}

		if (partial.category_section) {
			fields.push('category_section = ?');
			values.push(partial.category_section);
		}

		if (partial.category_status) {
			fields.push('category_status = ?');
			values.push(partial.category_status);
		}

		if (fields.length === 0) return await this.findById(id);
		values.push(id);
		const sql = `UPDATE category SET ${fields.join(', ')} WHERE category_id = ?`;
		await this.pool().execute(sql, values);
		return this.findById(id);
	}

	async deleteCategory(id: number) {
		const [res] = await this.pool().execute<OkPacket>(`DELETE FROM category WHERE category_id = ?`, [id]);
		return res.affectedRows > 0;
	}
}