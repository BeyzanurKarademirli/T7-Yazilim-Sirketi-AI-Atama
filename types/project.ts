import type { RoleId } from "@/lib/seed";

export interface ProjectEmployee {
  id: string;
  name: string;
  department: string;
  role: RoleId;
}

export interface ProjectGroup {
  groupName: string;
  employees: ProjectEmployee[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  groups: ProjectGroup[];
}

