import bcrypt from "bcrypt";

export async function generateSalt() {
  return bcrypt.genSalt();
}

export async function hashPassword(
  password: string
): Promise<{ pwd: string; salt: string }> {
  const generatedSalt = await generateSalt();
  const hashedPassword = await bcrypt.hash(password, generatedSalt);

  return {
    pwd: hashedPassword,
    salt: generatedSalt,
  };
}
