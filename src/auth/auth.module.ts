import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';

import config from '../config'
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({ // Esto registra el módulo de JWT de forma asíncrona. Permite cargar configuraciones dinámicas o dependientes de otros servicios.
      inject: [config.KEY], // inject: [config.KEY]: Utiliza inyección de dependencias para pasar servicios o configuraciones que la función de useFactory usará. En este caso, config.KEY corresponde al servicio de configuración (definido en tu archivo config), lo que permite acceder a las variables de ambiente a través de configService.
      useFactory: (configService: ConfigType<typeof config>) => { // useFactory: useFactory es una función que proporciona la configuración que necesita JwtModule. En lugar de una configuración estática, useFactory permite ejecutar lógica para construir esta configuración (como acceder a variables de ambiente). --- (configService: ConfigType<typeof config>) => { ... }: Esta es la función useFactory, que recibe configService como parámetro (gracias a inject). Aquí es donde se construye la configuración para el JWT.
        return {
          secret: configService.jwtSecret, // secret: configService.jwtSecret: Define la clave secreta para firmar el JWT. Aquí, la clave se obtiene de configService para que sea configurable a través de las variables de entorno.
          signOptions: {
            expiresIn: '10d' // signOptions: { expiresIn: '10d' }: Define las opciones de firma del JWT. Aquí, se establece que los tokens generados expiren en 10 días.
          }
        }
      }
    })
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

// FLUJO DE TODO LO RELACIONADO A SEGURIDAD:

// Este módulo AuthModule y su configuración con JwtModule se integran con la estrategia LocalStrategy y el servicio AuthService que creaste antes para implementar un flujo de autenticación completo en tu aplicación. Veamos el flujo y cómo encajan las partes:

// 1. Inicio de sesión con LocalStrategy
// Cuando el usuario intenta iniciar sesión, envía sus credenciales (email y contraseña) a una ruta protegida por AuthGuard('local').
// AuthGuard utiliza LocalStrategy para procesar esas credenciales.
// En LocalStrategy, el método validate llama a authService.validateUser(email, password) para comprobar que el email y la contraseña son válidos.
// Si las credenciales son correctas, el método validate retorna el usuario, y NestJS lo asigna a req.user.
// 2. Generación del JWT en AuthController
// Luego, en AuthController, se maneja el inicio de sesión en el método login(@Req() req: Request). Aquí puedes llamar al método authService.generateJWT(req.user) para crear un token JWT.
// generateJWT utiliza JwtService (proporcionado por JwtModule) para crear un token firmado con el payload que incluye el role y el id del usuario.
// Este token es luego devuelto al cliente como access_token, el cual el cliente almacena y utiliza en futuras solicitudes.
// 3. Uso del Token para Acceso a Rutas Protegidas
// Ahora que el cliente tiene un access_token, lo enviará en cada solicitud protegida, normalmente en el encabezado Authorization como Bearer <token>.
// En las rutas protegidas, un guard adicional (que utilizará una estrategia JWT en lugar de local) interceptará las solicitudes para validar el token.
// Esta estrategia JWT leerá y verificará el token utilizando JwtService, extrayendo el payload si el token es válido. Así, req.user se llenará con los datos del usuario autenticado para esa solicitud.
// En resumen:
// Inicio de sesión: AuthGuard('local') → LocalStrategy valida usuario.
// Generación de token: AuthController llama a generateJWT para crear un token JWT.
// Acceso a rutas protegidas: En rutas protegidas, el guard basado en JWT verifica el access_token y proporciona acceso si es válido.
// La clave aquí es que:

// JwtModule y JwtService permiten generar y verificar los tokens JWT.
// AuthGuard junto con LocalStrategy manejan el inicio de sesión inicial.
// Luego, un guard basado en JWT validará el token para futuras solicitudes a rutas protegidas.
// Este flujo asegura que solo usuarios autenticados con un token válido puedan acceder a ciertas partes de la aplicación.