export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-arcade-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-3xl text-arcade-yellow mb-2">OFFBET</h1>
          <p className="font-pixel text-[10px] text-arcade-muted">OFIS BAHIS SALONU</p>
        </div>
        {children}
      </div>
    </div>
  );
}
