import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';
import { extractRolesFromToken } from './utils/extract-roles.util';

interface KeycloakJwtPayload {
  sub: string;
  email?: string;
  preferred_username?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<string, { roles?: string[] }>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const issuer = configService.get<string>('KEYCLOAK_ISSUER_URL');
    const audience = configService.get<string>('KEYCLOAK_CLIENT_ID');

    if (!issuer) {
      throw new Error('KEYCLOAK_ISSUER_URL is not defined');
    }

    if (!audience) {
      throw new Error('KEYCLOAK_CLIENT_ID is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer,
      audience,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
      }),
    });
  }

  validate(payload: KeycloakJwtPayload) {
    return {
      sub: payload.sub,
      email: payload.email,
      username: payload.preferred_username,
      roles: extractRolesFromToken(payload),
    };
  }
}
