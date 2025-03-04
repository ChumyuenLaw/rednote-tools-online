import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Rednote Tools",
  description: "Get in touch with Rednote Tools team for support or inquiries.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 