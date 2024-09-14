import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import {CiudadEntity} from '../ciudad/ciudad.entity'

@Entity()
export class SupermercadoEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column('decimal', { precision: 10, scale: 6 })
    longitud: number;

    @Column('decimal', { precision: 10, scale: 6 })
    latitud: number;

    @Column()
    paginaWeb: string;

    @ManyToMany(
        () => CiudadEntity,
        (ciudad: CiudadEntity) =>
          ciudad.supermercados,
    )
    ciudades: CiudadEntity[];
}
