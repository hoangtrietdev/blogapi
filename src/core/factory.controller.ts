
/* eslint-disable max-classes-per-file */

import { Body, Delete, Get, Inject, Param, Post, Put, Query, Req, Type } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiProperty } from '@nestjs/swagger';

import { IBaseService, IPagingResult } from './factory.service';

export interface IStarndardOperators<T> {
  in?: T[];
  nin?: T[];
}

export interface IRangeOperators<T> {
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
}

type OperatorMap = {
  string: IStarndardOperators<string>;
  number: IStarndardOperators<number> & IRangeOperators<number>;
};

export type IFilterWhereOptions<T> = {
  [k in keyof T]: T[k] extends string
    ? OperatorMap['string']
    : T[k] extends number
    ? OperatorMap['number']
    : T[k];
};

export type IFilterOrderOptions<T> = {
  field: keyof T;
  dir: 'asc' | 'desc';
};

export interface IFilterOptions<T> {
  select?: (keyof T)[];
  where?: IFilterWhereOptions<T>;
  order?: IFilterOrderOptions<T>[];
}

export interface IPagingOptions<T> extends IFilterOptions<T> {
  page?: number;
  pageSize?: number;
}

export interface IBaseController<T> {
  list?: (options: IPagingOptions<T>) => Promise<IPagingResult<T>>;
  findOne?: (options: IFilterOptions<T>) => Promise<T>;
  findById?: (id: string) => Promise<T>;
  create?: (data: T) => Promise<T>;
  update?: (id: string, data: T) => Promise<T>;
  deleteById?: (id: string) => Promise<boolean>;
}

const OptionalDecorator = (
  enabled: boolean,
  decorator: (...args: any[]) => MethodDecorator,
  ...params: any[]
): MethodDecorator => (target: any, key: string | symbol, descriptor: any) => {
  if (!enabled) return;
  return decorator(...params)(target, key, descriptor);
};

const createPagingResultClass = <T>(clz: Type<T>) => {
  class PagingResult implements IPagingResult<T> {
    @ApiProperty()
    total: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty({ type: clz, isArray: true })
    data: T[];
  }

  return PagingResult;
};

export type CreateBaseControllerOptions = {
  list?: boolean | string;
  findOne?: boolean | string;
  findById?: boolean | string;
  create?: boolean | string;
  update?: boolean | string;
  deleteById?: boolean | string;
};

export const createBaseController = <T, K extends IBaseService<T>>(
  clz: Type<T>,
  serviceClz: Type<K>,
  options: CreateBaseControllerOptions = {
    list: true,
    findOne: true,
    findById: true,
    create: true,
    update: true,
    deleteById: true,
  },
): Type<IBaseController<T>> => {
  const PagingResult = createPagingResultClass(clz);

  class BaseController implements IBaseController<T> {
    constructor(
      @Inject(serviceClz)
      protected readonly service: K,
    ) {}

    @OptionalDecorator(!!options.list, ApiOkResponse, { type: PagingResult })
    @OptionalDecorator(!!options.list, Get, '/')
    public async list(@Query('filter') filter?: IPagingOptions<T>) {
      console.warn(filter);
      if(!!filter) {
        const queryObj = Object.fromEntries(new URLSearchParams(filter.toString()))
        return this.service.paging(queryObj);
      }
      
      return this.service.paging();
    }

    @OptionalDecorator(!!options.list, ApiOkResponse, { type: [clz] })
    @OptionalDecorator(!!options.list, Get, '/all')
    public async getAll() {
      return this.service.find();
    }

    @OptionalDecorator(!!options.findOne, ApiOkResponse, { type: clz })
    @OptionalDecorator(!!options.findOne, Get, '/findOne')
    public async findOne(@Query('filter') filter?: IFilterOptions<T>) {
      console.warn(filter);
      return this.service.findOne();
    }

    @OptionalDecorator(!!options.findById, ApiOkResponse, { type: clz })
    @OptionalDecorator(!!options.findById, Get, '/:id')
    public async findById(@Param('id') id: string) {
      return this.service.findById(id);
    }

    @OptionalDecorator(!!options.create, ApiOkResponse, { type: clz })
    @OptionalDecorator(!!options.create, ApiBody, { type: clz })
    @OptionalDecorator(!!options.create, Post, '/')
    public async create(@Body() data: T) {
      return this.service.create(data);
    }

    @OptionalDecorator(!!options.update, ApiOkResponse, { type: clz })
    @OptionalDecorator(!!options.update, ApiBody, { type: clz })
    @OptionalDecorator(!!options.update, Put, '/:id')
    public async update(@Param('id') id: string, @Body() data: T) {
      return this.service.updateById(id, data);
    }

    @OptionalDecorator(!!options.deleteById, ApiOkResponse, { type: Boolean })
    @OptionalDecorator(!!options.deleteById, Delete, '/:id')
    public async deleteById(@Param('id') id: string) {
      const doc = await this.service.deleteById(id);
      return !!doc;
    }
  }

  return BaseController;
};

