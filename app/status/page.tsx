import type { Metadata } from "next";
import StatusClient from "./StatusClient";

export const metadata: Metadata = {
  title: "Status - Omex",
  description: "Check the current status of Omex bot",
};

export default function StatusPage() {
  return <StatusClient />;
}
