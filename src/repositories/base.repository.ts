import { Model, Document, FilterQuery, UpdateQuery, QueryOptions, SaveOptions } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  findAll(filter?: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  create(data: Partial<T>, options?: SaveOptions): Promise<T>;
  update(id: string, data: UpdateQuery<T>, options?: QueryOptions): Promise<T | null>;
  delete(id: string, options?: QueryOptions): Promise<T | null>;
  count(filter?: FilterQuery<T>, options?: QueryOptions): Promise<number>;
  exists(filter: FilterQuery<T>, options?: QueryOptions): Promise<boolean>;
}

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findAll(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    return await this.model.find(filter, null, options).exec();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async create(data: Partial<T>, options: SaveOptions = {}): Promise<T> {
    const document = new this.model(data);
    return await document.save(options);
  }

  async update(id: string, data: UpdateQuery<T>, options: QueryOptions = {}): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true, ...options })
      .exec();
  }

  async delete(id: string, options: QueryOptions = {}): Promise<T | null> {
    return await this.model.findByIdAndDelete(id, options).exec();
  }

  async count(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<number> {
    return await this.model.countDocuments(filter).setOptions(options).exec();
  }

  async exists(filter: FilterQuery<T>, options: QueryOptions = {}): Promise<boolean> {
    const count = await this.model.countDocuments(filter).limit(1).setOptions(options).exec();
    return count > 0;
  }

  async findWithPagination(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    return (await this.model.insertMany(data)) as unknown as T[];
  }

  async bulkUpdate(updates: Array<{ filter: FilterQuery<T>; update: UpdateQuery<T> }>) {
    const bulkOps = updates.map((item) => ({
      updateMany: {
        filter: item.filter,
        update: item.update,
      },
    })) as Parameters<typeof this.model.bulkWrite>[0];

    return await this.model.bulkWrite(bulkOps);
  }

  async bulkDelete(filter: FilterQuery<T>) {
    return await this.model.deleteMany(filter).exec();
  }
}
