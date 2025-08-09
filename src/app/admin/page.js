import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <main>
      <h1>Administration</h1>
      <Image src="/admin-banner.jpg" alt="Admin Banner" width={1024} height={256} />
      <Link href="/">Retour à l’accueil</Link>
    </main>
  );
}
