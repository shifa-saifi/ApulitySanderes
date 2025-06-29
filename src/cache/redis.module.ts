import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({ url: process.env.REDIS_URL });
        client.on('error', () => null);
        await client.connect();
        return client;
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class RedisModule {}
