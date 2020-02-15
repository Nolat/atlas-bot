// * Types
import { Command } from "types";

const isObjectCommand = (object: any): object is Command => {
  return (
    "name" in object &&
    "aliases" in object &&
    "description" in object &&
    "usage" in object &&
    "onlyStaff" in object &&
    "run" in object
  );
};

export default isObjectCommand;
