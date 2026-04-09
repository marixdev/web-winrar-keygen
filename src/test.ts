/**
 * Quick test to verify the keygen works correctly.
 * Run this in the browser console or as a standalone script.
 */

import { generateRegisterInfo, buildRegFileContent } from "./crypto/WinRarKeygen";
import { getEncoder, Encoding } from "./crypto/Encoding";

export function runTest(): string {
  try {
    console.log("Starting key generation test...");
    const start = performance.now();
    
    const info = generateRegisterInfo("Github", "Single PC usage license", getEncoder(Encoding.UTF8));
    
    const elapsed = performance.now() - start;
    console.log(`Key generated in ${elapsed.toFixed(0)}ms`);
    
    // Validate structure
    const errors: string[] = [];
    
    if (!info.uid || info.uid.length !== 20) {
      errors.push(`UID length: expected 20, got ${info.uid?.length}`);
    }
    
    if (!info.items[0] || info.items[0].length !== 65) {
      errors.push(`items[0] length: expected 65, got ${info.items[0]?.length}`);
    }
    
    if (!info.items[1] || info.items[1].length !== 122) {
      errors.push(`items[1] length: expected 122, got ${info.items[1]?.length}`);
    }
    
    if (!info.items[2] || info.items[2].length !== 122) {
      errors.push(`items[2] length: expected 122, got ${info.items[2]?.length}`);
    }
    
    if (!info.items[3] || info.items[3].length !== 51) {
      errors.push(`items[3] length: expected 51, got ${info.items[3]?.length}`);
    }
    
    if (info.hexData.length % 54 !== 0) {
      errors.push(`hexData length not multiple of 54: ${info.hexData.length}`);
    }
    
    const content = buildRegFileContent(info);
    if (!content.startsWith("RAR registration data\r\n")) {
      errors.push("File content doesn't start with expected header");
    }
    
    if (errors.length > 0) {
      const msg = "ERRORS:\n" + errors.join("\n");
      console.error(msg);
      return msg;
    }
    
    console.log("All checks passed!");
    console.log("Generated key:\n" + content);
    return content;
  } catch (e) {
    const msg = `Error: ${e instanceof Error ? e.message : String(e)}`;
    console.error(msg);
    if (e instanceof Error && e.stack) {
      console.error(e.stack);
    }
    return msg;
  }
}

// Auto-run if loaded
console.log("Test module loaded. Call runTest() to test.");
