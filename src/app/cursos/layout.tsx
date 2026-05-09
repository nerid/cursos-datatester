import ResourcesDrawer from "@/components/ResourcesDrawer";

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ResourcesDrawer />
    </>
  );
}
