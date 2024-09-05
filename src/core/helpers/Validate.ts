import Ajv from "ajv"

export const Validate = {
  validate(schema: Record<string, unknown>, data: unknown): boolean {
    const validate = new Ajv().compile(schema)
    return validate(data)
  },

  validateWithException<T>(schema: Record<string, unknown>, data: unknown): T {
    const validate = new Ajv().compile(schema)
    if (!validate(data)) {
      throw new Error("provided data does not match required schema")
    }

    return data as T
  },
}
