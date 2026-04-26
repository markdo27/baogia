---
components_used: [card, heading, table, text]
---

# Skeleton

Create placeholder content while loading data.

```blade
<flux:skeleton.group animate="shimmer" class="flex items-center gap-4">
    <flux:skeleton class="size-10 rounded-full" />

    <div class="flex-1">
        <flux:skeleton.line />
        <flux:skeleton.line class="w-1/2" />
    </div>
</flux:skeleton.group>
```

## Line of text
Create a loading state for a single line of text. The flux:skeleton.line component occupies the full spatial line-height (e.g., ~20px) while rendering a slimmer bar, giving it the visual proportions of real text.

```blade
<flux:skeleton.group animate="shimmer">
    <flux:skeleton.line class="mb-2 w-1/4" />
    <flux:skeleton.line />
    <flux:skeleton.line />
    <flux:skeleton.line class="w-3/4" />
</flux:skeleton.group>
```

## Animation
Use the animate prop to add an animation to the skeleton.

```blade
<flux:skeleton />
<flux:skeleton animate="shimmer" />
<flux:skeleton animate="pulse" />
```

## Examples
Here are some examples of different ways you can use the skeleton component.

### Table
Use the skeleton component to create a loading state for a table.

```blade
<flux:skeleton.group animate="shimmer">
    <flux:table>
        <flux:table.columns>
            <flux:table.column>Customer</flux:table.column>
            <flux:table.column>Date</flux:table.column>
            <flux:table.column>Status</flux:table.column>
            <flux:table.column>Amount</flux:table.column>
        </flux:table.columns>

        <flux:table.rows>
            @foreach (range(1, 5) as $order)
                <flux:table.row>
                    <flux:table.cell>
                        <div class="flex items-center gap-2">
                            <flux:skeleton class="rounded-full size-5" />

                            <div class="flex-1">
                                <flux:skeleton.line style="width: {{ rand(50, 100) }}%" />
                            </div>
                        </div>
                    </flux:table.cell>

                    <flux:table.cell>
                        <flux:skeleton.line />
                    </flux:table.cell>

                    <flux:table.cell>
                        <flux:skeleton.line />
                    </flux:table.cell>

                    <flux:table.cell>
                        <flux:skeleton.line />
                    </flux:table.cell>
                </flux:table.row>
            @endforeach
        </flux:table.rows>
    </flux:table>
</flux:skeleton.group>
```

### Chart
Use the skeleton component to create a loading state for a chart.

```blade
<flux:card class="dark:bg-zinc-800">
    <div class="flex flex-col gap-6">
        <div class="flex gap-12">
            <div>
                <flux:text>Today</flux:text>

                <flux:heading size="xl" class="mt-2 tabular-nums">$---</flux:heading>

                <flux:text class="mt-2 tabular-nums">-:-- PM</flux:text>
            </div>

            <div>
                <flux:text>Yesterday</flux:text>

                <flux:heading size="lg" class="mt-2 tabular-nums">$---</flux:heading>
            </div>
        </div>

        <flux:skeleton animate="shimmer" class="aspect-[4/1] size-full rounded-lg" />
    </div>
</flux:card>
```

## Reference

### flux:skeleton
| Prop | Description |
| --- | --- |
| animate | Animation style for the skeleton. Options: shimmer, pulse. Defaults to no animation. |

| Slot | Description |
| --- | --- |
| default | The skeleton elements (lines, boxes, circles). |

| CSS Variable | Description |
| --- | --- |
| --flux-shimmer-color | The background color used for the shimmer animation. Defaults to white in light mode and var(--color-zinc-900) in dark mode. Set this to match your page's background color to prevent the shimmer from showing through gaps between skeleton elements. |

| Attribute | Description |
| --- | --- |
| data-flux-skeleton | Applied to the root element for styling and identification. |

### flux:skeleton.line
| Prop | Description |
| --- | --- |
| size | Size of the line. Options: base, lg. Defaults to base. |
| animate | Animation style for the skeleton. Options: shimmer, pulse. Defaults to no animation. Can be inherited from parent flux:skeleton.group. |

| Attribute | Description |
| --- | --- |
| data-flux-skeleton-line | Applied to the root element for styling and identification. |

### flux:skeleton.group
| Prop | Description |
| --- | --- |
| animate | Animation style for all skeleton elements within the group. Options: shimmer, pulse. Defaults to no animation. This value is inherited by child flux:skeleton and flux:skeleton.line components. |

| Attribute | Description |
| --- | --- |
| data-flux-skeleton-group | Applied to the root element for styling and identification. |