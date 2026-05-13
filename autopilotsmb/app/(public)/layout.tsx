// app/(public)/layout.tsx
// Wraps all public-facing pages with Header + Footer

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
