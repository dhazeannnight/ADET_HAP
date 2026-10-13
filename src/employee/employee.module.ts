import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [
        DatabaseModule, 
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService],
})
export class EmployeeModule {}