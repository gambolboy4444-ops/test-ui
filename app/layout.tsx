export const metadata = { title: 'TORUS', description: 'V17.0' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html><body style={{ margin: 0 }}>{children}</body></html>)
}
