import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProductVariantService } from './product_variant.service';
import { ProductVariantController } from './product_variant.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [
		DatabaseModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [ProductVariantController],
	providers: [ProductVariantService],
	exports: [ProductVariantService],
})
export class ProductVariantModule {}