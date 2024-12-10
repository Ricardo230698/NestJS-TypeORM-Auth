// En resumen, este archivo configura una estrategia de autenticación local para validar las credenciales del usuario. Si las credenciales son incorrectas, responde con una excepción de acceso no autorizado.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; // PassportStrategy es una clase de @nestjs/passport que extiende la funcionalidad de Passport.js, una biblioteca de autenticación. -------- Esta línea importa una clase de NestJS que facilita la implementación de estrategias de autenticación usando Passport.js. Esta clase ya incluye métodos y estructura para que tú solo necesites extenderla y definir cómo quieres validar las credenciales, sin tener que crear todo el sistema de autenticación desde cero.

import { AuthService } from '../services/auth.service';
import { Strategy } from 'passport-local'; // Strategy (importado como passport-local) es una estrategia de autenticación específica que utiliza credenciales locales (como email y contraseña) para autenticar a los usuarios.

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // El nombre 'local' identifica esta estrategia en NestJS y permite usarla en otras partes de la aplicación (como en AuthGuard('local')).
  constructor(private authService: AuthService) {
    // super() // Llama al constructor de PassportStrategy, que espera ciertos parámetros que configuran la estrategia. En este caso, sin configuraciones adicionales, utilizará email y password por defecto. ------- En este caso, super() no tiene parámetros porque passport-local utiliza los valores predeterminados para la estrategia local, es decir, espera que las credenciales se llamen username y password.
    // Como estás usando email en lugar de username, podrías especificarlo en super() de esta forma para evitar confusiones y asegurarte de que Passport use el campo correcto:
    // super({
    //     usernameField: 'email',
    //     passwordField: 'password',
    // });
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    // Propósito: validate es el núcleo de la autenticación. PassportJS llama a este método para validar las credenciales de un usuario. -------- El método validate es parte de la clase PassportStrategy y debe implementarse en cada estrategia que creas. PassportJS espera que definas este método para que pueda verificar las credenciales de autenticación. Al implementar validate, decides cómo validar las credenciales del usuario (como verificar el email y la contraseña en la base de datos). Si validate retorna un usuario válido, Passport autoriza el acceso; si no, puedes lanzar una excepción (como UnauthorizedException) para denegar el acceso.
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Not allowed');
    }

    return user; // Resultado: Si las credenciales son válidas, el método retorna el usuario, que luego se almacenará en el contexto de la sesión (o token) según la configuración de autenticación.
    // Nota de oro: Esta estrategia de practicamente como que fuera un servicio. Por lo tanto, esto, al ser un servicio, es una solicitud. Y debido a que esta solicitud/servicio usa Passport, Passport intertamente devuelve/asigna el usuario autenticado a la solicitud en req.user. Es por eso que luego, en los controladores que usen esta estrategia/servicio, pueden acceder al usuario autenticado, accediendo a la solicitud, específicamente a req.user
  }
}

// ...
// En caso de querer usar otras estrategias, podría ser algo así:

// import { Strategy as FacebookStrategy } from 'passport-facebook';

// export class FacebookStrategy extends PassportStrategy(FacebookStrategy, 'facebook') { // El segundo argumento 'facebook' es el nombre de la estrategia que utilizarás luego para referenciarla, por ejemplo, con AuthGuard('facebook').
//   ...
// }
