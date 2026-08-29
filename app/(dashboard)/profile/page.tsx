import ProfileEditor from "@/components/profile/ProfileEditor";

export default function ProfilePage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your AlumniConnect profile.
          </p>
        </div>

        <ProfileEditor />
      </div>
    </main>
  );
}