import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [
		DatabaseModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [ColorController],
	providers: [ColorService],
	exports: [ColorService],
})
export class ColorModule {}