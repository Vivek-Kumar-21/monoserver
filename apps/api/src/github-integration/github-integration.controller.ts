import { Controller, Get, Query, Req, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GithubIntegrationService } from './github-integration.service';
import { Request, Response } from 'express';

@Controller('github-integration')
@UseGuards(JwtAuthGuard)
export class GithubIntegrationController {
  constructor(private readonly githubService: GithubIntegrationService) {}

  @Get('connect')
  async connect(@Res() res: Response) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `http://localhost:3001/api/github-integration/callback`;
    const scope = 'public_repo,read:user,user:email';
    
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Req() req: Request, @Res() res: Response) {
    if (!code) {
      throw new BadRequestException('No code provided');
    }

    // req.user is populated by JwtAuthGuard
    const user: any = req.user;

    await this.githubService.handleCallback(code, user.id);

    res.redirect(`${process.env.WEB_URL || 'http://localhost:3000'}/onboarding?success=github_connected`);
  }
}
