import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs'; // Observable es un tipo de objeto usado para manejar flujos de datos asíncronos, permitiendo emitir múltiples valores a lo largo del tiempo, como si fueran "streams". Es común en programación reactiva, y permite suscribirse a estos valores, procesarlos o esperar a que se completen.

import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate { // canActivate es un método en los guards de NestJS que se utiliza para determinar si una solicitud tiene permiso para acceder a una ruta específica. Si devuelve true, permite el acceso; si devuelve false o lanza una excepción, deniega el acceso.
  canActivate(
    context: ExecutionContext, // La línea context: ExecutionContext se refiere al contexto de ejecución en el que se encuentra la solicitud entrante. En NestJS, el ExecutionContext proporciona acceso a detalles específicos de la ejecución, como el tipo de solicitud (HTTP, WebSocket, etc.), y te permite obtener información sobre la petición, como en este caso donde se usa para acceder al objeto Request. Es útil para aplicar lógicas de autorización o validación en diferentes tipos de controladores.
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // ExecutionContext proporciona acceso a detalles específicos de la ejecución, como el tipo de solicitud (HTTP, WebSocket, etc.)
    const authHeader = request.header('Auth');
    const isAuth = authHeader === '1234';
    if (!isAuth) {
      throw new UnauthorizedException('not allow');
    }
    return isAuth;
  }
}