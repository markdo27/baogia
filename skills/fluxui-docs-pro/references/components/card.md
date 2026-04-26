---
components_used: [button, error, field, heading, icon, input, label, link, spacer, text]
---

# Card

A container for related content, such as a form, alert, or data list.

```blade
<flux:card class="space-y-6">
    <div>
        <flux:heading size="lg">Log in to your account</flux:heading>
        <flux:text class="mt-2">Welcome back!</flux:text>
    </div>

    <div class="space-y-6">
        <flux:input label="Email" type="email" placeholder="Your email address" />

        <flux:field>
            <div class="mb-3 flex justify-between">
                <flux:label>Password</flux:label>

                <flux:link href="#" variant="subtle" class="text-sm">Forgot password?</flux:link>
            </div>

            <flux:input type="password" placeholder="Your password" />

            <flux:error name="password" />
        </flux:field>
    </div>

    <div class="space-y-2">
        <flux:button variant="primary" class="w-full">Log in</flux:button>

        <flux:button variant="ghost" class="w-full">Sign up for a new account</flux:button>
    </div>
</flux:card>
```

## Small card
Use the small card variant for compact content like notifications, alerts, or brief summaries.

```blade
<a href="#" aria-label="Latest on our blog">
    <flux:card size="sm" class="hover:bg-zinc-50 dark:hover:bg-zinc-700">
        <flux:heading class="flex items-center gap-2">Latest on our blog <flux:icon name="arrow-up-right" class="ml-auto text-zinc-400" variant="micro" /></flux:heading>
        <flux:text class="mt-2">Stay up to date with our latest insights, tutorials, and product updates.</flux:text>
    </flux:card>
</a>
```

## Header actions
Use the [button component](/components/button) to add actions to the header.

```blade
<flux:card class="space-y-6">
    <div class="flex">
        <div class="flex-1">
            <flux:heading size="lg">Are you sure?</flux:heading>

            <flux:text class="mt-2">
                Your post will be deleted permanently.<br>
                This action cannot be undone.
            </flux:text>
        </div>

        <div class="-mx-2 -mt-2">
            <flux:button variant="ghost" size="sm" icon="x-mark" inset="top right bottom" />
        </div>
    </div>

    <div class="flex gap-4">
        <flux:spacer />
        <flux:button variant="ghost">Undo</flux:button>
        <flux:button variant="danger">Delete</flux:button>
    </div>
</flux:card>
```

## Simple card
Let's be honest, a card is just a div with a border and some padding.

```blade
<flux:card>
    <flux:heading size="lg">Are you sure?</flux:heading>

    <flux:text class="mt-2 mb-4">
        Your post will be deleted permanently.<br>
        This action cannot be undone.
    </flux:text>

    <flux:button variant="danger">Delete</flux:button>
</flux:card>
```

## Reference

### flux:card
| Slot | Description |
| --- | --- |
| default | Content to display within the card. Can include headings, text, forms, buttons, and other components. |

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the card. Common uses: space-y-6 for spacing between child elements, max-w-md for width control, p-0 to remove padding. |

| Attribute | Description |
| --- | --- |
| data-flux-card | Applied to the root element for styling and identification. |