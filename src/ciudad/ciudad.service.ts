import { Injectable } from '@nestjs/common';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {
  private paisesPermitidos = ['Argentina', 'Ecuador', 'Paraguay'];

  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({
      relations: ['supermercados'],
    });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['supermercados'],
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'La ciudad con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (!this.validarPais(ciudad.pais))
      throw new BusinessLogicException(
        'El país no tiene los valores definidos',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!persistedCiudad)
      throw new BusinessLogicException(
        'La ciudad con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    ciudad.id = id;
    return await this.ciudadRepository.save({
      ...persistedCiudad,
      ...ciudad,
    });
  }

  async delete(id: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'La ciudad con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return await this.ciudadRepository.remove(ciudad);
  }

  private validarPais(pais: string): boolean {
    return this.paisesPermitidos.includes(pais);
  }
}
