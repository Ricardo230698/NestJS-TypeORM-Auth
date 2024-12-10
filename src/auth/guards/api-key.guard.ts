import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Observable, retry } from 'rxjs'; // Observable es un tipo de objeto usado para manejar flujos de datos asíncronos, permitiendo emitir múltiples valores a lo largo del tiempo, como si fueran "streams". Es común en programación reactiva, y permite suscribirse a estos valores, procesarlos o esperar a que se completen.

import config from './../../config'; // 'config' es el nombre con el que hemos registrado a nuestro modulo de configuración con 'registerAs' en './../../config'
import { ConfigType } from '@nestjs/config';

import { Reflector } from '@nestjs/core'; // La línea import { Reflector } from '@nestjs/core'; introduce el servicio Reflector, que se utiliza para leer los metadata asignados a clases o métodos. En este caso, permite acceder a información adicional, como la etiqueta 'isPublic', que podría haber sido añadida a una ruta o controlador mediante decoradores personalizados. Se usa para personalizar el comportamiento de los guards u otras funciones según esos metadata.
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  // canActivate es un método en los guards de NestJS que se utiliza para determinar si una solicitud tiene permiso para acceder a una ruta específica. Si devuelve true, permite el acceso; si devuelve false o lanza una excepción, deniega el acceso.

  constructor(
    private reflector: Reflector,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  canActivate(
    context: ExecutionContext, // La línea context: ExecutionContext se refiere al contexto de ejecución en el que se encuentra la solicitud entrante. En NestJS, el ExecutionContext proporciona acceso a detalles específicos de la ejecución, como el tipo de solicitud (HTTP, WebSocket, etc.), y te permite obtener información sobre la petición, como en este caso donde se usa para acceder al objeto Request. Es útil para aplicar lógicas de autorización o validación en diferentes tipos de controladores.
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler()); // Esta linea verifica si el método o ruta tiene el metadata 'isPublic' asignado, lo que indicaría que la ruta es pública y no requiere autenticación. Usa el Reflector para leer ese metadata del controlador o método correspondiente.
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>(); // ExecutionContext proporciona acceso a detalles específicos de la ejecución, como el tipo de solicitud (HTTP, WebSocket, etc.)
    const authHeader = request.header('Auth');
    const isAuth = authHeader === this.configService.apiKey;
    if (!isAuth) {
      throw new UnauthorizedException('not allow');
    }
    return isAuth;
  }
}
