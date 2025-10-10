import ListingClient from "./ListingClient";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params; // ✅ allowed here (server)

  // Simply render the client component
  return <ListingClient id={id} />;
}
