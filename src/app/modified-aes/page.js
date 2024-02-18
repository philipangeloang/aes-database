"use client";
import Navbar from "@/components/navbar";
import React, { useState } from "react";

import { encrpytionData, cipherKey } from "@/aes/constants";
import { ModifiedKeyExpansion } from "@/aes/aes_key_expansion/modified_aes_key_expansion";
import { ModifiedAESEncrypt } from "@/aes/aes_encrpyt/modified_aes_encrypt";
import { ModifiedAESDecrypt } from "@/aes/aes_decrypt/modified_aes_decrypt";

const ModifiedAES = () => {
  const [inputTextEncrypt, setInputTextEncrypt] = useState(encrpytionData[0]);
  const [inputTextDecrypt, setInputTextDecrypt] = useState(encrpytionData[0]);
  const [inputKey, setInputKey] = useState(cipherKey);

  const [output, setOutput] = useState("");

  const [encrpyt, setEncrypt] = useState(true);
  const [decrypt, setDecrypt] = useState(false);

  return (
    <>
      <Navbar />

      <section className="bg-white dark:bg-gray-900 h-screen">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
          <div className="flex pt-24 pb-10  justify-center items-center">
            <button
              onClick={() => {
                setEncrypt(true);
                setDecrypt(false);
                setOutput("");
              }}
              type="button"
              className="w-48 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Encrpyt
            </button>
            <button
              onClick={() => {
                setEncrypt(false);
                setDecrypt(true);
                setOutput("");
              }}
              type="button"
              className="w-48 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Decrypt
            </button>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Modified AES
          </h1>

          {encrpyt && (
            <>
              <div className="mb-6 w-96 mx-auto">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Input text
                </label>
                <input
                  onChange={(e) => {
                    console.log(e.target.value);
                    setInputTextEncrypt(e.target.value);
                  }}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <label className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Input key
                </label>
                <input
                  onChange={(e) => {
                    console.log(e.target.value);
                    setInputKey(e.target.value);
                  }}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  const expandedKey = ModifiedKeyExpansion(inputKey);
                  const cipherText = ModifiedAESEncrypt(
                    inputTextEncrypt,
                    expandedKey
                  );
                  setOutput(cipherText);
                }}
                type="button"
                className="w-96 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Encrypt
              </button>

              <p className="mt-10 text-white">{output}</p>
            </>
          )}

          {decrypt && (
            <>
              <div className="mb-6 w-96 mx-auto">
                <label
                  for="default-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Input text
                </label>
                <input
                  onChange={(e) => {
                    console.log(e.target.value);
                    setInputTextDecrypt(e.target.value);
                  }}
                  type="text"
                  id="default-input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <label className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Input key
                </label>
                <input
                  onChange={(e) => {
                    console.log(e.target.value);
                    setInputKey(e.target.value);
                  }}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  const expandedKey = ModifiedKeyExpansion(inputKey);

                  const originalText = ModifiedAESDecrypt(
                    inputTextDecrypt,
                    expandedKey
                  );
                  setOutput(originalText);
                }}
                type="button"
                className="w-96 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Decrypt
              </button>

              <p className="mt-10 text-white">{output}</p>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ModifiedAES;
