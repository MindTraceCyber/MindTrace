export default function Home() {
  return (
    <div className="text-white px-6 py-12">
      <h1 className="text-3xl font-bold text-cyan-400">🧠 MindTraceCyber</h1>
      <p className="mt-4 text-gray-300">
        Welcome to the MindTrace OSINT & Threat Intelligence platform.
      </p>

      <ul className="mt-8 space-y-2 text-lg">
        <li>
          👉 <a href="/evidence" className="text-blue-400 underline">Evidence Upload</a>
        </li>
        <li>
          👉 <a href="/threat-dossier" className="text-blue-400 underline">Threat Actor Dossier</a>
        </li>
      </ul>
    </div>
  );
}
