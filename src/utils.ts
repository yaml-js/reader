import { ErrorObject } from "ajv";

export const mapErrors = (errors?: ErrorObject[] | null): string[] => {
  return errors ? errors.map((e) => e.message).filter((item) => !!item) as string[] : []
}
