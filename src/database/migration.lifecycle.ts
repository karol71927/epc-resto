import { MikroORM } from '@mikro-orm/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class MigrationLifecycle implements OnApplicationBootstrap {
  constructor(private readonly orm: MikroORM) {}

  onApplicationBootstrap() {
    return this.orm.getMigrator().up();
  }
}
