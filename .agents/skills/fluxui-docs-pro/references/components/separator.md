# Separator

Visually divide sections of content or groups of items.

```blade
<flux:separator />
```

## With text
Add text to the separator for a more descriptive element.

```blade
<flux:separator text="or" />
```

## Vertical
Seperate contents with a vertical seperator when horizontally stacked.

```blade
<flux:separator vertical />
```

## Limited height
You can limit the height of the vertical separator by adding vertical margin.

```blade
<flux:separator vertical class="my-2" />
```

## Subtle
Flux offers a subtle variant for a separator that blends into the background.

```blade
<flux:separator vertical variant="subtle" />
```

## Reference

### flux:separator
| Prop | Description |
| --- | --- |
| vertical | Displays a vertical separator. Default is horizontal. |
| variant | Visual style variant. Options: subtle. Default: standard separator. |
| text | Optional text to display in the center of the separator. |
| orientation | Alternative to vertical prop. Options: horizontal, vertical. Default: horizontal. |

| Class | Description |
| --- | --- |
| my-* | Commonly used to shorten vertical separators. |

| Attribute | Description |
| --- | --- |
| data-flux-separator | Applied to the root element for styling and identification. |