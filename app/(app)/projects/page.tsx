import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProjectManager } from "@/components/project-manager";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");

  const projects = await getProjects();

  return (
    <div>
      <PageHeader
        eyebrow="Projects"
        title="Projects and billing"
        description="Project codes are the backbone of the report. Archiving keeps history intact without showing the project on new entries."
      />
      <div className="mt-6">
        <ProjectManager projects={projects} />
      </div>
    </div>
  );
}
