import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Lattes App',
  description: 'Lattes App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <header className="bg-slate-800 h-14 ">
          <nav className="md:container md:mx-auto md:mb-5 md:pt-3">
            <Link className="text-xl mr-6" href="/">
              Principal
            </Link>
            <Link className="text-xl mr-6" href="/instituto">
              Instituto
            </Link>
            <Link className="text-xl mr-6" href="/pesquisador">
              Pesquisador
            </Link>
            <Link className="text-xl mr-6" href="/producao">
              Produção
            </Link>
            <Link className="text-xl mr-6" href="/grafo">
              Grafo
            </Link>
          </nav>
        </header>
        <main className="md:container md:mx-auto md:mb-5">{children}</main>
      </body>
    </html>
  );
}
