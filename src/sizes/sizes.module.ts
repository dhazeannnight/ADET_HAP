import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [
		DatabaseModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [SizesController],
	providers: [SizesService],
	exports: [SizesService],
})
export class SizesModule {}