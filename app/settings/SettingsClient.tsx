"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { exportAllData, deleteAllData } from "@/lib/actions";

export default function SettingsClient() {
  const [open, setOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>("");

  const handleExport = async () => {
    setExportStatus("Preparing export");
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "iep-prep-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setExportStatus("Export ready");
  };

  const handleDelete = async () => {
    await deleteAllData();
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleExport}>Export all data</Button>
      {exportStatus && <p className="text-xs text-muted">{exportStatus}</p>}
      <Button variant="outline" onClick={() => setOpen(true)}>Delete all data</Button>
      <Modal
        open={open}
        title="Delete all data"
        description="This removes students, meetings, tasks, attachments, and minutes. This action cannot be undone."
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
      />
    </div>
  );
}
