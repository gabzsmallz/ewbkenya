import Head from 'next/head'; import Nav from './Nav';
export default function Layout({title,children}){
  return(<>
    <Head><title>{title?title+' • ':''}EWB Kenya Community</title><meta name="viewport" content="width=device-width, initial-scale=1"/></Head>
    <Nav/>
    <div className="hr-accent container mt-2" />
    <main className="container my-10">{children}</main>
    <footer className="container my-16 text-sm opacity-80">
      <div className="card"><p>© {new Date().getFullYear()} EWB Kenya Community · #SmallChangesBigImpact</p></div>
    </footer>
  </>);
}
