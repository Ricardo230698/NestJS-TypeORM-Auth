import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadToken } from '../models/token.model';
import { Role } from '../models/roles.models';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler()); // Usamos el reflector para poder buscar los metadata de la solicitud, en caso de haberlos. En este caso, buscamos especificamente el ROLES_KEY en el metadata
    if(!roles) {
      return true;
    }
    
    // El próximo par de líneas es para que podamos tener acceso a información del usuario, la cual quedó guardada por NestJS (PassportJS) en el cuerpo de la solicitud tan prongo como se logea con éxito un usuario. En este caso, accedemos al usuario as PayloadToken desde request.user
    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;

    const isAuth = roles.some((role) => role === user.role);
    if(!isAuth) {
      throw new UnauthorizedException("You are not authorized");
    }
    return isAuth;
  }
}
