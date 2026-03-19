import type { Metadata } from "next";
import "./globals.css";
import Header from "@/widgets/header/ui/Header";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";
import Footer from "@/widgets/footer/ui/Footer";
import { LoadingBar } from "@cher1shrxd/loading";
import { ThemeSetter, DdsRegistry } from "@b1nd/dodam-design-system/next";
import { OverlayProvider } from "@b1nd/dodam-design-system/components";
import { colors } from "@b1nd/dodam-design-system/colors";
import { getNav } from "@/lib/nav";

export const metadata: Metadata = {
  title: "B1ND Docs",
  description: "B1ND 팀 문서 - DDS, App in Dodam, Team Guides",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = getNav();

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeSetter />
      </head>
      <body className="antialiased bg-background-default text-text-primary">
        <OverlayProvider>
          <LoadingBar color={colors.brand.primary} />
          <Header />
          <div className="w-full max-w-360 mx-auto px-4 md:px-2 flex items-start pt-14">
            <Sidebar nav={nav} />
            <main className="flex-1 md:pl-56 pt-8 md:pt-16 min-w-0">
              <div className="min-h-body">
                <DdsRegistry>{children}</DdsRegistry>
              </div>
              <Footer />
            </main>
          </div>
        </OverlayProvider>
      </body>
    </html>
  );
}
