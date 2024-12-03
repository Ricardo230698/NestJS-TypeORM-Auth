import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.models';
import { PayloadToken } from 'src/auth/models/token.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { OrdersService } from '../services/orders.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(
        private orderService: OrdersService,
    ) {}

    @Roles(Role.CUSTOMER) // Solo accesible para usuarios con rol "CUSTOMER"
    @Get('my-orders')
    getOrders(@Req() req: Request) { // En el código de NestJS, @Req() req: Request inyecta el objeto de solicitud HTTP (req) en el método del controlador. Esto permite acceder a todos los datos de la solicitud, incluyendo la información del usuario autenticado.
      const user = req.user as PayloadToken; // Obtiene el usuario autenticado desde el request
      return this.orderService.ordersByCustomer(user.sub); // user.sub accede al ID del usuario desde el payload del token --- sub es una convención en JWT para identificar al "sujeto" del token (en este caso, el ID del usuario). --- req.user contiene el payload del token JWT (gracias a JwtStrategy).
    }
}
