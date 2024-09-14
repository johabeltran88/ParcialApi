/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { faker } from '@faker-js/faker';

const paisesPermitidos = ['Argentina', 'Ecuador', 'Paraguay'];

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudades: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();
    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudades = [];
    for (let i: number = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        pais: faker.helpers.arrayElement(paisesPermitidos),
        numeroHabitantes: faker.number.int({ min: 1, max: 100 }),
      });
      ciudades.push(ciudad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las ciudades', async () => {
    const ciudad: CiudadEntity[] = await service.findAll();
    expect(ciudad).not.toBeNull();
    expect(ciudad).toHaveLength(ciudades.length);
  });

  it('findOne debe retornar una ciudad por id', async () => {
    const storedCiudad: CiudadEntity = ciudades[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
  });

  it('findOne debe lanzar una excepción para una ciudad no válida', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no fue encontrada',
    );
  });

  it('create debe retornar una nueva ciudad', async () => {
    const ciudad: Partial<CiudadEntity> = {
      nombre: faker.location.city(),
      pais: faker.helpers.arrayElement(paisesPermitidos),
      numeroHabitantes: faker.number.int({ min: 1, max: 100 }),
    };
    const newCiudad: CiudadEntity = await service.create(
      ciudad as CiudadEntity,
    );
    expect(newCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: newCiudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre);
    expect(storedCiudad.pais).toEqual(newCiudad.pais);
    expect(storedCiudad.numeroHabitantes).toEqual(newCiudad.numeroHabitantes);
  });

  it('update debe modificar una ciudad', async () => {
    const ciudad: CiudadEntity = ciudades[0];
    ciudad.nombre = 'Nuevo';
    ciudad.pais = faker.helpers.arrayElement(paisesPermitidos);
    ciudad.numeroHabitantes = 1;
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre);
    expect(storedCiudad.pais).toEqual(ciudad.pais);
    expect(storedCiudad.numeroHabitantes).toEqual(ciudad.numeroHabitantes);
  });

  it('update debe lanzar una excepción para una ciudad no válida', async () => {
    await expect(() => service.update('0', null)).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no fue encontrada',
    );
  });

  it('delete debe quitar una ciudad', async () => {
    const ciudad: CiudadEntity = ciudades[0];
    await service.delete(ciudad.id);
    const deletedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(deletedCiudad).toBeNull();
  });

  it('delete debe lanzar una excepción para una ciudad no válida', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no fue encontrada',
    );
  });
});
