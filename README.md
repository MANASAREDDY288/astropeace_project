
## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/frontio-ai/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/frontio-ai/vite-template/blob/main/LICENSE).

# 🚀 Module Setup Guide: `user`

This document outlines how to initialize the module structure, add route entries, and register permissions for the `user` module.

---

## 📁 Empty Files Created

The following files should be created in your project structure:

```
src/app/user.tsx
src/modules/user/common/types.ts
src/modules/user/common/validation.ts
src/modules/user/common/service.ts
src/modules/user/common/grid.ts
src/modules/user/user.form.tsx
src/modules/user/user.view.tsx
src/modules/user/user.list.tsx
src/modules/user/user.page.tsx
```

---

## 🧱 Recommended File Creation Order

1. `types.ts`
2. `validation.ts`
3. `service.ts`
4. `grid.ts`
5. `user.form.tsx`
6. `user.view.tsx`
7. `user.list.tsx`
8. `user.page.tsx`
9. `user.tsx`

---

## 🛠️ Route Setup

### 1. `src/utils/services/app.router.ts`

Add the route key:

```ts
USER: "/user",
```

---

### 2. `src/App.tsx`

Register the route:

```tsx
<Route element={<User />} path={AppRouter.USER} />
```

---

## 🔐 Permissions Setup

### Site Config Entry:

Add the following entry to your permission configuration:

```ts
{
  name: "User",
  nameLang: {
    "en-US": "User",
    "te-IN": "వినియోగదారు",
  },
  href: "/user",
  icon: "User",
  permissions: {
    read: true,
    create: true,
    update: true,
    delete: true,
  },
}
```

---

> 💡 Tip: You can reuse this template by replacing `user` with your actual module name.

