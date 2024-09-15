import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async addSupermarketToCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<CiudadEntity> {
    const ciudad = await this.findCiudadById(ciudadId);
    const supermercado = await this.findSupermercadoById(supermercadoId);

    ciudad.supermercados = [...ciudad.supermercados, supermercado];
    return await this.ciudadRepository.save(ciudad);
  }

  async updateSupermarketsFromCity(
    ciudadId: string,
    supermercados: SupermercadoEntity[],
  ): Promise<CiudadEntity> {
    const ciudad = await this.findCiudadById(ciudadId);

    for (const supermercado of supermercados) {
      await this.findSupermercadoById(supermercado.id);
    }

    ciudad.supermercados = supermercados;
    return await this.ciudadRepository.save(ciudad);
  }

  async findSupermarketsFromCity(
    ciudadId: string,
  ): Promise<SupermercadoEntity[]> {
    const ciudad = await this.findCiudadById(ciudadId);
    return ciudad.supermercados;
  }

  async findSupermarketFromCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<SupermercadoEntity> {
    const ciudad = await this.findCiudadById(ciudadId);
    const supermercado = await this.findSupermercadoById(supermercadoId);

    const ciudadSupermercado = ciudad.supermercados.find(
      (entity) => entity.id === supermercado.id,
    );
    if (!ciudadSupermercado)
      throw new BusinessLogicException(
        'El supermercado con el id dado no está asociado a la ciudad',
        BusinessError.PRECONDITION_FAILED,
      );
    return ciudadSupermercado;
  }

  async deleteSupermarketFromCity(ciudadId: string, supermercadoId: string) {
    const ciudad = await this.findCiudadById(ciudadId);
    const supermercado = await this.findSupermercadoById(supermercadoId);

    const ciudadSupermercado = ciudad.supermercados.find(
      (entity) => entity.id === supermercado.id,
    );
    if (!ciudadSupermercado)
      throw new BusinessLogicException(
        'El supermercado con el id dado no está asociado a la ciudad',
        BusinessError.PRECONDITION_FAILED,
      );

    ciudad.supermercados = ciudad.supermercados.filter(
      (entity) => entity.id !== supermercadoId,
    );
    await this.ciudadRepository.save(ciudad);
  }

  private async findCiudadById(ciudadId: string): Promise<CiudadEntity> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'La ciudad con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return ciudad;
  }

  private async findSupermercadoById(
    supermercadoId: string,
  ): Promise<SupermercadoEntity> {
    const supermercado = await this.supermercadoRepository.findOne({
      where: { id: supermercadoId },
    });
    if (!supermercado) {
      throw new BusinessLogicException(
        'El supermercado con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return supermercado;
  }
}
