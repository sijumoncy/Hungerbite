import { v5 as uuidv5 } from "uuid";
import dotenv from "../config/dotenv";

export function generateUUIDWithNamespace(value: string) {
  const ID_NAMESPACE = dotenv.UUID_NAMESPACE;

  return uuidv5(value, ID_NAMESPACE);
}
