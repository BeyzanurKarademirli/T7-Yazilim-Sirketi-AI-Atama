import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_DEPARTMENTS } from "@/lib/seed";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";
import type { TranslationKey } from "@/i18n/translations";
import type { Project } from "@/types/project";

function calcTotalSalary(employees: Employee[]) {
  return employees.reduce((sum, e) => sum + (Number.isFinite(e.salary) ? e.salary : 0), 0);
}

export type StoreError = Extract<
  TranslationKey,
  | "errorUnknown"
  | "errorDuplicateEmail"
  | "errorEmployeeNotFound"
  | "errorDepartmentInUse"
  | "errorDuplicateDepartment"
>;

export type StoreResult = { ok: true } | { ok: false; error: StoreError };

export type EmployeeStoreState = {
  employees: Employee[];
  departments: Department[];
  totalSalary: number;
  projects: Project[];

  addEmployee: (employee: Employee) => StoreResult;
  editEmployee: (employeeId: string, updated: Omit<Employee, "id">) => StoreResult;
  removeEmployee: (employeeId: string) => StoreResult;

  addDepartment: (department: Department) => StoreResult;
  removeDepartment: (departmentId: string) => StoreResult;

  replaceData: (data: { employees: Employee[]; departments: Department[] }) => StoreResult;
  resetData: () => void;

  createProject: (project: Omit<Project, "groups"> & { groups?: Project["groups"] }) => StoreResult;
  deleteProject: (projectId: string) => StoreResult;
  createGroup: (projectId: string, groupName: string) => StoreResult;
  assignEmployeeToGroup: (
    projectId: string,
    groupName: string,
    employeeId: string,
  ) => StoreResult;
  removeEmployeeFromGroup: (
    projectId: string,
    groupName: string,
    employeeId: string,
  ) => StoreResult;
};

