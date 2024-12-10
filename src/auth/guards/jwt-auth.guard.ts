import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Esta línea significa que JwtAuthGuard hereda de AuthGuard con la estrategia 'jwt' que ya definiste en JwtStrategy. --- Al usar AuthGuard('jwt'), le indicas a NestJS que este guard debe utilizar JwtStrategy para validar los tokens JWT en las solicitudes.
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // canActivate es el método principal de un guard. Este determina si una solicitud puede proceder o no. --- En esta implementación, sobrescribes canActivate para añadir una funcionalidad adicional: permitir acceso a las rutas públicas.
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true; // Si la ruta es pública, permite el acceso sin requerir un token JWT.
    }
    return super.canActivate(context); // Si la ruta no es pública, delega la validación al guard base (AuthGuard('jwt')), que usa JwtStrategy para verificar el token. --- Al sobrescribir canActivate, habilitas la funcionalidad adicional para manejar rutas públicas de manera flexible.
  }
}

// ---------
// Pregunta: Como es que super tiene un metodo 'canActivate'? Y por qué se le pasa 'context' como parametro?

// 1. ¿Por qué super tiene un método canActivate?
// La clase JwtAuthGuard hereda de AuthGuard, que viene del paquete @nestjs/passport. Al heredar, JwtAuthGuard obtiene todos los métodos y propiedades de la clase base (AuthGuard).

// AuthGuard ya implementa un método llamado canActivate.
// Este método en AuthGuard:
// Llama a la estrategia definida (en este caso 'jwt').
// Usa el resultado de la estrategia para determinar si la solicitud es válida o no.
// Si la validación es exitosa, añade la información del usuario al objeto req como req.user.
// Cuando llamas a super.canActivate(context), estás ejecutando el canActivate de la clase base (AuthGuard) para que haga todo el trabajo pesado de validación usando tu estrategia.

// 2. ¿Por qué se le pasa context como parámetro?
// El método canActivate necesita acceso al contexto de ejecución (ExecutionContext) para procesar la solicitud. Esto incluye información como:

// El tipo de aplicación (HTTP, WebSocket, RPC).
// El objeto de la solicitud (req en aplicaciones HTTP).
// El handler que está siendo llamado (el método del controlador).
// En este caso:

// JwtAuthGuard recibe el context en su método sobrescrito canActivate.
// Pasa ese mismo contexto al método canActivate de la clase base (AuthGuard) para que pueda acceder a la solicitud y llamar a la estrategia 'jwt'.

// ¡Buena pregunta! Vamos a desglosarlo para que quede claro.

// 1. ¿Por qué super tiene un método canActivate?
// La clase JwtAuthGuard hereda de AuthGuard, que viene del paquete @nestjs/passport. Al heredar, JwtAuthGuard obtiene todos los métodos y propiedades de la clase base (AuthGuard).

// AuthGuard ya implementa un método llamado canActivate.
// Este método en AuthGuard:
// Llama a la estrategia definida (en este caso 'jwt').
// Usa el resultado de la estrategia para determinar si la solicitud es válida o no.
// Si la validación es exitosa, añade la información del usuario al objeto req como req.user.
// Cuando llamas a super.canActivate(context), estás ejecutando el canActivate de la clase base (AuthGuard) para que haga todo el trabajo pesado de validación usando tu estrategia.

// 2. ¿Por qué se le pasa context como parámetro?
// El método canActivate necesita acceso al contexto de ejecución (ExecutionContext) para procesar la solicitud. Esto incluye información como:

// El tipo de aplicación (HTTP, WebSocket, RPC).
// El objeto de la solicitud (req en aplicaciones HTTP).
// El handler que está siendo llamado (el método del controlador).
// En este caso:

// JwtAuthGuard recibe el context en su método sobrescrito canActivate.
// Pasa ese mismo contexto al método canActivate de la clase base (AuthGuard) para que pueda acceder a la solicitud y llamar a la estrategia 'jwt'.
// 3. ¿Qué hace super.canActivate(context) en tu caso?
// Cuando llamas a super.canActivate(context), esto ocurre detrás de escena:

// El AuthGuard base:

// Extrae el token JWT del encabezado de la solicitud usando jwtFromRequest definido en JwtStrategy.
// Llama a tu estrategia 'jwt' (JwtStrategy).
// Si el token es válido:
// Recupera el payload del token.
// Asigna ese payload a req.user.
// Permite que la solicitud continúe.
// Si el token no es válido:

// Lanza un error de autenticación (por ejemplo, UnauthorizedException).

// 4. Flujo Completo con tu Código Sobrescrito:
// Tu guard JwtAuthGuard llama primero a canActivate(context).
// Si la ruta es pública (isPublic es true), se devuelve true sin pasar por el proceso de autenticación.
// Si no es pública:
// super.canActivate(context):
// Llama al canActivate de AuthGuard.
// Valida el token usando tu estrategia JwtStrategy.
// Si todo está bien, permite la solicitud.
// Si algo falla (token inválido, expirado, etc.), lanza una excepción.

// Ejemplo Simplificado de Herencia:

// class BaseClass {
//   canActivate(context) {
//     console.log('Validating request in BaseClass...');
//     // Simula la validación del token
//     return true; // Si es válido
//   }
// }

// class ChildClass extends BaseClass {
//   canActivate(context) {
//     console.log('Checking public route...');
//     const isPublic = false; // Ejemplo
//     if (isPublic) {
//       return true;
//     }
//     return super.canActivate(context); // Llama al método de BaseClass
//   }
// }

// // Uso
// const child = new ChildClass();
// console.log(child.canActivate('RequestContext'));

// Conclusión:
// super.canActivate(context) llama al método canActivate de la clase base AuthGuard.
// Se pasa context porque contiene información sobre la solicitud y el entorno necesarios para la validación.
// Este diseño modular permite que tú extiendas la funcionalidad básica del guard mientras sigues reutilizando la lógica de autenticación integrada.

// END OF "Pregunta: Como es que super tiene un metodo 'canActivate'? Y por qué se le pasa 'context' como parametro?"
// ---------
