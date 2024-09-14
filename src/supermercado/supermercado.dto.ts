import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  longitud: number;

  @IsNumber()
  @IsNotEmpty()
  latitud: number;

  @IsString()
  @IsNotEmpty()
  paginaWeb?: string;
}
