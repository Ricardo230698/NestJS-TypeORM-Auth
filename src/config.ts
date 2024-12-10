// NOTA IMPORTANTE: Este archivo de configuración (con las variables de entorno) se puede inyectar en otras clases de la aplicación de la siguiente manera en el constructor: @Inject(config.KEY) private configService: ConfigType<typeof config>

// La clave config.KEY no se refiere a una propiedad definida en el archivo config que muestras (este archivo), sino que es una propiedad generada automáticamente por registerAs.
// Cuando defines el archivo config usando registerAs('config', ...), NestJS automáticamente registra este módulo de configuración bajo la clave 'config'. Así, config.KEY se convierte en el token de inyección que NestJS usa para identificar este archivo de configuración cuando se inyecta en otro lugar de la aplicación.
// Entonces:
// config.KEY apunta al registro bajo 'config', y al usar @Inject(config.KEY), le indicas a NestJS que inyecte esta configuración en configService.
// Luego, puedes acceder a propiedades de configuración como this.configService.apiKey, this.configService.mysql, etc.

import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  // La clave 'config' que defines en registerAs('config', ...) es la que NestJS usará para identificar este conjunto de configuraciones. Por lo tanto: Si cambias 'config' a otro nombre, como 'mySettings', entonces tendrás que usar @Inject(mySettings.KEY) en lugar de @Inject(config.KEY). El nombre del archivo (config.ts, settings.ts, etc.) no afecta el token de inyección; lo que importa es el nombre que definas dentro de registerAs.
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    // postgres: {
    //   dbName: process.env.POSTGRES_DB,
    //   port: parseInt(process.env.POSTGRES_PORT, 10),
    //   password: process.env.POSTGRES_PASSWORD,
    //   user: process.env.POSTGRES_USER,
    //   host: process.env.POSTGRES_HOST,
    // },
    mysql: {
      dbName: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT, 10),
      password: process.env.MYSQL_ROOT_PASSWORD,
      user: process.env.MYSQL_USER,
      host: process.env.MYSQL_HOST,
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
  };
});
