import { Card } from "@/components/Card";
import SettingsClient from "@/app/settings/SettingsClient";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Settings</h1>
        <p className="text-sm text-muted mt-2">Manage your profile and data controls.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-muted mt-2">Update your name and preferences in Supabase Auth.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Data controls</h2>
          <p className="text-sm text-muted mt-2">Export your data or delete it entirely.</p>
          <div className="mt-4">
            <SettingsClient />
          </div>
        </Card>
      </div>
    </div>
  );
}
