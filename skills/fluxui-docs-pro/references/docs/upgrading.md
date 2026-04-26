# Upgrade guide

Follow this guide to upgrade from Flux v1.x to v2.x.

## Prerequisites

Before upgrading to Flux v2, make sure you have the following:

-   Laravel version 10 or later
-   Livewire version 3.5.19 or later
-   Tailwind CSS version 4 or later

Flux v2 is built on top of Tailwind CSS v4, so if you are using an older version of Tailwind CSS, you need to upgrade it to v4 or later by following the [Tailwind CSS upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

## Update Flux

Run the following composer command to upgrade your application's Flux and Flux Pro dependencies to v2:

```
composer require livewire/flux:^2.0 livewire/flux-pro:^2.0
```

## Rename @fluxStyles

In Flux v2, the @fluxStyles directive has been removed as these styles are now imported directly into your app.css file.

However, the @fluxAppearance directive has been added as a replacement to manage dark mode in your application—it controls the .dark class on the <html> element.

```
<head>
    ...
--    @fluxStyles
++    @fluxAppearance
</head>
```

## Clear the view cache

Run the following Artisan command from your application's root directory to clear any cached/compiled Blade views:

```
php artisan view:clear
```

## Tailwind Config

Because Flux's styles are no longer added via the @fluxStyles directive, you will need to import the Flux CSS file directly into your ./resources/css/app.css file like so:

```
@import "tailwindcss";
@import '../../vendor/livewire/flux/dist/flux.css';

/* Required for dark mode in Flux... */
@custom-variant dark (&:where(.dark, .dark *));

...
```

## Migrating accent colors

If you had previously defined custom accent colors in your app.css and tailwind.config.js file, then you will need to update them in your app.css file.

Before, these were defined in a single @layer base block within your app.css file, but now they are defined as two separate blocks:

-   default colors are now inside the @theme block
-   dark mode colors are now inside the @layer theme block

Here's an example of defining sky as your application's accent color:

```
@theme {
    --color-accent: var(--color-sky-600);
    --color-accent-content: var(--color-sky-600);
    --color-accent-foreground: var(--color-white);
}

@layer theme {
    .dark {
        --color-accent: var(--color-sky-600);
        --color-accent-content: var(--color-sky-400);
        --color-accent-foreground: var(--color-white);
    }
}
```

If you're still using your old Tailwind config, you can now remove the following lines:

```
export default {
    ...

    theme: {
        extend: {
            colors: {
                ...

--             accent: {
--                  DEFAULT: 'var(--color-accent)',
--                  content: 'var(--color-accent-content)',
--                  foreground: 'var(--color-accent-foreground)',
--              },
            },
        },
    },
};
```

## Re-assigning gray

If you had previously re-assigned Flux's gray of choice in your tailwind.config.js file, then you will need to move this to your app.css file.

Here's an example of re-assigning zinc to neutral:

```
/* Re-assign Flux's gray of choice... */
@theme {
  --color-zinc-50: var(--color-neutral-50);
  --color-zinc-100: var(--color-neutral-100);
  --color-zinc-200: var(--color-neutral-200);
  --color-zinc-300: var(--color-neutral-300);
  --color-zinc-400: var(--color-neutral-400);
  --color-zinc-500: var(--color-neutral-500);
  --color-zinc-600: var(--color-neutral-600);
  --color-zinc-700: var(--color-neutral-700);
  --color-zinc-800: var(--color-neutral-800);
  --color-zinc-900: var(--color-neutral-900);
  --color-zinc-950: var(--color-neutral-950);
}
```

If you are continuing to use your tailwind.config.js file in your application, then you can remove the following:

```
-- import colors from 'tailwindcss/colors';

export default {
    ...

    theme: {
        extend: {
            colors: {
--              // Re-assign Flux's gray of choice...
--              zinc: colors.neutral,

                ...
            },
        },
    },
};
```

## Dark mode changes

If you had previously set darkMode: null in your tailwind.config.js file to prevent Flux from controlling the .dark class and handling dark mode automatically, you can now accomplish this by not including the @fluxAppearance directive in your layout file:

```
<head>
    ...
--    @fluxAppearance
</head>
```

## Rename components

In Flux v2, some components have been renamed. You will need to update your code accordingly:

| v1 | v2 |
| --- | --- |
| flux:options | flux:select.options |
| flux:option | flux:select.option |
| flux:cell | flux:table.cell |
| flux:columns | flux:table.columns |
| flux:column | flux:table.column |
| flux:rows | flux:table.rows |
| flux:row | flux:table.row |