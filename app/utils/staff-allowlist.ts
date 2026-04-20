import type UserModel from 'codecrafters-frontend/models/user';

export const STAFF_ALLOWLIST_USERNAMES = ['vishaag', 'dronaxis'];

export function userIsStaffOrAllowlisted(user: UserModel | null | undefined): boolean {
  if (!user) {
    return false;
  }

  return user.isStaff || STAFF_ALLOWLIST_USERNAMES.includes(user.username);
}
