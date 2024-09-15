import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

const paisesPermitidos = ['Argentina', 'Ecuador', 'Paraguay'];

function generarNombreLargo(): string {
  let nombre;
  do {
    nombre = faker.name.firstName() + faker.name.lastName();
  } while (nombre.length <= 10);
  return nombre;
}

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercados: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();
    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();
    supermercados = [];
    for (let i: number = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await supermercadoRepository.save({
          nombre: generarNombreLargo(),
          longitud: faker.number
            .float({
              min: -180,
              max: 180,
            })
            .toString(),
          latitud: faker.number
            .float({
              min: -180,
              max: 180,
            })
            .toString(),
          paginaWeb: faker.internet.url(),
        });
      supermercados.push(supermercado);
    }
    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.helpers.arrayElement(paisesPermitidos),
      numeroHabitantes: faker.number.int({ min: 1, max: 100 }).toString(),
      supermercados: supermercados,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity debe asociar un supermercado a una ciudad', async () => {
    const ciudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.helpers.arrayElement(paisesPermitidos),
      numeroHabitantes: faker.number.int({ min: 1, max: 100 }).toString(),
    });
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: generarNombreLargo(),
      longitud: faker.number
        .float({
          min: -180,
          max: 180,
        })
        .toString(),
      latitud: faker.number
        .float({
          min: -180,
          max: 180,
        })
        .toString(),
      paginaWeb: faker.internet.url(),
    });
    const result: CiudadEntity = await service.addSupermarketToCity(
      ciudad.id,
      supermercado.id,
    );
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(ciudad.nombre);
    expect(result.pais).toBe(ciudad.pais);
    expect(result.numeroHabitantes).toBe(ciudad.numeroHabitantes);
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(supermercado.nombre);
    expect(result.supermercados[0].longitud).toBe(supermercado.longitud);
    expect(result.supermercados[0].latitud).toBe(supermercado.latitud);
    expect(result.supermercados[0].paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('addSupermarketToCity debe lanzar una excepción para una ciudad no válida', async () => {
    await expect(() =>
      service.addSupermarketToCity('0', supermercados[0].id),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no fue encontrada',
    );
  });

  it('addSupermarketToCity debe lanzar una excepción para un supermercado no válido', async () => {
    await expect(() =>
      service.addSupermarketToCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no fue encontrado',
    );
  });

  it('updateSupermarketsFromCity debe actualizar un supermercado a una ciudad', async () => {
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: generarNombreLargo(),
      longitud: faker.number
        .float({
          min: -180,
          max: 180,
        })
        .toString(),
      latitud: faker.number
        .float({
          min: -180,
          max: 180,
        })
        .toString(),
      paginaWeb: faker.internet.url(),
    });
    const result: CiudadEntity = await service.updateSupermarketsFromCity(
      ciudad.id,
      [supermercado],
    );
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(ciudad.nombre);
    expect(result.pais).toBe(ciudad.pais);
    expect(result.numeroHabitantes).toBe(ciudad.numeroHabitantes);
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(supermercado.nombre);
    expect(result.supermercados[0].longitud).toBe(supermercado.longitud);
    expect(result.supermercados[0].latitud).toBe(supermercado.latitud);
    expect(result.supermercados[0].paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('updateSupermarketsFromCity debe lanzar una excepción para una ciudad no válida', async () => {
    await expect(() =>
      service.updateSupermarketsFromCity('0', null),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no fue encontrada',
    );
  });

  it('updateSupermarketsFromCity debe lanzar una excepción para un supermercado no válido', async () => {
    const supermercado: Partial<SupermercadoEntity> = {
      id: '0',
    };
    await expect(() =>
      service.updateSupermarketsFromCity(ciudad.id, [
        supermercado as SupermercadoEntity,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no fue encontrado',
    );
  });

  it('findSupermarketsFromCity debe retornar todos los supermercados de una ciudad', async () => {
    const result: SupermercadoEntity[] = await service.findSupermarketsFromCity(
      ciudad.id,
    );
    expect(result).not.toBeNull();
    expect(result.length).toBe(supermercados.length);
  });

  it('findSupermarketsFromCity debe lanzar una excepción para una ciudad no válida', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no fue encontrada',
    );
  });

  it('findSupermarketFromCity debe retornar un supermercado de una ciudad', async () => {
    const result: SupermercadoEntity = await service.findSupermarketFromCity(
      ciudad.id,
      supermercados[0].id,
    );
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(supermercados[0].nombre);
    expect(result.longitud).toBe(supermercados[0].longitud);
    expect(result.latitud).toBe(supermercados[0].latitud);
    expect(result.paginaWeb).toBe(supermercados[0].paginaWeb);
  });

  it('findSupermercadoByCiudadIdAndSupermercado Id debe lanzar una excepción para una ciudad no válida', async () => {
    await expect(() =>
      service.findSupermarketFromCity('0', supermercados[0].id),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no fue encontrada',
    );
  });

  it('findSupermarketFromCity debe lanzar una excepción para un supermercado no válido', async () => {
    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no fue encontrado',
    );
  });

  it('findSupermarketFromCity debe lanzar una excepción para un supermercado no asociado', async () => {
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: generarNombreLargo(),
      longitud: faker.number
        .float({
          min: -180,
          max: 180,
        })
        .toString(),
      latitud: faker.number
        .float({
          min: -180,
          max: 180,
        })
        .toString(),
      paginaWeb: faker.internet.url(),
    });
    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no está asociado a la ciudad',
    );
  });

  it('deleteSupermarketFromCity debe eliminar un supermercado de una ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercados[0];

    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['supermercados'],
    });
    const deletedSupermercado: SupermercadoEntity =
      storedCiudad.supermercados.find(
        (entity: SupermercadoEntity) => entity.id === supermercado.id,
      );
    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermarketFromCity debe lanzar una excepción para una ciudad no válida', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercados[0].id),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no fue encontrada',
    );
  });

  it('deleteSupermarketFromCity debe lanzar una excepción para un supermercado no válido', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no fue encontrado',
    );
  });

  it('deleteSupermarketFromCity debe lanzar una excepción para un supermercado no asociado', async () => {
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: generarNombreLargo(),
      longitud: faker.number
        .float({
          min: -180,
          max: 180,
        })
        .toString(),
      latitud: faker.number
        .float({
          min: -180,
          max: 180,
        })
        .toString(),
      paginaWeb: faker.internet.url(),
    });
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no está asociado a la ciudad',
    );
  });
});
