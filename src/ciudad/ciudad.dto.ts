import { IsNotEmpty, IsString } from 'class-validator';

export class CiudadDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  numeroHabitantes: number;
}
