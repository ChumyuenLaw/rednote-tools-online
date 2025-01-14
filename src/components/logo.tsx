import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg transform rotate-6"></div>
        <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">R</span>
        </div>
      </div>
      <span className="font-bold text-xl">Rednote</span>
    </Link>
  );
} 