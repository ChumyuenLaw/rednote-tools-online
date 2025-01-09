import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div className="relative w-8 h-8 md:w-10 md:h-10">
        <Image
          src="/favicon-32x32.png"
          alt="Image Convert Free Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          ImageConvertFree
        </span>
        <span className="text-xs md:text-sm text-muted-foreground">
          Always Free
        </span>
      </div>
    </Link>
  );
} 