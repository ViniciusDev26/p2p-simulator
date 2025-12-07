import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { P2PModule } from './p2p/p2p.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'config'),
      serveRoot: '/config',
    }),
    P2PModule,
  ],
})
export class AppModule {}
