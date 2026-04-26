---
components_used: [heading, input]
---

# Button

A powerful and composable button component for your application.

```blade
<flux:button>Button</flux:button>
```

## Variants
Use the variant prop to change the visual style of the button.

Use primary buttons sparingly; mostly for form submissions.

```blade
<flux:button>Default</flux:button>
<flux:button variant="primary">Primary</flux:button>
<flux:button variant="filled">Filled</flux:button>
<flux:button variant="danger">Danger</flux:button>
<flux:button variant="ghost">Ghost</flux:button>
<flux:button variant="subtle">Subtle</flux:button>
```

## Colors
Use standard Tailwind color names with the color prop to control the color of the primary button.

```blade
<flux:button variant="primary" color="zinc">Zinc</flux:button>
<flux:button variant="primary" color="red">Red</flux:button>
<flux:button variant="primary" color="orange">Orange</flux:button>
<flux:button variant="primary" color="amber">Amber</flux:button>
<flux:button variant="primary" color="yellow">Yellow</flux:button>
<flux:button variant="primary" color="lime">Lime</flux:button>
<flux:button variant="primary" color="green">Green</flux:button>
<flux:button variant="primary" color="emerald">Emerald</flux:button>
<flux:button variant="primary" color="teal">Teal</flux:button>
<flux:button variant="primary" color="cyan">Cyan</flux:button>
<flux:button variant="primary" color="sky">Sky</flux:button>
<flux:button variant="primary" color="blue">Blue</flux:button>
<flux:button variant="primary" color="indigo">Indigo</flux:button>
<flux:button variant="primary" color="violet">Violet</flux:button>
<flux:button variant="primary" color="purple">Purple</flux:button>
<flux:button variant="primary" color="fuchsia">Fuchsia</flux:button>
<flux:button variant="primary" color="pink">Pink</flux:button>
<flux:button variant="primary" color="rose">Rose</flux:button>
```

## Sizes
The default button size works great for most cases, but here are some additional size options for unique situations.

```blade
<flux:button>Base</flux:button>
<flux:button size="sm">Small</flux:button>
<flux:button size="xs">Extra small</flux:button>
```

## Icons
Automatically sized and styled icons for your buttons.

```blade
<flux:button icon="ellipsis-horizontal" />
<flux:button icon="arrow-down-tray">Export</flux:button>
<flux:button icon:trailing="chevron-down">Open</flux:button>
<flux:button icon="x-mark" variant="subtle" />
```

## Loading
Buttons with wire:click or type="submit" will automatically show a loading indicator and disable pointer events during network requests.

```blade
<flux:button wire:click="save">
    Save changes
</flux:button>
```

You can disable this behavior using :loading="false".

```blade
<flux:button wire:click="save" :loading="false">
```

## Full width
A button that spans the full width of the container.

```blade
<flux:button variant="primary" class="w-full">Send invite</flux:button>
```

## Button groups
Fuse related buttons into a group with shared borders.

```blade
<flux:button.group>
    <flux:button>Oldest</flux:button>
    <flux:button>Newest</flux:button>
    <flux:button>Top</flux:button>
</flux:button.group>
```

## Icon group
Fuse multiple icon buttons into a visually-linked group.

```blade
<flux:button.group>
    <flux:button icon="bars-3-bottom-left"></flux:button>
    <flux:button icon="bars-3"></flux:button>
    <flux:button icon="bars-3-bottom-right"></flux:button>
</flux:button.group>
```

## Attached button
Append or prepend an icon button to another button to add additional functionality.

```blade
<flux:button.group>
    <flux:button>New product</flux:button>
    <flux:button icon="chevron-down"></flux:button>
</flux:button.group>
```

## As a link
Display an HTML a tag as a button by passing the href prop.

```blade
<flux:button
    href="https://google.com"
    icon:trailing="arrow-up-right"
>
    Visit Google
</flux:button>
```

## As an input
To display a button as an input, pass as="button" to the [input component](/components/input).

```blade
<flux:input as="button" placeholder="Search..." icon="magnifying-glass" kbd="⌘K" />
```

## Square
Make the height and width of a button equal. Flux does this automatically for icon-only buttons.

```blade
<flux:button square>...</flux:button>
```

## Inset
When using ghost or subtle button variants, you can use the inset prop to negate any invisible padding for better alignment.

```blade
<div class="flex justify-between">
    <flux:heading>Post successfully created.</flux:heading>

    <flux:button size="sm" icon="x-mark" variant="ghost" inset />
</div>
```

## Reference

### flux:button
| Prop | Description |
| --- | --- |
| as | The HTML tag to render the button as. Options: button (default), a, div. |
| href | The URL to link to when the button is used as an anchor tag. |
| type | The HTML type attribute of the button. Options: button (default), submit. |
| variant | Visual style of the button. Options: outline, primary, filled, danger, ghost, subtle. Default: outline. |
| size | Size of the button. Options: base (default), sm, xs. |
| icon | Name of the icon to display at the start of the button. |
| icon:variant | Visual style of the icon. Options: outline, solid, mini, micro. Default: micro. |
| icon:trailing | Name of the icon to display at the end of the button. |
| square | If true, makes the button square. (Useful for icon-only buttons.) |
| align | Alignment of the button content. Options: start, center, end. Default: center. |
| inset | Add negative margins to specific sides. Options: top, bottom, left, right, or any combination of the four. |
| loading | If true, shows a loading spinner and disables the button when used with wire:click or type="submit". If false, the button will not show a loading spinner at all. Default: true. |
| tooltip | Text to display in a tooltip when hovering over the button. |
| tooltip:position | Position of the tooltip. Options: top, bottom, left, right. Default: top. |
| tooltip:kbd | Text to display in a keyboard shortcut tooltip when hovering over the button. |
| kbd | Text to display in a keyboard shortcut tooltip when hovering over the button. |

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the button. Common use: w-full for full width. |

| Attribute | Description |
| --- | --- |
| data-flux-button | Applied to the root element for styling and identification. |

### flux:button.group
A container component that groups multiple buttons together with shared borders.

| Slot | Description |
| --- | --- |
| default | The buttons to be grouped together. |