import { AESDecrypt } from "@/aes/aes_decrypt/aes_decrypt";
import { AESEncrypt } from "@/aes/aes_encrpyt/aes_encrypt";
import { KeyExpansion } from "@/aes/aes_key_expansion/aes_key_expansion";

export default function Home() {
  const expandedKey = KeyExpansion("5468617473206D79204B756E67204675");
  const cipherText = AESEncrypt(
    "54776F204F6E65204E696E652054776F",
    expandedKey
  );
  const originalText = AESDecrypt(
    "29C3505F571420F6402299B31A02D73A",
    expandedKey
  );
  // console.log(cipherText);
  console.log(originalText);
  return (
    <>
      <div>Test</div>
    </>
  );
}
