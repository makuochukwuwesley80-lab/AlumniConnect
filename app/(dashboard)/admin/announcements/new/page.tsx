import AnnouncementForm from "@/components/admin/AnnouncementForm";

export const dynamic = "force-dynamic";

export default function NewAnnouncementPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <AnnouncementForm />
    </div>
  );
}
