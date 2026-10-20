import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProductPurchaseService } from './product_purchase.service';
import { ProductPurchaseController } from './product_purchase.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [
		DatabaseModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [ProductPurchaseController],
	providers: [ProductPurchaseService],
	exports: [ProductPurchaseService],
})
export class ProductPurchaseModule {}