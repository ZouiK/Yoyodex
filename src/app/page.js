import Image from 'next/image';

export default function HomePage() {
  return (
    <main>
      <Image src="/logo.png" alt="Logo" width={180} height={48} priority />
      <h1>Bienvenue sur Yoyodex</h1>
      <p>Votre app Next.js dynamique.</p>
    </main>
  );
}
