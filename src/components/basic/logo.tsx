import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface LogoProps {
  href?: string;
  className?: string;
}

export const Logo = ({ href = "/" }: LogoProps) => {
  return (
    <Link href={href} className="flex items-center gap-3">
      <Image src="/logo.png" alt="Split3" width="100" height="43" />
    </Link>
  );
};
