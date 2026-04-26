---
components_used: [heading, link]
---

# Text

Consistent typographical components like text and link.

```blade
<flux:heading>Text component</flux:heading>
<flux:text class="mt-2">This is the standard text component for body copy and general content throughout your application.</flux:text>
```

## Size
Use standard Tailwind to control the size of the text so that you can more easily adapt to different screen sizes.

```blade
<flux:text class="text-base">Base text size</flux:text>
<flux:text>Default text size</flux:text>
<flux:text class="text-xs">Smaller text</flux:text>
```

## Color
Use the variant and color props to adjust the text color based on its importance and context.

```blade
<flux:text variant="strong">Strong text color</flux:text>
<flux:text>Default text color</flux:text>
<flux:text variant="subtle">Subtle text color</flux:text>
<flux:text color="blue">Colored text</flux:text>
```

## Link
Use the link component to create clickable text that navigates to other pages or resources.

```blade
<flux:text>Visit our <flux:link href="#">documentation</flux:link> for more information.</flux:text>
```

## Link variants
Links can be styled differently based on their context and importance.

```blade
<flux:link href="#">Default link</flux:link>
<flux:link href="#" variant="ghost">Ghost link</flux:link>
<flux:link href="#" variant="subtle">Subtle link</flux:link>
```

## Link as button
Use the as="button" prop to render the link as a button.

```blade
<flux:link as="button" wire:click="...">Create new account →</flux:link>
```

## Reference

### flux:text
| Prop | Description |
| --- | --- |
| size | Size of the text. Options: sm, default, lg, xl. Default: default. |
| variant | Text variant. Options: strong, subtle. Default: default. |
| color | Color of the text. Options: default, red, orange, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose. Default: default. |
| inline | If true, the text element will be a span instead of a p. |

### flux:link
| Prop | Description |
| --- | --- |
| href | The URL that the link points to. Required. |
| variant | Link style variant. Options: default, ghost, subtle. Default: default. |
| external | If true, the link will open in a new tab. |
| as | The HTML tag to render the link as. Options: a (default), button. |