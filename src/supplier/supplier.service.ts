import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SupplierService {
	constructor(private db: DatabaseService) {}

	private pool = () => this.db.getPool();

	async createSupplier(supplier_name: string,
		supplier_contact_number: string,
		supplier_email: string,
		supplier_address: string,
		supplier_status: string) {

		const [result] = await this.pool().execute<OkPacket>(
			`INSERT INTO supplier (supplier_name, supplier_contact_number, supplier_email, supplier_address, 
			supplier_status) VALUES (?, ?, ?, ?, ?)`,
			[supplier_name, supplier_contact_number, supplier_email, supplier_address, supplier_status],
		);
		return { id: result.insertId, supplier_name, supplier_contact_number, supplier_email, 
			supplier_address, supplier_status };
	}

	async findById(id: number) {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			'SELECT * FROM supplier WHERE supplier_id = ?',
			[id],
		);
		return rows[0];
	}

	async getAll() {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			'SELECT * FROM supplier',
		);
		return rows;
	}

	async updateSupplier(id: number, partial: {
		supplier_name?: string; supplier_contact_number?: string;
		supplier_email?: string; supplier_address?: string;
		supplier_status?: string;}) {
		const fields: string[] = [];
		const values: any[] = [];

		if (partial.supplier_name) {
			fields.push('supplier_name = ?');
			values.push(partial.supplier_name);
		}

		if (partial.supplier_contact_number) {
			fields.push('supplier_contact_number = ?');
			values.push(partial.supplier_contact_number);
		}

		if (partial.supplier_email) {
			fields.push('supplier_email = ?');
			values.push(partial.supplier_email);
		}

		if (partial.supplier_address) {
			fields.push('supplier_address = ?');
			values.push(partial.supplier_address);
		}

		if (partial.supplier_status) {
			fields.push('supplier_status = ?');
			values.push(partial.supplier_status);
		}

		if (fields.length === 0) return await this.findById(id);
		values.push(id);
		const sql = `UPDATE supplier SET ${fields.join(', ')} WHERE supplier_id = ?`;
		await this.pool().execute(sql, values);
		return this.findById(id);
	}

	async deleteSupplier(id: number) {
		const [res] = await this.pool().execute<OkPacket>('DELETE FROM supplier WHERE supplier_id = ?', [id]);
		return res.affectedRows > 0;
	}
}