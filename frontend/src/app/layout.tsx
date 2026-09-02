import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/components/providers";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
    variable: "--font-eb-garamond",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://app.lexnigeriana.com"),
    title: "LexNigeriana AI - Legal Intelligence Platform",
    description:
        "AI-powered Nigerian legal intelligence, document analysis, and jurisprudence platform.",
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico" },
        ],
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        type: "website",
        url: "https://app.lexnigeriana.com",
        siteName: "LexNigeriana AI",
        title: "LexNigeriana AI - Legal Intelligence Platform",
        description:
            "AI-powered Nigerian legal intelligence, document analysis, and jurisprudence platform.",
        images: [
            {
                url: "/link-image.jpg",
                width: 1200,
                height: 651,
                alt: "LexNigeriana AI",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "LexNigeriana AI - Legal Intelligence Platform",
        description:
            "AI-powered Nigerian legal intelligence, document analysis, and jurisprudence platform.",
        images: ["/link-image.jpg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${ebGaramond.variable} font-sans antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
