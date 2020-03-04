// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/typeorm
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  bind,
  BindingScope,
  Component,
  config,
  Context,
  ContextTags,
  inject,
  Injection,
  LifeCycleObserver,
  ResolutionSession,
} from '@loopback/core';
import {ConnectionManager, ConnectionOptions} from 'typeorm';
import {TypeOrmBindings} from './keys';
import {TypeOrmConfig} from './types';

@bind({
  tags: {[ContextTags.KEY]: TypeOrmBindings.COMPONENT},
  scope: BindingScope.SINGLETON,
})
export class TypeOrmComponent implements Component, LifeCycleObserver {
  readonly connectionManager = new ConnectionManager();

  constructor(
    @config()
    readonly typeOrmConfig: TypeOrmConfig = [],
  ) {}

  async start() {
    let configs: ConnectionOptions[];
    if (!Array.isArray(this.typeOrmConfig)) {
      configs = [this.typeOrmConfig];
    } else {
      configs = this.typeOrmConfig;
    }
    for (const c of configs) {
      const connection = this.connectionManager.create(c);
      await connection.connect();
    }
  }

  async stop() {
    for (const connection of this.connectionManager.connections) {
      await connection.close();
    }
  }
}

export namespace typeorm {
  export function connection(name?: string) {
    return inject(
      '',
      {decorator: '@typeorm.connection'},
      async (
        ctx: Context,
        injection: Readonly<Injection>,
        session: ResolutionSession,
      ) => {
        const component = await ctx.get(TypeOrmBindings.COMPONENT);
        return component.connectionManager.get(name);
      },
    );
  }
}
