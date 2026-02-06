"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import { Button } from "@/components/Button";

export type Attachment = {
  id: string;
  file_name: string;
  storage_path: string;
};

type Props = {
  studentId?: string;
  meetingId?: string;
  taskId?: string;
  initialAttachments: Attachment[];
};

export function AttachmentsClient({ studentId, meetingId, taskId, initialAttachments }: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [status, setStatus] = useState<string>("");

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    const supabase = getSupabaseBrowser();
    setStatus("Uploading");
    const path = `${studentId || "shared"}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("attachments").upload(path, file, { upsert: false });
    if (uploadError) {
      setStatus(uploadError.message);
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (!userId) {
      setStatus("Not authenticated");
      return;
    }
    const { data, error } = await supabase
      .from("attachments")
      .insert({
        user_id: userId,
        student_id: studentId || null,
        meeting_id: meetingId || null,
        task_id: taskId || null,
        file_name: file.name,
        storage_path: path
      })
      .select("id, file_name, storage_path")
      .single();

    if (error) {
      setStatus(error.message);
      return;
    }

    setAttachments((prev) => [data, ...prev]);
    setStatus("Uploaded");
  };

  const handleDownload = async (attachment: Attachment) => {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.storage.from("attachments").createSignedUrl(attachment.storage_path, 60);
    if (error || !data) {
      setStatus(error?.message || "Failed to create download link");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const handleDelete = async (attachment: Attachment) => {
    const supabase = getSupabaseBrowser();
    await supabase.storage.from("attachments").remove([attachment.storage_path]);
    await supabase.from("attachments").delete().eq("id", attachment.id);
    setAttachments((prev) => prev.filter((item) => item.id !== attachment.id));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-muted mb-2">Upload attachment</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(event) => handleUpload(event.target.files?.[0] || null)}
          className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm"
        />
        {status && <p className="text-xs text-muted mt-2">{status}</p>}
      </div>
      <div className="space-y-2">
        {attachments.length ? (
          attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface2 p-3">
              <div>
                <p className="text-sm font-medium">{attachment.file_name}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleDownload(attachment)}>Download</Button>
                <Button variant="ghost" onClick={() => handleDelete(attachment)}>Delete</Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No attachments yet.</p>
        )}
      </div>
    </div>
  );
}
