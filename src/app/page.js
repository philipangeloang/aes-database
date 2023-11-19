import { AESDecrypt } from "@/aes/aes_decrypt/aes_decrypt";
import { AESEncrypt } from "@/aes/aes_encrpyt/aes_encrypt";
import { KeyExpansion } from "@/aes/aes_key_expansion/aes_key_expansion";
import { cipherKey, cipherText, text } from "@/aes/constants";

export default function Home() {
  const expandedKey = KeyExpansion(cipherKey);
  const cipherText = AESEncrypt(text, expandedKey);
  const originalText = AESDecrypt(cipherText, expandedKey);
  console.log(cipherText);
  console.log(originalText);
  return (
    <>
      <div>Test</div>
    </>
  );
}
