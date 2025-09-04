import Layout from '../components/Layout';
export default function Donate(){return(<Layout title="Donate">
  <div className="card"><h1 className="text-2xl font-bold">Donate</h1><p className="mt-2">Support our projects. Use any of the options below.</p>
    <ul className="list-disc ml-6 mt-4 space-y-1">
      <li><strong>Paybill/Till:</strong> <code>XXXXXX</code></li>
      <li><strong>Bank:</strong> Account Name, Account No, Bank, Branch, SWIFT</li>
      <li><strong>PayPal:</strong> <a href="#" rel="noreferrer">Donate button</a></li>
    </ul>
    <img alt="QR code" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Donate" className="mt-4"/>
  </div>
</Layout>);}
