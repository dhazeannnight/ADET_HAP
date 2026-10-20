import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SizesService {
	constructor(private db: DatabaseService) {}

	private pool = () => this.db.getPool();

	async createSize(size_name: string,
		size_category: string,
		size_unit: string,
		size_status: string) {

		const [result] = await this.pool().execute<OkPacket>(
			'INSERT INTO sizes (size_name, size_category, size_unit, size_status) VALUES (?, ?, ?, ?)',
			[size_name, size_category, size_unit, size_status],
		);
		return { id: result.insertId, size_name, size_category, size_unit, size_status };
	}

	async findById(id: number) {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			'SELECT * FROM sizes WHERE size_id = ?',
			[id],
		);
		return rows[0];
	}

	async getAll() {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			'SELECT * FROM sizes',
		);
		return rows;
	}

	async updateSize(id: number, partial: {
		size_name?: string; size_category?: string;
		size_unit?: string; size_status?: string;}) {
		const fields: string[] = [];
		const values: any[] = [];

		if (partial.size_name) {
			fields.push('size_name = ?');
			values.push(partial.size_name);
		}

		if (partial.size_category) {
			fields.push('size_category = ?');
			values.push(partial.size_category);
		}

		if (partial.size_unit) {
			fields.push('size_unit = ?');
			values.push(partial.size_unit);
		}

		if (partial.size_status) {
			fields.push('size_status = ?');
			values.push(partial.size_status);
		}

		if (fields.length === 0) return await this.findById(id);
		values.push(id);
		const sql = `UPDATE sizes SET ${fields.join(', ')} WHERE size_id = ?`;
		await this.pool().execute(sql, values);
		return this.findById(id);
	}

	async deleteSize(id: number) {
		const [res] = await this.pool().execute<OkPacket>('DELETE FROM sizes WHERE size_id = ?', [id]);
		return res.affectedRows > 0;
	}
}