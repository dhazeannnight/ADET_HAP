import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PurchaseOrderService } from './purchase_order.service';
import { PurchaseOrderController } from './purchase_order.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [
		DatabaseModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [PurchaseOrderController],
	providers: [PurchaseOrderService],
	exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}