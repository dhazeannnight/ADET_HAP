import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { SizesModule } from './sizes/sizes.module';
import { ColorModule } from './color/color.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductVariantModule } from './product_variant/product_variant.module';
import { PurchaseOrderModule } from './purchase_order/purchase_order.module';
import { ProductPurchaseModule } from './product_purchase/product_purchase.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, EmployeeModule, CategoryModule, ProductModule, 
    SizesModule, ColorModule, SupplierModule, ProductVariantModule, PurchaseOrderModule, ProductPurchaseModule],
})

export class AppModule {}