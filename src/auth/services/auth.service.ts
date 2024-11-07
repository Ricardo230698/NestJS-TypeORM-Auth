import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

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
}
