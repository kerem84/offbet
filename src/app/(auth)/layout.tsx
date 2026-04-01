import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-arcade-bg p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="OffBet"
            width={240}
            height={60}
            className="h-12 w-auto mb-2"
            priority
          />
          <p className="font-pixel text-[10px] text-arcade-muted">OFIS BAHIS SALONU</p>
        </div>
        {children}
      </div>
    </div>
  );
}
