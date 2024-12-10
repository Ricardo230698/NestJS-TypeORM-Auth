import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../config';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class JwtStrategry extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>, // Ya que en esta estrategia vamos a necesitar usar el modulo de configuración porque estamos llamando a las variables de entorno, debemos inyectar aquel modulo (config). Por lo tanto, lo hacemos aquí en el constructor. Sin embargo, algo a tener en cuenta es que, normalmente inyectamos este modulo config en un useFactory, pero debido a que esta vez estamos en un servicio, lo tenemos que hacer en el constructor (y sí, recordemos que una estrategia, es en teoría, un servicio)
  ) {
    super({
      // A continuación declaramos lo necesario para la configuración de la estregia de jwt, lo hacemos en el super:
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  validate(payload: PayloadToken) {
    return payload;
  }
}
