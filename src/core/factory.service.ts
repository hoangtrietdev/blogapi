import { FindOneOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

const PAGING_DEFAULT_PAGE_SIZE = 10;

type CountOptions<T> = FindOneOptions<T>['where'];

type PagingOptions<T> = FindOneOptions<T> & {
  page?: number;
  pageSize?: number;
};

export interface IPagingResult<T> {
  total: number;
  pages: number;
  page: number;
  pageSize: number;
  data: T[];
}

export interface IBaseService<T> {
  count: (options?: CountOptions<T>) => Promise<number>;
  find: (options?: FindOneOptions<T>) => Promise<T[]>;
  findOne: (options?: FindOneOptions<T>) => Promise<T | null>;
  findById: (id: any) => Promise<T | null>;
  paging: (options?: PagingOptions<T>) => Promise<IPagingResult<T>>;
  create: (entity: T) => Promise<T>;
  updateById: (id: any, entity: T) => Promise<T>;
  upsert: (entity: T) => Promise<T>;
  deleteById: (id: any) => Promise<T | null>;
}

export const createBaseService = <T>(clz: Type<T>): Type<IBaseService<T>> => {
  @Injectable()
  class BaseService implements IBaseService<T> {
    constructor(
      @InjectRepository(clz)
      private readonly _repository: Repository<T>,
    ) {}

    public async count(options?: CountOptions<T>) {
      return this._repository.count({ where: options });
    }

    public async find(options?: FindOneOptions<T>) {
      return this._repository.find(options);
    }

    public async findOne(options?: FindOneOptions<T>) {
      return this._repository.findOne(options);
    }

    public async findById(id: any) {
      const [doc] = await this._repository.findByIds([id]);
      return doc;
    }

    public async findByIds(ids: any[]) {
      return this._repository.findByIds(ids);
    }

    public async paging(options: PagingOptions<T> = {}) {
      const { page = 0, pageSize = PAGING_DEFAULT_PAGE_SIZE, ...findOptions } = options;
      const skip = pageSize * page;
      const take = pageSize;
      const [total, data] = await Promise.all([
        this._repository.count(findOptions),
        this._repository.find({ ...findOptions, skip, take }),
      ]);

      return {
        total,
        pages: Math.ceil(total / pageSize),
        page: Math.floor(skip / pageSize),
        pageSize,
        data,
      };
    }

    public async create(entity: T) {
      const result = await this._repository.insert(entity);
      return Object.assign(entity, result.identifiers[0]);
    }

    public async updateById(id: any, entity: T) {
      const [doc] = await this._repository.findByIds([id]);
      if (!doc) {
        throw new NotFoundException('Not Found', `Not found ${clz.name} with id ${id}`);
      }

      await this._repository.update(id, entity);
      return Object.assign(doc, entity);
    }

    public async upsert(entity: T) {
      return this._repository.save(entity);
    }

    public async deleteById(id: any) {
      const [doc] = await this._repository.findByIds([id]);
      return doc && this._repository.remove(doc);
    }
  }

  return BaseService;
};
