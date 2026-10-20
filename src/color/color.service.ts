import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ColorService {
	constructor(private db: DatabaseService) {}

	private pool = () => this.db.getPool();

	async createColor(color_name: string,
		color_group: string,
		color_type: string,
		color_status: string) {

		const [result] = await this.pool().execute<OkPacket>(
			'INSERT INTO color (color_name, color_group, color_shade, color_status) VALUES (?, ?, ?, ?)',
			[color_name, color_group, color_type, color_status],
		);
		return { id: result.insertId, color_name, color_group, color_type, color_status };
	}

	async findById(id: number) {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			'SELECT * FROM color WHERE color_id = ?',
			[id],
		);
		return rows[0];
	}

	async getAll() {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			'SELECT * FROM color',
		);
		return rows;
	}

	async updateColor(id: number, partial: {
		color_name?: string; color_group?: string;
		color_type?: string; color_status?: string;}) {
		const fields: string[] = [];
		const values: any[] = [];

		if (partial.color_name) {
			fields.push('color_name = ?');
			values.push(partial.color_name);
		}

		if (partial.color_group) {
			fields.push('color_group = ?');
			values.push(partial.color_group);
		}

		if (partial.color_type) {
			fields.push('color_shade = ?');
			values.push(partial.color_type);
		}

		if (partial.color_status) {
			fields.push('color_status = ?');
			values.push(partial.color_status);
		}

		if (fields.length === 0) return await this.findById(id);
		values.push(id);
		const sql = `UPDATE color SET ${fields.join(', ')} WHERE color_id = ?`;
		await this.pool().execute(sql, values);
		return this.findById(id);
	}

	async deleteColor(id: number) {
		const [res] = await this.pool().execute<OkPacket>('DELETE FROM color WHERE color_id = ?', [id]);
		return res.affectedRows > 0;
	}
}