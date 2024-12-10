import { SetMetadata } from '@nestjs/common'; // // El metadata es información adicional que se puede agregar a clases, métodos o propiedades, sin afectar su comportamiento directo. En NestJS, se utiliza comúnmente con decoradores para etiquetar rutas, métodos o controladores con datos extra, como permisos, roles, o en este caso, si una ruta es pública ('isPublic'). Estos datos luego pueden ser leídos por otros componentes, como guards o interceptores, para modificar el comportamiento de la aplicación.

import { Role } from '../models/roles.models';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
