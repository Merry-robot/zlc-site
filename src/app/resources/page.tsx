"use client";

import React, { useEffect, useState } from "react";

export default function ResourcesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.zlcartcc.org/v1/storage")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setFiles(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-neutral-950 min-h-screen py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-white text-center">Resources</h1>
      {loading && <p className="text-white">Loading resources...</p>}
      {!loading && files.length === 0 && <p className="text-white">No resources found.</p>}
      {!loading && files.length > 0 && (
        <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-lg shadow-lg p-6">
          <ul className="divide-y divide-stone-800">
            {files.map((file: any, idx: number) => (
              <li key={file.id || idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col">
                  <span className="text-white font-mono text-lg">{file.name}</span>
                  {file.description && <span className="text-stone-400 text-xs mt-1">{file.description}</span>}
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 md:mt-0 inline-block bg-stone-800 hover:bg-stone-700 text-stone-100 px-4 py-2 rounded transition-colors text-sm font-semibold"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
