// src/lib/authUtils.ts
import bcrypt from 'bcrypt';

const saltRounds = 10; // Cost factor for hashing - higher is slower but more secure

/**
 * Hashes a plain text password.
 * @param password The plain text password.
 * @returns A promise that resolves with the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Compares a plain text password with a stored hash.
 * @param plainPassword The plain text password to check.
 * @param hash The stored password hash.
 * @returns A promise that resolves with true if the password matches, false otherwise.
 */
export async function comparePassword(plainPassword: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hash);
}