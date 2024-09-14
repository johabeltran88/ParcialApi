import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Entity()
export class CiudadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  pais: string;

  @Column()
  numeroHabitantes: number;

  @ManyToMany(
    () => SupermercadoEntity,
    (supermercado: SupermercadoEntity) => supermercado.ciudades,
  )
  @JoinTable()
  supermercados: SupermercadoEntity[];
}
