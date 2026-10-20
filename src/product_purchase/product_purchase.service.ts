import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ProductPurchaseService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    async createProductPurchase(purchase_order_id: number,
        variant_id: number,
        product_purchase_quantity_ordered: number,
        product_purchase_status: string,
        product_purchase_quantity_received?: number,
        product_purchase_received_date?: string) {
        const qtyReceived = product_purchase_quantity_received ?? null;
        const dateReceived = product_purchase_received_date || null;

        const [result] = await this.pool().execute<OkPacket>(
            `INSERT INTO product_purchase (purchase_order_id, variant_id, product_purchase_quantity_ordered, 
			product_purchase_quantity_received, product_purchase_status, product_purchase_received_date) VALUES (?, ?, ?, ?, ?, ?)`,
            [purchase_order_id, variant_id, product_purchase_quantity_ordered, qtyReceived, product_purchase_status, dateReceived],
        );

        return { id: result.insertId, purchase_order_id, variant_id, product_purchase_quantity_ordered,
            product_purchase_quantity_received: qtyReceived, product_purchase_status, product_purchase_received_date: dateReceived };
    }

    async findById(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT * FROM product_purchase WHERE product_purchase_id = ?`,
            [id],
        );
        return rows[0];
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT * FROM product_purchase`,
        );
        return rows;
    }

    async updateProductPurchase(id: number, partial: {
		purchase_order_id?: number; variant_id?: number; product_purchase_quantity_ordered?: number;
		product_purchase_quantity_received?: number; product_purchase_status?: string; product_purchase_received_date?: string;}) {
        const fields: string[] = [];
        const values: any[] = [];

        if (partial.purchase_order_id !== undefined) {
            fields.push('purchase_order_id = ?');
            values.push(partial.purchase_order_id);
        }

        if (partial.variant_id !== undefined) {
            fields.push('variant_id = ?');
            values.push(partial.variant_id);
        }

        if (partial.product_purchase_quantity_ordered !== undefined) {
            fields.push('product_purchase_quantity_ordered = ?');
            values.push(partial.product_purchase_quantity_ordered);
        }

        if (partial.product_purchase_quantity_received !== undefined) {
            fields.push('product_purchase_quantity_received = ?');
            values.push(partial.product_purchase_quantity_received ?? null);
        }

        if (partial.product_purchase_status !== undefined) {
            fields.push('product_purchase_status = ?');
            values.push(partial.product_purchase_status);
        }

        if (partial.product_purchase_received_date !== undefined) {
            fields.push('product_purchase_received_date = ?');
            values.push(partial.product_purchase_received_date || null);
        }

        if (fields.length === 0) return await this.findById(id);
        values.push(id);
        const sql = `UPDATE product_purchase SET ${fields.join(', ')} WHERE product_purchase_id = ?`;
        await this.pool().execute(sql, values);
        return this.findById(id);
    }

    async deleteProductPurchase(id: number) {
        const [res] = await this.pool().execute<OkPacket>(`DELETE FROM product_purchase WHERE product_purchase_id = ?`, [id]);
        return res.affectedRows > 0;
    }
}