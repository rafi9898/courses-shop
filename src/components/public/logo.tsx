import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/images/rafal-podraza-logo.png"
      alt="Rafał Podraza"
      width={2172}
      height={724}
      priority
      sizes="(min-width: 1024px) 260px, 210px"
      className="h-11 w-auto sm:h-12"
    />
  );
}
