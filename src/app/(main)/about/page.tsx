"use client";

import { PixelCard } from "@/components/ui/pixel-card";

const faqs = [
  {
    q: "OffBet nedir?",
    a: "OffBet, ofiste kimin hakli oldugunu kanitlamanin en medeni yoludur. Artik toplantilarda bagirmak yok — bahis ac, hakliysan kazan.",
  },
  {
    q: "Gercek para mi kaybedecegim?",
    a: "Hayir. Burada kaybettigin tek sey itibarin. Puanlar tamamen sanal, ama leaderboard'da sonuncu olmanin verdigi utanc gercek.",
  },
  {
    q: "Nasil puan kazanirim?",
    a: "Kayit olunca 100 puan ile basliyorsun. Sonrasi tamamen senin zekan, sezgilerin ve sans tanricasinin keyfine bagli.",
  },
  {
    q: "Bahis acabilir miyim?",
    a: "Evet! Ama admin onayindan gecmesi lazim. 'Yarin ofise meteor duser' gibi bahisler reddedilebilir. Ya da onaylanir, kim bilir.",
  },
  {
    q: "Puanlarim bitti, ne yapacagim?",
    a: "Once derin bir nefes al. Sonra 'Tam Kayip' rozetini gururla tak. Hayat devam ediyor, ama leaderboard'da siralamanda degisiklik yok.",
  },
  {
    q: "Rozetler ne ise yarar?",
    a: "Hicbir ise yaramaz. Ama 'Kumarhane Krali' rozeti varken toplantida farkli bir havan olur, bunu inkar edemezsin.",
  },
  {
    q: "Bu uygulama yasal mi?",
    a: "Sanal puanlarla ofis dedikodularina bahis oynamak... Hukuk departmanina sorduk, hala guluyorlar.",
  },
  {
    q: "Neden OffBet?",
    a: "Cunku 'Office' + 'Bet' = OffBet. Dahice, biliyoruz. Isimlendirme toplantisi tam 47 saniye surdu.",
  },
];

const stats = [
  { label: "KAYBEDILEN ITIBAR", value: "OLCULEMEZ", icon: "📉" },
  { label: "YAPILAN BAHIS", value: "∞", icon: "🎰" },
  { label: "PISMANLK SEVIYESI", value: "YUKSEK", icon: "😅" },
  { label: "EGLENCE SEVIYESI", value: "MAKSIMUM", icon: "🕹️" },
];

export default function AboutPage() {
  return (
    <div className="space-y-10 max-w-3xl">
      {/* Header */}
      <div className="space-y-3 border-b-2 border-arcade-border pb-6">
        <h1 className="font-pixel text-lg text-arcade-yellow tracking-widest">
          OFFBET HAKKINDA
        </h1>
        <p className="font-pixel text-[10px] text-arcade-muted leading-relaxed">
          OFIS BAHIS PLATFORMU v1.0 — CIDDI ISLER ICIN CIDDI OLMAYAN BIR UYGULAMA
        </p>
      </div>

      {/* Manifesto */}
      <PixelCard glowColor="var(--color-arcade-yellow)">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📢</span>
            <h2 className="font-pixel text-sm text-arcade-yellow tracking-widest">MANIFESTO</h2>
          </div>
          <div className="space-y-3 font-pixel text-[10px] text-arcade-text leading-relaxed">
            <p>
              Bir zamanlar ofiste fikirler tartismalarla cozulurdu.
              Sesini en cok cikaran hakliydi. Kaos vardi, duzensizlik vardi.
            </p>
            <p>
              Sonra OffBet geldi.
            </p>
            <p>
              Artik &quot;Pazartesi toplanti iptal olur&quot; diyorsan, bahsini koy.
              &quot;Deploy Cuma gunu patlar&quot; mi diyorsun? Kolay, 50 puan bas gosterelim.
              Lafla degil, puanla konusuyoruz.
            </p>
            <p className="text-arcade-green">
              OffBet: Fikrini soyle, puanini koy, ya kazan ya utanarak sus.
            </p>
          </div>
        </div>
      </PixelCard>

      {/* Fun Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <PixelCard key={stat.label} className="text-center space-y-2">
            <span className="text-2xl">{stat.icon}</span>
            <p className="font-pixel text-xs text-arcade-yellow">{stat.value}</p>
            <p className="font-pixel text-[8px] text-arcade-muted">{stat.label}</p>
          </PixelCard>
        ))}
      </div>

      {/* Rules */}
      <PixelCard>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <h2 className="font-pixel text-sm text-arcade-yellow tracking-widest">KURALLAR</h2>
          </div>
          <ol className="space-y-3 font-pixel text-[10px] text-arcade-text leading-relaxed list-none">
            <li className="flex gap-2">
              <span className="text-arcade-green shrink-0">01.</span>
              <span>Her kullanici 100 puanla baslar. Bunu akillica harca ya da ilk gun bitir, senin tercihin.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-arcade-green shrink-0">02.</span>
              <span>Bahis onermek ucretsiz. Admin onaylarsa aktif olur. Onaylamazsa, belki bahsin yeteri kadar komik degildir.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-arcade-green shrink-0">03.</span>
              <span>Bir bahse EVET veya HAYIR diyerek puan koyarsin. Geri donusu yoktur. Hayatta da oyle.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-arcade-green shrink-0">04.</span>
              <span>Bahis sonuclandiginda kazananlar havuzu paylesir. Kaybedenlerin puanlari... nereye gidiyor kimse bilmiyor.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-arcade-green shrink-0">05.</span>
              <span>Leaderboard herkesin gorebilecegi sekilde guncellenir. Hem motivasyon hem de utanc kaynagidir.</span>
            </li>
          </ol>
        </div>
      </PixelCard>

      {/* FAQ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-arcade-border pb-3">
          <span className="text-2xl">❓</span>
          <h2 className="font-pixel text-sm text-arcade-muted tracking-widest">
            SIK SORULAN SORULAR
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {faqs.map((faq) => (
            <PixelCard key={faq.q} className="space-y-2">
              <p className="font-pixel text-[10px] text-arcade-yellow">{faq.q}</p>
              <p className="font-pixel text-[10px] text-arcade-muted leading-relaxed">{faq.a}</p>
            </PixelCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-6 border-t-2 border-arcade-border space-y-2">
        <p className="font-pixel text-[10px] text-arcade-muted">
          OFFBET v1.0 — HICBIR HAKKI SAKLI DEGILDIR
        </p>
        <p className="font-pixel text-[8px] text-arcade-muted/50">
          Bu uygulama sırasında hicbir calisanin kariyerine zarar gelmemistir. Muhtemelen.
        </p>
      </div>
    </div>
  );
}
