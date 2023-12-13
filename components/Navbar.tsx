'use client';

import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  if (pathname === '/factory/create') {
    return null;
  }
  return (
    <nav className="mb-4 p-4 md:p-12">
      <a
        className={`mr-4 ${pathname === '/' ? 'text-black border-b' : ''}`}
        href="/"
      >
        🤖 人才市场
      </a>
      <a
        className={`mr-4 ${
          pathname === '/factory/create' ? 'text-black border-b' : ''
        }`}
        href="/factory/create"
      >
        ➕ 捏皮套人
      </a>
      {/* <a className={`mr-4 ${pathname === "/structured_output" ? "text-white border-b" : ""}`} href="/structured_output">🧱 Structured Output</a>
      <a className={`mr-4 ${pathname === "/agents" ? "text-white border-b" : ""}`} href="/agents">🦜 Agents</a>
      <a className={`mr-4 ${pathname === "/retrieval" ? "text-white border-b" : ""}`} href="/retrieval">🐶 Retrieval</a>
      <a className={`mr-4 ${pathname === "/retrieval_agents" ? "text-white border-b" : ""}`} href="/retrieval_agents">🤖 Retrieval Agents</a> */}
    </nav>
  );
}