export const useEmployeeStore = create<EmployeeStoreState>()(
  persist(
    (set) => ({
      employees: [
        { id: "ahmet", name: "Ahmet", email: "ahmet@example.com", department: "eng", salary: 90000, role: "frontendEngineer" },
        { id: "ali", name: "Ali", email: "ali@example.com", department: "eng", salary: 88000, role: "backendEngineer" },
        { id: "ayse", name: "Ayşe", email: "ayse@example.com", department: "hr", salary: 65000, role: "hrSpecialist" },
        { id: "mehmet", name: "Mehmet", email: "mehmet@example.com", department: "fin", salary: 72000, role: "accountant" },
      ],
      departments: DEFAULT_DEPARTMENTS,
      totalSalary: 0,
      projects: [
        {
          id: "project-x",
          name: "Project X",
          description: "Initial sample project.",
          groups: [
            {
              groupName: "Team A",
              employees: [
                { id: "ahmet", name: "Ahmet", department: "eng", role: "frontendEngineer" },
                { id: "ali", name: "Ali", department: "eng", role: "backendEngineer" },
              ],
            },
          ],
        },
      ],

  addEmployee: (employee) => {
    try {
      const email = employee.email.trim().toLowerCase();
      let result: StoreResult = { ok: true };

      set((state) => {
        if (state.employees.some((e) => e.email.toLowerCase() === email)) {
          result = { ok: false, error: "errorDuplicateEmail" };
          return state;
        }

        const employees = [ { ...employee, email }, ...state.employees ];
        return { employees, totalSalary: calcTotalSalary(employees) };
      });

      return result;
    } catch {
      return { ok: false, error: "errorUnknown" };
    }
  },

  editEmployee: (employeeId, updated) => {
    try {
      const email = updated.email.trim().toLowerCase();
      let result: StoreResult = { ok: true };

      set((state) => {
        const existing = state.employees.find((e) => e.id === employeeId);
        if (!existing) {
          result = { ok: false, error: "errorEmployeeNotFound" };
          return state;
        }

        if (
          state.employees.some(
            (e) => e.id !== employeeId && e.email.toLowerCase() === email,
          )
        ) {
          result = { ok: false, error: "errorDuplicateEmail" };
          return state;
        }

        const employees = state.employees.map((e) =>
          e.id === employeeId ? { ...e, ...updated, email } : e,
        );

        return { employees, totalSalary: calcTotalSalary(employees) };
      });

      return result;
    } catch {
      return { ok: false, error: "errorUnknown" };
    }
  },

  removeEmployee: (employeeId) => {
    try {
      let result: StoreResult = { ok: true };
      set((state) => {
        if (!state.employees.some((e) => e.id === employeeId)) {
          result = { ok: false, error: "errorEmployeeNotFound" };
          return state;
        }
        const employees = state.employees.filter((e) => e.id !== employeeId);
        return { employees, totalSalary: calcTotalSalary(employees) };
      });
      return result;
    } catch {
      return { ok: false, error: "errorUnknown" };
    }
  },

  addDepartment: (department) => {
    try {
      const name = department.name.trim();
      let result: StoreResult = { ok: true };

      set((state) => {
        if (
          state.departments.some(
            (d) =>
              d.id === department.id ||
              d.name.trim().toLowerCase() === name.toLowerCase(),
          )
        ) {
          result = { ok: false, error: "errorDuplicateDepartment" };
          return state;
        }

        return { departments: [...state.departments, { ...department, name }] };
      });

      return result;
    } catch {
      return { ok: false, error: "errorUnknown" };
    }
  },

  removeDepartment: (departmentId) => {
    try {
      let result: StoreResult = { ok: true };
      set((state) => {
        if (state.employees.some((e) => e.department === departmentId)) {
          result = { ok: false, error: "errorDepartmentInUse" };
          return state;
        }
        return {
          departments: state.departments.filter((d) => d.id !== departmentId),
        };
      });
      return result;
    } catch {
      return { ok: false, error: "errorUnknown" };
    }
  },

  replaceData: (data) => {
    try {
      const employees = Array.isArray(data.employees) ? data.employees : [];
      const departments = Array.isArray(data.departments) ? data.departments : [];
      set(() => ({
        employees,
        departments,
        totalSalary: calcTotalSalary(employees),
      }));
      return { ok: true };
    } catch {
      return { ok: false, error: "errorUnknown" };
    }
  },

  resetData: () =>
    set(() => ({
      employees: [],
      departments: DEFAULT_DEPARTMENTS,
          totalSalary: 0,
          projects: [],
    })),

      createProject: (project) => {
        try {
          const id = project.id;
          let result: StoreResult = { ok: true };
          set((state) => {
            if (state.projects.some((p) => p.id === id)) {
              result = { ok: false, error: "errorDuplicateDepartment" };
              return state;
            }
            const next: Project = {
              id,
              name: project.name,
              description: project.description,
              groups: project.groups ?? [],
            };
            return { projects: [...state.projects, next] };
          });
          return result;
        } catch {
          return { ok: false, error: "errorUnknown" };
        }
      },

      deleteProject: (projectId) => {
        try {
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== projectId),
          }));
          return { ok: true };
        } catch {
          return { ok: false, error: "errorUnknown" };
        }
      },

      createGroup: (projectId, groupName) => {
        try {
          let result: StoreResult = { ok: true };
          set((state) => {
            const projects = state.projects.map((p) => {
              if (p.id !== projectId) return p;
              if (p.groups.some((g) => g.groupName === groupName)) {
                result = { ok: false, error: "errorDuplicateDepartment" };
                return p;
              }
              return {
                ...p,
                groups: [...p.groups, { groupName, employees: [] }],
              };
            });
            return { projects };
          });
          return result;
        } catch {
          return { ok: false, error: "errorUnknown" };
        }
      },

      assignEmployeeToGroup: (projectId, groupName, employeeId) => {
        try {
          let result: StoreResult = { ok: true };
          set((state) => {
            const emp = state.employees.find((e) => e.id === employeeId);
            if (!emp) {
              result = { ok: false, error: "errorEmployeeNotFound" };
              return state;
            }
            const projects = state.projects.map((p) => {
              if (p.id !== projectId) return p;
              const groups = p.groups.map((g) => {
                if (g.groupName !== groupName) return g;
                if (g.employees.some((ee) => ee.id === employeeId)) {
                  result = { ok: false, error: "errorDuplicateEmail" };
                  return g;
                }
                return {
                  ...g,
                  employees: [
                    ...g.employees,
                    {
                      id: emp.id,
                      name: emp.name,
                      department: emp.department,
                      role: emp.role,
                    },
                  ],
                };
              });
              return { ...p, groups };
            });
            return { projects };
          });
          return result;
        } catch {
          return { ok: false, error: "errorUnknown" };
        }
      },

      removeEmployeeFromGroup: (projectId, groupName, employeeId) => {
        try {
          set((state) => {
            const projects = state.projects.map((p) => {
              if (p.id !== projectId) return p;
              const groups = p.groups.map((g) =>
                g.groupName === groupName
                  ? { ...g, employees: g.employees.filter((e) => e.id !== employeeId) }
                  : g,
              );
              return { ...p, groups };
            });
            return { projects };
          });
          return { ok: true };
        } catch {
          return { ok: false, error: "errorUnknown" };
        }
      },
    }),
    {
      name: "employee-dashboard-store",
      version: 1,
    },
  ),
);

