// ¿Cómo se aplica JWT en este archivo?
// Autenticación del usuario: El método validateUser verifica las credenciales del usuario comparando la contraseña ingresada con la almacenada en la base de datos (usando bcrypt). Si la validación es correcta, devuelve el usuario.

// Generación del token: Si validateUser verifica correctamente al usuario, entonces generateJWT es el método que toma ese usuario y crea un JWT que encapsula sus datos principales en el payload.

// Uso del JWT: Una vez generado, este access_token puede ser enviado al cliente, quien luego lo incluirá en los encabezados de autorización de sus solicitudes, permitiendo que el servidor identifique al usuario sin necesidad de repetir la autenticación.

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // Esta línea no introduce una nueva estrategia de autenticación; simplemente importa el servicio JwtService de NestJS. Este servicio te proporciona métodos para crear (firmar) y verificar tokens JWT.
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/entities/user.entity';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService, // El JwtService es una herramienta que facilita la creación de tokens JWT, pero no define cómo se deben usar esos tokens en las rutas protegidas. Para ello, normalmente se crea una estrategia JWT aparte (como JwtStrategy) que verifique automáticamente los tokens en ciertas rutas.
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        
        if(user) {
            const isMatch = await bcrypt.compare(password, user.password); // Esta línea utiliza la función bcrypt.compare para verificar si la contraseña ingresada por el usuario coincide con la contraseña almacenada en la base de datos.
            if(isMatch) {
                return user;
            }
        }

        return null;
    }

    generateJWT(user: User) { // Pregunta: Pero cuando se ejecutará este metodo? Será algo automatico despues de que se valide el usuario en validateUser? Si es así, que hace que sea automático? -- Respuesta al final...
        const payload: PayloadToken = { role: user.role, sub: user.id }; // Objetivo: Se crea el payload para el token JWT. -- role: user.role: Aquí se incluye el rol del usuario en el payload, lo cual puede ser útil para identificar permisos o niveles de acceso en el sistema. -- sub: user.id: sub (abreviatura de "subject") es una convención que indica el ID principal del usuario autenticado. Este campo puede ser utilizado posteriormente para identificar al usuario de manera única.
        return {
            access_token: this.jwtService.sign(payload), // Objetivo: Genera el token JWT firmado. -- Función this.jwtService.sign(payload): Esta función usa la clase JwtService para crear un token. -- Firma del token: sign(payload) firma el payload utilizando una clave secreta definida en el módulo de configuración. Esto asegura que el token es seguro y no puede ser alterado por terceros.
            user,
        }
    }
}


// ----
// Pregunta: Pero cuando se ejecutará este metodo? Será algo automatico despues de que se valide el usuario en validateUser? Si es así, que hace que sea automático?

// No, el método generateJWT no se ejecuta automáticamente después de validateUser. Tú decides cuándo llamar a generateJWT. Usualmente, se llama en un punto específico del flujo de autenticación, como después de que el usuario ha sido validado exitosamente en el controlador de autenticación.

// Aquí tienes cómo funciona en contexto:

// validateUser se usa para verificar las credenciales del usuario, normalmente dentro de LocalStrategy.
// Si validateUser confirma que el usuario es válido, el controlador de autenticación recibe al usuario en req.user (gracias a Passport).
// Llamada a generateJWT: Luego, en el controlador (como en el método login de AuthController), puedes llamar a generateJWT y pasarle el usuario autenticado.
// Un ejemplo de cómo podrías integrarlo en tu controlador de autenticación:

// AuthController
// @Controller('auth')
// export class AuthController {
//     constructor(private authService: AuthService) {}

//     @UseGuards(AuthGuard('local'))
//     @Post('login')
//     async login(@Req() req: Request) {
//         // Llamamos a generateJWT después de que el usuario ha sido autenticado
//         return this.authService.generateJWT(req.user);
//     }
// }

// Explicación
// En el controlador, después de que AuthGuard autentica al usuario, req.user contendrá la información del usuario.
// El método login llama explícitamente a generateJWT, pasando req.user como argumento, generando el token en ese momento.
// Por lo tanto, generateJWT no se ejecuta automáticamente; es llamado de forma explícita en el punto del flujo donde desees generar y enviar el token JWT al cliente.

// ----

