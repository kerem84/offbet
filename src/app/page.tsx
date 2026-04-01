export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-arcade-bg">
      <h1
        className="font-pixel text-arcade-yellow text-2xl md:text-4xl tracking-wider text-center leading-relaxed"
        style={{ textShadow: "0 0 20px #ffe66d, 0 0 40px #ffe66d88" }}
      >
        OFFBET
      </h1>
      <p className="mt-6 font-pixel text-arcade-muted text-xs tracking-widest">
        INSERT COIN TO CONTINUE
      </p>
    </main>
  );
}
