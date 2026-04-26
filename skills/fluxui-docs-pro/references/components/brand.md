---
components_used: [header, icon, navbar, profile, spacer]
---

# Brand

Display your company or application's logo and name in a clean, consistent way across your interface.

```blade
<flux:brand href="#" logo="/img/demo/logo.png" name="Acme Inc." />

<flux:brand href="#" name="Acme Inc.">
    <x-slot name="logo">
        <div class="size-6 rounded shrink-0 bg-accent text-accent-foreground flex items-center justify-center"><i class="font-serif font-bold">A</i></div>
    </x-slot>
</flux:brand>
```

## Logo slot
Use the logo slot to provide a custom logo for your brand.

```blade
<flux:brand href="#" name="Launchpad">
    <x-slot name="logo" class="size-6 rounded-full bg-cyan-500 text-white text-xs font-bold">
        <flux:icon name="rocket-launch" variant="micro" />
    </x-slot>
</flux:brand>
```

## Logo only
Display just the logo without the company name by omitting the name prop.

```blade
<flux:brand href="#" logo="/img/demo/logo.png" />
```

## Examples

### Header with brand
```blade
<flux:header class="px-4! w-full bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-white/5">
    <flux:brand href="#" name="Acme Inc.">
        <x-slot name="logo" class="bg-accent text-accent-foreground">
            <i class="font-serif font-bold">A</i>
        </x-slot>
    </flux:brand>

    <flux:navbar variant="outline">
        <flux:navbar.item href="#" current>Home</flux:navbar.item>
        <flux:navbar.item badge="12" href="#">Inbox</flux:navbar.item>
    </flux:navbar>

    <flux:spacer class="min-w-24" />

    <flux:profile circle :chevron="false" avatar="https://unavatar.io/x/calebporzio" />
</flux:header>
```

## Reference

### flux:brand
| Prop | Description |
| --- | --- |
| name | Company or application name to display next to the logo. |
| logo | URL to the image to display as logo, or can pass content via slot. |
| alt | Alternative text for the logo. |
| href | URL to navigate to when the brand is clicked. Default: '/'. |

| Slot | Description |
| --- | --- |
| logo | Custom content for the logo section, typically containing an image, SVG, or custom HTML. |