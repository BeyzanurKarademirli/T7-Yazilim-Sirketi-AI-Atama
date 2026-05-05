# Frontend & UI Sprint Ciktilari

Bu dokuman, ilk sprintte istenen Frontend & UI gereksinimlerinin projedeki karsiligini listeler.

## 1) Dashboard wireframe

- Uygulama yerlesimi:
  - Sol sidebar: `components/layout/dashboard-sidebar.tsx`
  - Ust gezinme: `components/layout/dashboard-topnav.tsx`
  - Ortak shell: `components/layout/dashboard-shell.tsx`
- Dashboard ana ekrani:
  - `app/(dashboard)/dashboard/page.tsx`
  - `components/dashboard/dashboard-overview-cards.tsx`
  - `components/dashboard/dashboard-analytics.tsx`

## 2) Gorev atama ekrani (mock)

- Route: `app/(dashboard)/dashboard/tasks/page.tsx`
- Ekran: `components/dashboard/tasks/tasks-screen.tsx`
- Mock API: `lib/mock-task-api.ts`
- Store: `store/task-store.ts`
- Tipler: `types/task.ts`

## 3) Calisan listesi ekrani

- Route: `app/(dashboard)/dashboard/employees/page.tsx`
- Sayfa konteyneri: `components/dashboard/employees/employees-screen.tsx`
- Tablo: `components/dashboard/employees/employees-table.tsx`

## 4) Ekran akis diyagrami (metinsel)

1. `/dashboard` -> genel ozet + analytics
2. `/dashboard/employees` -> calisan listesi
3. `/dashboard/employees/[employeeId]` -> calisan profil detayi
4. `/dashboard/tasks` -> gorev atama ve gorev durum yonetimi
5. `/dashboard/departments` -> departman yonetimi
6. `/dashboard/projects` -> proje ve grup atamalari
7. `/dashboard/settings` -> ayarlar sekmeleri

## 5) Next.js proje iskeleti

- App Router yapisi: `app/`
- Bilesenler: `components/`
- State katmani: `store/`
- Tipler: `types/`
- Yardimci fonksiyonlar: `lib/`
- i18n katmani: `i18n/`

## 6) Tailwind tema kurulumu

- Tailwind config: `tailwind.config.ts`
- PostCSS config: `postcss.config.mjs`
- Global tema degiskenleri: `app/globals.css`

## 7) Bilesen listesi (ozet)

- Layout:
  - `dashboard-shell.tsx`, `dashboard-sidebar.tsx`, `dashboard-topnav.tsx`, `dashboard-nav.tsx`
- Dashboard:
  - `dashboard-overview-cards.tsx`, `dashboard-analytics.tsx`
- Employees:
  - `employees-screen.tsx`, `employees-table.tsx`, `employee-dialog.tsx`, `employee-profile-screen.tsx`
- Tasks:
  - `tasks-screen.tsx`
- Departments:
  - `departments-screen.tsx`
- Projects:
  - `projects-screen.tsx`
- Settings:
  - `settings-screen.tsx` ve `settings/tabs/*`
- UI atoms:
  - `components/ui/*`
