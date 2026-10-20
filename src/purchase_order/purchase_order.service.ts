import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PurchaseOrderService {
	constructor(private db: DatabaseService) {}

	private pool = () => this.db.getPool();

	async createPurchaseOrder(supplier_id: number,
		employee_id: number,
		purchase_order_date: string,
		purchase_expected_date: string,
		purchase_order_status: string,
		purchase_order_received_date?: string) {

		if (!employee_id) {
			throw new ForbiddenException('Employee ID missing from request token.');
		}

		// JOIN employee with users to get the role using user_id
		const [userRows] = await this.pool().execute<RowDataPacket[]>(
			`SELECT u.role 
			FROM employee e 
			 JOIN users u ON e.user_id = u.id 
			 WHERE e.employee_id = ?`, [employee_id]);

		if (!userRows.length || userRows[0].role === 'user') {
			throw new ForbiddenException(
				'Unauthorized: Purchase order creation requires manager or admin privileges.');
		}

		// 2. Insert Purchase Order
		const [result] = await this.pool().execute<OkPacket>(
			`INSERT INTO purchase_order (supplier_id, employee_id, purchase_order_date, purchase_expected_date, 
			purchase_order_received_date, purchase_order_status) VALUES (?, ?, ?, ?, ?, ?)`,
			[supplier_id, employee_id, purchase_order_date, purchase_expected_date,
				purchase_order_received_date || null, purchase_order_status],
		);
		return { id: result.insertId, supplier_id, employee_id, purchase_order_date, purchase_expected_date,
			purchase_order_received_date: purchase_order_received_date || null, purchase_order_status};
	}

	async findById(id: number) {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			`SELECT * FROM purchase_order WHERE purchase_order_id = ?`,
			[id],
		);
		return rows[0];
	}

	async getAll() {
		const [rows] = await this.pool().execute<RowDataPacket[]>(
			`SELECT * FROM purchase_order`,
		);
		return rows;
	}

	async updatePurchaseOrder(id: number, partial: { 
		supplier_id?: number; employee_id?: number; purchase_order_date?: string;
		purchase_expected_date?: string; purchase_order_received_date?: string; 
		purchase_order_status?: string;}) {
		const fields: string[] = [];
		const values: any[] = [];

		if (partial.supplier_id) {
			fields.push('supplier_id = ?');
			values.push(partial.supplier_id);
		}

		if (partial.employee_id) {
			fields.push('employee_id = ?');
			values.push(partial.employee_id);
		}

		if (partial.purchase_order_date) {
			fields.push('purchase_order_date = ?');
			values.push(partial.purchase_order_date);
		}

		if (partial.purchase_expected_date) {
			fields.push('purchase_expected_date = ?');
			values.push(partial.purchase_expected_date);
		}

		if (partial.purchase_order_received_date !== undefined) {
			fields.push('purchase_order_received_date = ?');
			values.push(partial.purchase_order_received_date);
		}

		if (partial.purchase_order_status) {
			fields.push('purchase_order_status = ?');
			values.push(partial.purchase_order_status);
		}

		if (fields.length === 0) return await this.findById(id);
		values.push(id);
		const sql = `UPDATE purchase_order SET ${fields.join(', ')} WHERE purchase_order_id = ?`;
		await this.pool().execute(sql, values);
		return this.findById(id);
	}

	async deletePurchaseOrder(id: number) {
		const [res] = await this.pool().execute<OkPacket>(
			`DELETE FROM purchase_order WHERE purchase_order_id = ?`,
			[id],
		);
		return res.affectedRows > 0;
	}
}