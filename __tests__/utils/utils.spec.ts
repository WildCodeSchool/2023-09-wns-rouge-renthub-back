import 'reflect-metadata';
import { config } from "dotenv";
config();
import { describe, it, expect } from "@jest/globals";
import { generateSecurityCode } from "../../src/utils/utils";

describe("UTILS functions", () => {
  it("should return true if length of code is correct", async () => {
    const length = 10;
    const randomCode = generateSecurityCode(length);
    
    expect(typeof randomCode).toBe("string");
    expect(randomCode).toHaveLength(length);
  });

  it("should return false if length of code is NOT correct", async () => {
    const length = 10;
    const randomCode = generateSecurityCode(length);
    
    expect(typeof randomCode).toBe("string");
    expect(randomCode).not.toHaveLength(length-1);
  });
});