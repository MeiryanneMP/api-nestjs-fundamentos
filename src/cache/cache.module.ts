import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as CacheModuloNest } from '@nestjs/cache-manager';

@Module({
  imports: [
        CacheModuloNest.register({
      ttl:90000000,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
