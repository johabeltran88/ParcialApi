import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { faker } from '@faker-js/faker';

function generarNombreLargo(): string {
  let nombre;
  do {
    nombre = faker.name.firstName() + faker.name.lastName();
  } while (nombre.length <= 10);
  return nombre;
}

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercados: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();
    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercados = [];
    for (let i: number = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: generarNombreLargo(),
        longitud: faker.number.float({
          min: -180,
          max: 180,
        }),
        latitud: faker.number.float({
          min: -180,
          max: 180,
        }),
        paginaWeb: faker.internet.url(),
      });
      supermercados.push(supermercado);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los supermercados', async () => {
    const supermercado: SupermercadoEntity[] = await service.findAll();
    expect(supermercado).not.toBeNull();
    expect(supermercado).toHaveLength(supermercados.length);
  });

  it('findOne debe retornar un supermercado por id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercados[0];
    const supermercado: SupermercadoEntity = await service.findOne(
      storedSupermercado.id,
    );
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(supermercado.nombre);
  });

  it('findOne debe lanzar una excepción para un supermercado no válido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no fue encontrado',
    );
  });

  it('create debe retornar un nuevo supermercado', async () => {
    const supermercado: Partial<SupermercadoEntity> = {
      nombre: generarNombreLargo(),
      longitud: faker.number.float({
        min: -180,
        max: 180,
      }),
      latitud: faker.number.float({ min: -180, max: 180 }),
      paginaWeb: faker.internet.url(),
    };
    const newSupermercado: SupermercadoEntity = await service.create(
      supermercado as SupermercadoEntity,
    );
    expect(newSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: newSupermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre);
    expect(storedSupermercado.longitud).toEqual(newSupermercado.longitud);
    expect(storedSupermercado.latitud).toEqual(newSupermercado.latitud);
    expect(storedSupermercado.paginaWeb).toEqual(newSupermercado.paginaWeb);
  });

  it('update debe modificar un supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercados[0];
    supermercado.nombre = generarNombreLargo();
    supermercado.paginaWeb = 'Nuevo';
    supermercado.latitud = 1;
    supermercado.longitud = 1;
    const updateSupermercado: SupermercadoEntity = await service.update(
      supermercado.id,
      supermercado,
    );
    expect(updateSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb);
  });

  it('update debe lanzar una excepción para un supermercado no válido', async () => {
    await expect(() => service.update('0', null)).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no fue encontrado',
    );
  });

  it('delete debe quitar un supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercados[0];
    await service.delete(supermercado.id);
    const deleteSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(deleteSupermercado).toBeNull();
  });

  it('delete debe lanzar una excepción para un supermercado no válido', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El supermercado con el id dado no fue encontrado',
    );
  });
});
