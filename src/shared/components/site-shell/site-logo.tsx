import Image from "next/image";
import Link from "next/link";

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/Recro_logo.png"
        alt="Recro Group"
        width={160}
        height={40}
        className="h-10 w-auto object-contain"
        priority
      />
    </Link>
  );
}
