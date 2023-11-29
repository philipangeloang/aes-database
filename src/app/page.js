import { AESDecrypt } from "@/aes/aes_decrypt/aes_decrypt";
import { HiplipAESDecrypt } from "@/aes/aes_decrypt/hiplip_aes_decrypt";
import { ModifiedAESDecrypt } from "@/aes/aes_decrypt/modified_aes_decrypt";
import { AESEncrypt } from "@/aes/aes_encrpyt/aes_encrypt";
import { HiplipAESEncrypt } from "@/aes/aes_encrpyt/hiplip_aes_encrypt";
import { ModifiedAESEncrypt } from "@/aes/aes_encrpyt/modified_aes_encrypt";
import { KeyExpansion } from "@/aes/aes_key_expansion/aes_key_expansion";
import { HiplipKeyExpansion } from "@/aes/aes_key_expansion/hiplip_key_expansion";
import { ModifiedKeyExpansion } from "@/aes/aes_key_expansion/modified_aes_key_expansion";
import { cipherKeys, encrpytionData } from "@/aes/constants";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
