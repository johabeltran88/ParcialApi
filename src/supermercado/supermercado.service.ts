import { Injectable } from '@nestjs/common';
import { SupermercadoEntity } from './supermercado.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find({
      relations: ['ciudades'],
    });
  }

  async findOne(id: string): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
        relations: ['ciudades'],
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'El supermercado con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return supermercado;
  }

  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    if (this.validarNombre(supermercado.nombre))
      throw new BusinessLogicException(
        'El nombre del supermercado debe tener más de 10 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.supermercadoRepository.save(supermercado);
  }

  async update(
    id: string,
    supermercado: SupermercadoEntity,
  ): Promise<SupermercadoEntity> {
    const persistedSupermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!persistedSupermercado)
      throw new BusinessLogicException(
        'El supermercado con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    supermercado.id = id;
    if (this.validarNombre(supermercado.nombre))
      throw new BusinessLogicException(
        'El nombre del supermercado debe tener más de 10 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.supermercadoRepository.save({
      ...persistedSupermercado,
      ...supermercado,
    });
  }

  async delete(id: string) {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'El supermercado con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return await this.supermercadoRepository.remove(supermercado);
  }

  private validarNombre(nombre: string): boolean {
    return nombre.length <= 10;
  }
}
