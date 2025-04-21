import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Bootstrap');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.PORT,
      }
    }
  );
  
  
  app.useGlobalPipes(new ValidationPipe({     
    whitelist: true,
    forbidNonWhitelisted: true,
   }));
 

  
  logger.log(`Micro ServivesApplication is running on: ${envs.PORT}`);
}
bootstrap();
