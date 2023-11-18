import { KeyExpansion, AESEncrpty } from "@/data/operations";
import Image from "next/image";

export default function Home() {
  const expandedKey = KeyExpansion("0f1571c947d9e8590cb7add6af7f6798");
  const cipherText = AESEncrpty(
    "0123456789abcdeffedcba9876543210",
    expandedKey
  );
  return (
    <>
      <div>Test</div>
    </>
  );
}
