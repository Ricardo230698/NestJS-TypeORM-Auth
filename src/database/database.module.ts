import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as mysql from 'mysql2/promise'; // Proveedor para establecer una conexión manual a MySQL usando el cliente MySQL de Node.js.

import config from '../config';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

// client.query('SELECT * FROM tasks', (err, res) => {
//   console.error(err);
//   console.log(res.rows);
// });

@Global()
@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   inject: [config.KEY],
    //   useFactory: (configService: ConfigType<typeof config>) => {
    //     const { user, host, dbName, password, port } = configService.postgres;
    //     return {
    //       type: 'postgres',
    //       host,
    //       port,
    //       username: user,
    //       password,
    //       database: dbName,
    //       synchronize: false,
    //       autoLoadEntities: true,
    //     };
    //   },
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          url: process.env.DATABASE_URL, // Usamos DATABASE_URL directamente
          synchronize: true, // Cambiar a false en producción
          autoLoadEntities: true,
          logging: true,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    // {
    //   provide: 'PG',
    //   useFactory: (configService: ConfigType<typeof config>) => {
    //     const { user, host, dbName, password, port } = configService.postgres;
    //     const client = new Client({
    //       user,
    //       host,
    //       database: dbName,
    //       password,
    //       port,
    //     });
    //     client.connect();
    //     return client;
    //   },
    //   inject: [config.KEY],
    // },

    // Si deseas tener un proveedor similar para MySQL, puedes crear uno usando el cliente MySQL de Node.js. Sin embargo, ten en cuenta que al usar TypeORM con NestJS, ya tienes la conexión gestionada por TypeORM a través de TypeOrmModule, lo cual suele ser suficiente para la mayoría de los casos. Si aún así deseas tener un proveedor específico para MySQL que te permita realizar consultas manuales o tener un control más granular sobre la conexión, aquí esta:
    {
      provide: 'MYSQL', //Este proveedor es útil si necesitas realizar consultas personalizadas o manejar la conexión MySQL fuera del contexto de TypeORM. Si solo estás utilizando TypeORM para interactuar con la base de datos, no necesitas este proveedor adicional.
      useFactory: async () => {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        return connection;
      },
      inject: [config.KEY],
    },
  ],
  // exports: ['API_KEY', 'PG', TypeOrmModule],
  exports: ['API_KEY', 'MYSQL', TypeOrmModule],
})
export class DatabaseModule {}
