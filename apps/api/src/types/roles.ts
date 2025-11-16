export const Role = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
} as const;

export type Role = typeof Role[keyof typeof Role];

export const ALL_ROLES: Role[] = [Role.USER, Role.MODERATOR, Role.ADMIN];
export const STAFF_ROLES: Role[] = [Role.MODERATOR, Role.ADMIN];

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && ALL_ROLES.includes(value as Role);
}
