import Image from "next/image";
import Link from "next/link";

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/assets/icons/logo_icon.png"
        alt="Recro Group"
        width={44}
        height={44}
        className="size-11 object-contain"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-foreground">
          Recro Group
        </span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Restoring families
        </span>
      </span>
    </Link>
  );
}
