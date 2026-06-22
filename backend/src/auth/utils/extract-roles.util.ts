import { EcosystemRole } from '../roles/ecosystem-role.enum';

interface KeycloakJwtPayload {
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<string, { roles?: string[] }>;
}

const ECOSYSTEM_ROLES = new Set<string>(Object.values(EcosystemRole));

export function extractRolesFromToken(payload: KeycloakJwtPayload): EcosystemRole[] {
  const realmRoles = payload.realm_access?.roles ?? [];

  const clientRoles = Object.values(payload.resource_access ?? {}).flatMap(
    (resource) => resource.roles ?? [],
  );

  const allRoles = [...realmRoles, ...clientRoles];

  return allRoles.filter((role): role is EcosystemRole => ECOSYSTEM_ROLES.has(role));
}
