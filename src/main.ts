import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.PORT);
    app.enableCors();
    // await app.listen(+port);

    app.getHttpAdapter().get('/', (req, res) => res.send({ message: 'Server Running Successfully: Created by PARADELA' }));

    await app.listen(port, '0.0.0.0');
    console.log(`Server is running on http://localhost:${port}`);
}

bootstrap();