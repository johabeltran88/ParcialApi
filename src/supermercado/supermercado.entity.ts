import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';

@Entity()
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  longitud: string;

  @Column()
  latitud: string;

  @Column()
  paginaWeb: string;

  @ManyToMany(
    () => CiudadEntity,
    (ciudad: CiudadEntity) => ciudad.supermercados,
  )
  ciudades: CiudadEntity[];
}
