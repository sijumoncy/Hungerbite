import bcrypt from "bcrypt";

export async function generateSalt() {
  return bcrypt.genSalt();
}

export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
  salt: string
) {
  return (await hashPassword(password, salt)) === hashedPassword;
}
