import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { KeycloakAdminService } from './keycloak-admin.service';
import { RolesGuard } from './roles/roles.guard';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, KeycloakAdminService, RolesGuard],
  exports: [PassportModule, KeycloakAdminService, RolesGuard],
})
export class AuthModule {}
