export default function PrintLayout({ children }: { children: React.ReactNode }) {
  // Intentionally bare — no sidebar, no topbar, no app shell.
  // This layout renders the page as a clean standalone document for printing.
  return <>{children}</>;
}
