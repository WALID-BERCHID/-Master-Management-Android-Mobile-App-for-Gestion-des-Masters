# Acceptance Checklist

1. Sign up creates a new user in Supabase Auth.
2. Sign in loads the dashboard after authentication.
3. Dashboard shows upcoming meetings, tasks, and recent students.
4. Create a student with strengths and needs and confirm it appears in the student list.
5. Open a student detail page and confirm meetings and attachments sections render.
6. Upload a PDF attachment and download it using a signed URL.
7. Create a meeting linked to a student.
8. Meeting detail page displays participants and agenda template.
9. Minutes editor autosaves and shows Saved status after edits.
10. Decision set to yes or deferred shows Create follow up task button.
11. Generated follow up task appears in the Tasks list.
12. Tasks filters update the list by status, priority, and owner.
13. Export meeting package as PDF using the export endpoint.
14. Export meeting package as DOCX using the export endpoint.
15. Settings Export all data downloads a JSON file.
16. Settings Delete all data removes students, meetings, tasks, minutes, and attachments.
17. RLS prevents access to another user data in each table.
18. Audit logs show meeting and task changes with user id and timestamp.
19. Storage bucket is private and file access requires a signed URL.
20. Billing flag off does not block features.
