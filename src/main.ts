import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common'; // 'ClassSerializerInterceptor' es un interceptor que nos permite hacer serializaciones en nuestra aplicacion. Lo podemos aplicar globalmente en nuestra aplicacion con 'app.useGlobalInterceptors', como abajo.
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // Declaramos lo siguiente (transformOptions), específicamente para que cuando se pasen como parametros muchas cosas (usando @Query), nuestro ParseIntPipe transforme implicitamente aquellos parametros a los valores esperados
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Con esta linea activamos que podamos usar la tecnica de serializacion en cualquier parte de nuestra aplicacion

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('PLATZI STORE')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
