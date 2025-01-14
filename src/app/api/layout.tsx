import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Access - Rednote Tools",
  description: "Get access to Rednote Tools API for seamless integration with your applications.",
};

export default function ApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 