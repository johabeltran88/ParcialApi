import { IsString, IsNotEmpty } from 'class-validator';

export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  longitud: number;

  @IsString()
  @IsNotEmpty()
  latitud: number;

  @IsString()
  @IsNotEmpty()
  paginaWeb?: string;
}
