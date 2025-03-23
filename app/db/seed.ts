import bcrypt from "bcryptjs";
import { db } from ".";
import { UserTable } from "./schema";

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function main() {
  try {
    const hashedPassword: string = await hashPassword("example-password");
    const newUser = await db
      .insert(UserTable)
      .values({
        email: "user-email",
        username: "johndoe",
        role: "user",
        passwordDigest: hashedPassword,
      })
      .returning();

    console.log("User inserted successfully:", newUser);
  } catch (error) {
    console.error("Error inserting user:", error);
  }
}

main();
