import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CryptoModule } from './crypto/crypto.module';
import { GithubIntegrationModule } from './github-integration/github-integration.module';

@Module({
  imports: [PrismaModule, AuthModule, CryptoModule, GithubIntegrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