export const createBaseControllerWithLog = <T, K extends IBaseService<T>, U>(
  clz: Type<T>,
  serviceClz: Type<K>,
  logSrv: Type<U>,
  options: CreateBaseControllerOptions = {
    list: true,
    findOne: true,
    findById: true,
    create: true,
    update: true,
    deleteById: true,
  },
): Type<IBaseController<T>> => {
  const PagingResult = createPagingResultClass(clz);

  class BaseControllerWithLog implements IBaseController<T> {
    constructor(
      @Inject(serviceClz)
      protected readonly service: K,
      @Inject(logSrv)
      protected readonly logSrv: any,
    ) {}

    @OptionalDecorator(!!options.list, ApiOkResponse, { type: PagingResult })
    @OptionalDecorator(!!options.list, Get, '/')
    public async list(@Query('filter') filter?: IPagingOptions<T>) {
      console.warn(filter);
      if(!!filter) {
        const queryObj = Object.fromEntries(new URLSearchParams(filter.toString()))
        return this.service.paging(queryObj);
      }
      
      return this.service.paging();
    }

    @OptionalDecorator(!!options.list, ApiOkResponse, { type: [clz] })
    @OptionalDecorator(!!options.list, Get, '/all')
    public async getAll() {
      return this.service.find();
    }

    @OptionalDecorator(!!options.findOne, ApiOkResponse, { type: clz })
    @OptionalDecorator(!!options.findOne, Get, '/findOne')
    public async findOne(@Query('filter') filter?: IFilterOptions<T>) {
      console.warn(filter);
      return this.service.findOne();
    }

    @OptionalDecorator(!!options.findById, ApiOkResponse, { type: clz })
    @OptionalDecorator(!!options.findById, Get, '/:id')
    public async findById(@Param('id') id: string) {
      return this.service.findById(id);
    }

    @OptionalDecorator(!!options.create, ApiOkResponse, { type: clz })
    @OptionalDecorator(!!options.create, ApiBody, { type: clz })
    @OptionalDecorator(!!options.create, Post, '/')
    public async create(@Req() req) {
      const data = {
        action: `Create ${clz.name}`,
        updateOn: new Date()
      }
      this.logSrv.create(data)
      return this.service.create(req.body);
    }

    @OptionalDecorator(!!options.update, ApiOkResponse, { type: clz })
    @OptionalDecorator(!!options.update, ApiBody, { type: clz })
    @OptionalDecorator(!!options.update, Put, '/:id')
    public async update(@Req() req) {
      const data = {
        action: `Update ${clz.name}`,
        updateOn: new Date()
      }
      this.logSrv.create(data)
      return this.service.updateById(req.params.id, req.body);
    }

    @OptionalDecorator(!!options.deleteById, ApiOkResponse, { type: Boolean })
    @OptionalDecorator(!!options.deleteById, Delete, '/:id')
    public async deleteById(@Req() req) {
      const data = {
        action: `Delete ${clz.name}`,
        updateOn: new Date()
      }
      this.logSrv.create(data)
      const doc = await this.service.deleteById(req.params.id);
      return !!doc;
    }
  }

  return BaseControllerWithLog;
};
