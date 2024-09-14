import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoController } from './supermercado.controller';

@Module({
  providers: [SupermercadoService],
  controllers: [SupermercadoController]
})
export class SupermercadoModule {}
