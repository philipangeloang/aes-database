import Navbar from "@/components/navbar";
import React from "react";

import { AESDecrypt } from "@/aes/aes_decrypt/aes_decrypt";
import { AESEncrypt } from "@/aes/aes_encrpyt/aes_encrypt";
import { KeyExpansion } from "@/aes/aes_key_expansion/aes_key_expansion";
import { encrpytionData, cipherKeys } from "@/aes/constants";

const StandardAES = () => {
  return (
    <>
      <Navbar />

      <section className="bg-white dark:bg-gray-900 pt-20 h-screen">
        <div></div>
      </section>
    </>
  );
};

export default StandardAES;
