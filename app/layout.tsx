import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Shell from "@/components/Shell";

const lexend = Lexend({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Zelador | Manutenção do site da Cumaru Arquitetura",
  description: "Pedidos, quadro de classes, velocidade, conteúdo e publicação do site num lugar só.",
};

export const viewport: Viewport = {
  themeColor: "#121d26",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={lexend.className}>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
