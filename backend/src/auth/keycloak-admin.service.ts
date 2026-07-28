import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface KeycloakTokenResponse {
  access_token?: string;
}

interface KeycloakRoleRepresentation {
  id: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

@Injectable()
export class KeycloakAdminService {
  private readonly baseUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.getRequiredConfig('KEYCLOAK_BASE_URL').replace(/\/$/, '');
    this.realm = this.getRequiredConfig('KEYCLOAK_REALM');
    this.clientId = this.getRequiredConfig('KEYCLOAK_ADMIN_CLIENT_ID');
    this.clientSecret = this.getRequiredConfig('KEYCLOAK_ADMIN_CLIENT_SECRET');
  }

  async assignRealmRole(keycloakUserId: string, roleName: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    const role = await this.getRealmRole(roleName, accessToken);

    const response = await fetch(
      `${this.baseUrl}/admin/realms/${encodeURIComponent(this.realm)}` +
        `/users/${encodeURIComponent(keycloakUserId)}/role-mappings/realm`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([role]),
      },
    );

    if (!response.ok) {
      const responseBody = await response.text();

      throw new BadGatewayException(
        `Keycloak role assignment failed with status ${response.status}: ${responseBody}`,
      );
    }
  }

  private async getAccessToken(): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/realms/${encodeURIComponent(this.realm)}` + '/protocol/openid-connect/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      },
    );

    if (!response.ok) {
      const responseBody = await response.text();

      throw new BadGatewayException(
        `Keycloak admin authentication failed with status ${response.status}: ${responseBody}`,
      );
    }

    const tokenResponse = (await response.json()) as KeycloakTokenResponse;

    if (!tokenResponse.access_token) {
      throw new InternalServerErrorException('Keycloak did not return an access token');
    }

    return tokenResponse.access_token;
  }

  private async getRealmRole(
    roleName: string,
    accessToken: string,
  ): Promise<KeycloakRoleRepresentation> {
    const response = await fetch(
      `${this.baseUrl}/admin/realms/${encodeURIComponent(this.realm)}` +
        `/roles/${encodeURIComponent(roleName)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const responseBody = await response.text();

      throw new BadGatewayException(
        `Keycloak role lookup failed with status ${response.status}: ${responseBody}`,
      );
    }

    return response.json() as Promise<KeycloakRoleRepresentation>;
  }

  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(`${key} is not defined`);
    }

    return value;
  }
}
