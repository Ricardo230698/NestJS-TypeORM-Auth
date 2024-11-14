import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';
import config from './config';
import { lastValueFrom } from 'rxjs';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env', // Esta línea establece el archivo de configuración de ambiente que ConfigModule cargará al iniciar la aplicación en función del entorno (environment) en el que se esté ejecutando. -- Pregunta: ¿Cómo funciona esta línea? Respuesta al final...
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    HttpModule,
    UsersModule,
    ProductsModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => {
        const request = http.get('https://jsonplaceholder.typicode.com/todos');
        const tasks = await lastValueFrom(request);
        return tasks.data;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}


// ---
// -- Pregunta: ¿Cómo funciona esta línea?
// Explicación paso a paso:
// process.env.NODE_ENV: process.env es un objeto en Node.js que contiene las variables de entorno que se establecen en el sistema operativo o se configuran para la aplicación. NODE_ENV es una variable de entorno comúnmente utilizada para indicar el entorno de ejecución, como "development", "production" o "test".

// enviroments[process.env.NODE_ENV]: Aquí se accede al objeto enviroments, que probablemente es un objeto que define diferentes archivos .env según el entorno. Por ejemplo, enviroments podría tener un formato como este:

// export const enviroments = {
//   development: '.env.development',
//   production: '.env.production',
//   test: '.env.test',
// };

// De esta manera, enviroments[process.env.NODE_ENV] seleccionará el archivo de configuración correspondiente al valor de NODE_ENV. Si NODE_ENV es 'development', esta expresión devolverá '.env.development'.

// || '.env': El operador || (OR) asegura que, si no se encuentra un archivo correspondiente en el objeto enviroments, se usará '.env' como archivo predeterminado.

// En resumen
// La línea completa selecciona el archivo de configuración adecuado según el entorno de ejecución de la aplicación. Si NODE_ENV es development, cargará '.env.development'; si es production, cargará '.env.production'; y así sucesivamente. Si no se define NODE_ENV o el valor no tiene un archivo asociado en enviroments, se usará '.env' como archivo de configuración predeterminado.

// Pero donde se declara NODE_ENV ?

// La variable NODE_ENV no se declara directamente en tu código, sino que se establece en el entorno en el que ejecutas la aplicación. Hay varias maneras de establecerla, y aquí te explico las más comunes:

// 1. Establecer NODE_ENV en el sistema operativo
// Al iniciar tu aplicación, puedes definir NODE_ENV como parte del comando de inicio. Aquí tienes algunos ejemplos según el sistema operativo:

// En Linux y macOS: NODE_ENV=production npm start
// En Windows: set NODE_ENV=production && npm start

// Este comando establece NODE_ENV para el proceso actual que ejecuta npm start, configurando el entorno en modo production.

// 2. Usar un script en package.json
// En package.json, puedes configurar scripts que incluyan la variable NODE_ENV:
// {
//   "scripts": {
//     "start:dev": "NODE_ENV=development nest start",
//     "start:prod": "NODE_ENV=production nest start"
//   }
// }

// Así, ejecutando npm run start:dev, la aplicación se ejecutará en el entorno de desarrollo, y NODE_ENV se establecerá en development.

// 3. Usar un archivo de configuración de entorno
// Para entornos locales, también puedes definir NODE_ENV en un archivo .env (si usas herramientas que cargan automáticamente las variables de entorno, como dotenv en NestJS). Por ejemplo:

// NODE_ENV=development

// Este archivo .env sería leído automáticamente por ConfigModule si así está configurado, o con alguna librería como dotenv que cargue el archivo al iniciar la aplicación.

// 4. Establecerlo en plataformas de despliegue (como Docker, Heroku, etc.)
// En plataformas como Heroku, AWS, o Docker, puedes establecer NODE_ENV a nivel de configuración del entorno.

// En un archivo Docker, podrías definirlo así:

// ENV NODE_ENV=production

// Cada entorno de ejecución puede tener configurada esta variable para indicar el modo en que se debe ejecutar la aplicación.