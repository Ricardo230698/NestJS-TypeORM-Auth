import {
  Controller,
  Get,
  Param,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { Public } from './auth/decorators/public.decorator';

@UseGuards(ApiKeyGuard) // Al añadir este controlador específicamente aquí, estamos logrando que el guardian se aplique a todas las rutas de este controlador
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @SetMetadata("isPublic", true)
  @Public() // Es cierto que todas las rutas estas siendo vigiladas por el guardian. Sin embargo, este decorador indica que esta ruta será publica. Nevertheless, eso no significa que esta ruta ya no esté siendo vigilada, simplemente aquí lo que pasa es que, si el guardian ve que existe este decorador, permitirá que el acceso a esta ruta sea otorgado (pero igual debo validar o configurar esto en el archivo del guardian). NOTA: Esta linea hace lo mismo que la que comenté justo arriba '@SetMetadata("isPublic", true)', solo que he aañdido este decorador (metadata) en una carpeta de decoradores para mantener las buenas prácticas, y estoy llamando a ese decorador aquí.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @SetMetadata("isPublic", true) // El metadata es información adicional que se puede agregar a clases, métodos o propiedades, sin afectar su comportamiento directo. En NestJS, se utiliza comúnmente con decoradores para etiquetar rutas, métodos o controladores con datos extra, como permisos, roles, o en este caso, si una ruta es pública ('isPublic'). Estos datos luego pueden ser leídos por otros componentes, como guards o interceptores, para modificar el comportamiento de la aplicación.
  @Public()
  @Get('nuevo')
  newEndpoint() {
    return 'yo soy nuevo';
  }

  @Get('/ruta/')
  hello() {
    return 'con /sas/';
  }

  // @Get('tasks')
  // tasks() {
  //   return this.appService.getTasks();
  // }
}
