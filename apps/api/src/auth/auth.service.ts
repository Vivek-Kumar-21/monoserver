import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: any) {
    const { provider, providerAccountId, email, name, picture, accessToken } = profile;

    // Find the OAuth account
    let account = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: { user: true },
    });

    if (account) {
      // Update access token if it changed
      await this.prisma.account.update({
        where: { id: account.id },
        data: { accessToken },
      });
      return account.user;
    }

    // If no account, check if a user with this email already exists
    let user = email ? await this.prisma.user.findUnique({ where: { email } }) : null;

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          email: email || `${providerAccountId}@${provider}.placeholder.com`, // Fallback for github users without public email
          name,
          image: picture,
        },
      });
    }

    // Create the OAuth account linked to the user
    await this.prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider,
        providerAccountId,
        accessToken,
      },
    });

    return user;
  }

  generateJwt(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}