# Frontend Gelistirme Sprint Ciktilari

Bu dokuman, ikinci sprintteki \"Frontend gelistirme\" maddelerinin kod karsiligini listeler.

## 1) Dashboard UI kodla

- `app/(dashboard)/dashboard/page.tsx`
- `components/dashboard/dashboard-overview-cards.tsx`
- `components/dashboard/dashboard-analytics.tsx`
- `components/layout/*`

## 2) Gorev atama ekrani

- Route: `app/(dashboard)/dashboard/tasks/page.tsx`
- Ekran: `components/dashboard/tasks/tasks-screen.tsx`
- Gorev durum/priority kontrolu ve atama formu mevcut.

## 3) Calisan profil sayfasi

- Route: `app/(dashboard)/dashboard/employees/[employeeId]/page.tsx`
- Ekran: `components/dashboard/employees/employee-profile-screen.tsx`
- Liste ekranindan profil gecisi: `components/dashboard/employees/employees-table.tsx`

## 4) Zustand store kur

- Employee store: `store/employee-store.ts`
- Settings store: `store/settings-store.ts`
- Task store: `store/task-store.ts`

## 5) API'ye baglan (mock)

- Mock gorev API: `lib/mock-task-api.ts`
- Store tarafinda asenkron yukleme: `store/task-store.ts` icindeki `loadTasks`

## 6) Grafik bilesenleri

- `components/dashboard/dashboard-analytics.tsx`
- Departman dagilimi ve gorev durum dagilimi kartlari bulunur.

## 7) Mobil uyum kontrolu

Mobil uyum icin kodda bulunan ana responsive noktalar:

- Sidebar mobilde Sheet ile aciliyor:
  - `components/layout/dashboard-topnav.tsx`
  - `components/ui/sheet.tsx`
- Ekranlar `sm/md/lg/xl` siniflari ile responsive:
  - `components/dashboard/tasks/tasks-screen.tsx`
  - `components/dashboard/employees/employees-screen.tsx`
  - `components/dashboard/projects/projects-screen.tsx`
  - `components/dashboard/settings/settings-screen.tsx`
- Tablo kapsayicilarinda yatay scroll:
  - `components/ui/table.tsx`

## i18n kapsami (TR/EN)

Tasks/profile/analytics metinleri:
- `i18n/translations.ts`
