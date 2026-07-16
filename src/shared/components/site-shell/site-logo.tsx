import Image from "next/image";
import Link from "next/link";

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/r.png"
        alt="Recro Group"
        width={56}
        height={56}
        className="h-14 w-auto object-contain"
        priority
      />
    </Link>
  );
}
