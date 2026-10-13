import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmployeeService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    async createEmployee(user_id: number | null,
        employee_first_name: string,
        employee_last_name: string,
        employee_position: string,
        employee_contact_number: string,
        employee_email: string,
        employee_status: string) {
        // const hashed = await bcrypt.hash(password, 10);
        
        const [result] = await this.pool().execute<OkPacket>(
            `INSERT INTO employee (user_id, employee_first_name, employee_last_name, employee_position, 
            employee_contact_number, employee_email, employee_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id || null, employee_first_name, employee_last_name, employee_position,
                employee_contact_number, employee_email, employee_status],
        );
        return { id: result.insertId, employee_first_name, employee_last_name, employee_email };
    }

    async findById(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT * FROM employee WHERE employee_id = ?',
            [id],
        );
        return rows[0];
    }
    
    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT * FROM employee',
        );return rows;
    }

    async updateEmployee(id: number, partial: {user_id?: number;
        employee_first_name?: string; employee_last_name?: string;
        employee_position?: string; employee_contact_number?: string;
        employee_email?: string; employee_status?: string;}) {
            const fields: string[] = [];
            const values: any[] = [];
            
            if (partial.user_id !== undefined) {
                fields.push('user_id = ?');
                values.push(partial.user_id);
            }
            
            if (partial.employee_first_name) {
                fields.push('employee_first_name = ?');
                values.push(partial.employee_first_name);
            }
            
            if (partial.employee_last_name) {
                fields.push('employee_last_name = ?');
                values.push(partial.employee_last_name);
            }
            
            if (partial.employee_position) {
                fields.push('employee_position = ?');
                values.push(partial.employee_position);
            }
            
            if (partial.employee_contact_number) {
                fields.push('employee_contact_number = ?');
                values.push(partial.employee_contact_number);
            }
            
            if (partial.employee_email) {
                fields.push('employee_email = ?');
                values.push(partial.employee_email);
            }
            
            if (partial.employee_status) {
                fields.push('employee_status = ?');
                values.push(partial.employee_status);
            }
            
            if (fields.length === 0) return await this.findById(id);
            values.push(id);
            const sql = `UPDATE employee SET ${fields.join(', ')} WHERE employee_id = ?`;
            await this.pool().execute(sql, values);
            return this.findById(id);
        }

    async deleteEmployee(id: number) {
        const [res] = await this.pool().execute<OkPacket>('DELETE FROM employee WHERE employee_id = ?', [id]);
        return res.affectedRows > 0;
    }
}