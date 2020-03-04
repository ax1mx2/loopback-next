// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/rest-crud
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import assert from 'assert';
import {Constructor} from './common-types';
import {Entity, Model} from './model';
import {
  CrudRepository,
  DefaultCrudRepository,
  DefaultKeyValueRepository,
  EntityCrudRepository,
  juggler,
  KeyValueRepository,
} from './repositories';

/**
 * Create (define) an entity CRUD repository class for the given model.
 *
 * @example
 *
 * ```ts
 * const ProductRepository = defineEntityCrudRepositoryClass(Product);
 * ```
 *
 * @param entityClass - An entity class such as `Product`.
 * @param baseRepositoryClass - Base repository class. Defaults to `DefaultCrudRepository`
 *
 * @typeParam E - An entity class
 * @typeParam IdType - ID type for the entity
 * @typeParam Relations - Relations for the entity
 */
export function defineEntityCrudRepositoryClass<
  T extends Entity,
  IdType,
  Relations extends object = {}
>(
  entityClass: typeof Entity & {prototype: T},
  baseRepositoryClass: Constructor<
    EntityCrudRepository<T, IdType, Relations>
  > = DefaultCrudRepository as Constructor<
    EntityCrudRepository<T, IdType, Relations>
  >,
): EntityCrudRepositoryClass<T, IdType, Relations> {
  const repoName = entityClass.name + 'Repository';
  const defineNamedRepo = new Function(
    'EntityCtor',
    'BaseRepository',
    `return class ${repoName} extends BaseRepository {
      constructor(dataSource) {
        super(EntityCtor, dataSource);
      }
    };`,
  );

  const repo = defineNamedRepo(entityClass, baseRepositoryClass);
  assert.equal(repo.name, repoName);
  return repo;
}

/**
 * Signature for EntityCrudRepository classes
 *
 * @typeParam E - An entity class
 * @typeParam IdType - ID type for the entity
 * @typeParam Relations - Relations for the entity
 */
export interface EntityCrudRepositoryClass<
  E extends Entity,
  IdType,
  Relations extends object
> {
  new (ds: juggler.DataSource): EntityCrudRepository<E, IdType, Relations>;
}

/**
 * Create (define) a CRUD repository class for the given model.
 *
 * @example
 *
 * ```ts
 * const AddressRepository = defineCrudRepositoryClass(Address);
 * ```
 *
 * @param modelClass - A model class such as `Address`.
 *
 * @typeParam M - Model class
 */
export function defineCrudRepositoryClass<M extends Model>(
  modelClass: typeof Model & {prototype: M},
  baseRepositoryClass: Constructor<CrudRepository<M>>,
): CrudRepositoryClass<M> {
  const repoName = modelClass.name + 'Repository';
  const defineNamedRepo = new Function(
    'ModelCtor',
    'BaseRepository',
    `return class ${repoName} extends BaseRepository {
      constructor(dataSource) {
        super(ModelCtor, dataSource);
      }
    };`,
  );

  const repo = defineNamedRepo(modelClass, baseRepositoryClass);
  assert.equal(repo.name, repoName);
  return repo;
}

/**
 * Signature for CrudRepository classes
 *
 * @typeParam M - Model class
 */
export interface CrudRepositoryClass<M extends Model> {
  new (ds: juggler.DataSource): CrudRepository<M>;
}

/**
 * Create (define) a KeyValue repository class for the given entity.
 *
 * @example
 *
 * ```ts
 * const ProductKeyValueRepository = defineKeyValueRepositoryClass(Product);
 * ```
 *
 * @param entityClass - An entity class such as `Product`.
 * @param baseRepositoryClass - Base KeyValue repository class.
 * Defaults to `DefaultKeyValueRepository`
 *
 * @typeParam E - Entity class
 */
export function defineKeyValueRepositoryClass<E extends Entity>(
  entityClass: typeof Entity & {prototype: E},
  baseRepositoryClass: Constructor<
    KeyValueRepository<E>
  > = DefaultKeyValueRepository,
): KeyValueRepositoryClass<E> {
  const repoName = entityClass.name + 'Repository';
  const defineNamedRepo = new Function(
    'EntityCtor',
    'BaseRepository',
    `return class ${repoName} extends BaseRepository {
      constructor(dataSource) {
        super(EntityCtor, dataSource);
      }
    };`,
  );

  const repo = defineNamedRepo(entityClass, baseRepositoryClass);
  assert.equal(repo.name, repoName);
  return repo;
}

/**
 * Signature for KeyValueRepository classes
 *
 * @typeParam E - Entity class
 */
export interface KeyValueRepositoryClass<E extends Entity> {
  new (ds: juggler.DataSource): KeyValueRepository<E>;
}
