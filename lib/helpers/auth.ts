import { hash, compare } from 'bcryptjs';

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}
