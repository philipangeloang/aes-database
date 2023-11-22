import { AESDecrypt } from "@/aes/aes_decrypt/aes_decrypt";
import { ModifiedAESDecrypt } from "@/aes/aes_decrypt/modified_aes_decrypt";
import { AESEncrypt } from "@/aes/aes_encrpyt/aes_encrypt";
import { ModifiedAESEncrypt } from "@/aes/aes_encrpyt/modified_aes_encrypt";
import { KeyExpansion } from "@/aes/aes_key_expansion/aes_key_expansion";
import { ModifiedKeyExpansion } from "@/aes/aes_key_expansion/modified_aes_key_expansion";
import { cipherKey, text } from "@/aes/constants";

export default function Home() {
  // 54776F204F6E65204E696E652054776F
  const expandedKey = ModifiedKeyExpansion(cipherKey);
  const cipherText = ModifiedAESEncrypt(text, expandedKey);
  const originalText = ModifiedAESDecrypt(cipherText, expandedKey);

  console.log(text);
  console.log(cipherText);
  console.log(originalText);
  console.log("-----------");

  return (
    <>
      <div>Test</div>
    </>
  );
}
