import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import axios from 'axios';

@Injectable()
export class GithubIntegrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
  ) {}

  async handleCallback(code: string, userId: string): Promise<void> {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('GitHub OAuth credentials are not configured.');
    }

    // 1. Exchange code for access token
    let tokenData;
    try {
      const tokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      tokenData = tokenRes.data;
    } catch (error) {
      throw new BadRequestException('Failed to exchange code with GitHub');
    }

    if (tokenData.error) {
      throw new BadRequestException(tokenData.error_description || tokenData.error);
    }

    const accessToken = tokenData.access_token;
    const scopes = tokenData.scope;

    // 2. Get GitHub user profile
    let githubProfile;
    try {
      const profileRes = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      githubProfile = profileRes.data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch GitHub profile');
    }

    // 3. Encrypt the access token
    const encryptedToken = this.crypto.encrypt(accessToken);

    // 4. Save to database
    await this.prisma.gitHubConnection.upsert({
      where: { userId },
      update: {
        githubUserId: githubProfile.id.toString(),
        username: githubProfile.login,
        accessToken: encryptedToken,
        scopes,
      },
      create: {
        userId,
        githubUserId: githubProfile.id.toString(),
        username: githubProfile.login,
        accessToken: encryptedToken,
        scopes,
      },
    });
  }
}
