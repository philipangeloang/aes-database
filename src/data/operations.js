import { encrpytionData, cipherKeys, sBox, Rcon } from "./data";
import { NextApiResponse } from "next";

export function keyExpansion(key) {
  // EAD27321B58DBAD2312BF5607F8D292F
  // let firstKey = key.match(/.{1,2}/g);

  // function rotWord(word: any) {
  //   let tempSlot = word[0];
  //   word[0] = word[1];
  //   word[1] = word[2];
  //   word[2] = word[3];
  //   word[3] = tempSlot;

  //   return word;
  // }

  function subWord(word) {
    // for (let i = 0; i < 4; i++) {
    //   word[i] = sBox[word[i]];
    // }
    // return word;
    // let newWord = sBox(word);
    // return newWord;
  }

  subWord("8D");

  // let rotated = rotWord(firstKey.slice(12, 16));
  // let subtsituted = subWord(rotated);

  // console.log("Original ", firstKey.slice(12, 16));
  // console.log("Rotated ", rotated);
  // console.log("Substituted ", subtsituted);

  // for (let i = 16; i < 176; i++) {

  // }

  console.log();
}
