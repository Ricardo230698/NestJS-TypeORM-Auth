import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthService } from '../services/auth.service';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    // En el código de NestJS, @Req() req: Request inyecta el objeto de solicitud HTTP (req) en el método del controlador. Esto permite acceder a todos los datos de la solicitud, incluyendo la información del usuario autenticado.
    const user = req.user as User;
    return this.authService.generateJWT(user); // El método validate de LocalStrategy: Si encuentra al usuario y las credenciales son correctas, devuelve el usuario. Passport toma el valor devuelto por validate y lo asigna a req.user.
  }
}

// Explicación de req.user

// Cuando menciono que "se añade el usuario a req.user", me refiero a que Passport automáticamente almacena el usuario autenticado en la propiedad req.user de la solicitud. Esto sucede así:

// El método validate de LocalStrategy: Si encuentra al usuario y las credenciales son correctas, devuelve el usuario. Passport toma el valor devuelto por validate y lo asigna a req.user.

// Resultado en el controlador: Cuando el controlador recibe la solicitud después de pasar por el guard AuthGuard('local'), req.user contiene la información del usuario autenticado. Esto permite al controlador AuthController acceder al usuario directamente en req.user y devolverlo o usarlo en el proceso.

// Esto es útil porque una vez autenticado, puedes acceder al usuario en cualquier punto de la solicitud a través de req.user, lo cual es muy práctico para rutas protegidas.

// -------------------------

// En el código de NestJS, @Req() req: Request inyecta el objeto de solicitud HTTP (req) en el método del controlador. Esto permite acceder a todos los datos de la solicitud, incluyendo la información del usuario autenticado.

// ¿Por qué req.user contiene la información del usuario autenticado?
// Esto sucede gracias a Passport. Aquí está el flujo completo:

// Autenticación en LocalStrategy:

// Cuando se ejecuta el método validate de LocalStrategy, si el usuario es válido, se retorna desde el método validate.
// Passport asigna el usuario a req.user:

// Passport usa el usuario devuelto en validate y automáticamente lo asigna a req.user. Esto es una funcionalidad interna de Passport, que añade el usuario a req.user para que esté disponible en toda la solicitud.
// Uso en el controlador:

// En el controlador, cuando se define @Req() req: Request, Nest inyecta el objeto de solicitud con todas sus propiedades, incluyendo req.user.
// Así, al escribir return req.user; en el método login, estás devolviendo el usuario autenticado que Passport asignó en req.user.
// Resumen de @Req() req: Request
// @Req() permite acceder a la solicitud completa, y en este caso, req.user contiene el usuario autenticado gracias a Passport.

// ------------------

// Pero por qué req.user? Puedo usar 'req.anotherName' si en el metodo validate estoy devolviendolo con otro nombre?

// No, no puedes cambiar el nombre req.user por req.anotherName porque Passport y NestJS están configurados para almacenar el usuario autenticado específicamente en req.user. Esta es una convención estándar en Passport.

// El nombre user es una convención establecida dentro de la funcionalidad de Passport, y no se puede modificar directamente desde el método validate. Passport espera que el usuario autenticado esté en req.user para asegurar que cualquier middleware, guard o controlador que acceda a la solicitud pueda encontrar siempre el usuario autenticado en el mismo lugar, req.user.
