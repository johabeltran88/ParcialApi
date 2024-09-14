import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CiudadDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  numeroHabitantes: number;
}
