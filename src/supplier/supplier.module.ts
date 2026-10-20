import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [
		DatabaseModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [SupplierController],
	providers: [SupplierService],
	exports: [SupplierService],
})
export class SupplierModule {}