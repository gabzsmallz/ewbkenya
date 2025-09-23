import Head from 'next/head'; import Nav from './Nav';
export default function Layout({title, children}){
  return(<>
    <Head><title>{title?title+' • ':''}Org Portal</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
    <Nav/><main className="container my-8">{children}</main>
    <footer className="container my-16 text-sm text-gray-500"><div className="card">© {new Date().getFullYear()} Nonprofit Org.</div></footer>
  </>);
}
