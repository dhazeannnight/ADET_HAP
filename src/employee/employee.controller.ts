import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('employee')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    // Get all employees (protected)
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return this.employeeService.getAll();
    }

    // Get single employee by ID (protected)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.employeeService.findById(+id);
    }

    // Create employee (open - for demo)
    @Post()
    async create(@Body() body: { user_id?: number; employee_first_name: string;
        employee_last_name: string; employee_position: string; employee_contact_number: string;
        employee_email: string; employee_status: string;}) {
            return this.employeeService.createEmployee(body.user_id || null,
                body.employee_first_name, body.employee_last_name,
                body.employee_position, body.employee_contact_number,
                body.employee_email, body.employee_status);
            }

    // Update employee (protected)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.employeeService.updateEmployee(+id, body);
    }
    
    // Delete employee (protected)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.employeeService.deleteEmployee(+id);
    }
}