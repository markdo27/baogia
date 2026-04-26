---
components_used: [avatar, badge, button, callout, composer, heading, icon, text]
---

# Timeline

Display a series of events or steps in a vertical or horizontal timeline.

```blade
<flux:timeline>
    <flux:timeline.item>
        <flux:timeline.indicator>
            <flux:icon.eye variant="micro" />
        </flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>curtisss <flux:text inline>requested a review from</flux:text> james_rob <flux:text inline>· 4 days ago</flux:text></flux:heading>
        </flux:timeline.content>
    </flux:timeline.item>

    <flux:timeline.item>
        <flux:timeline.indicator>
            <flux:icon.tag variant="micro" />
        </flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>curtisss <flux:text inline>added tag</flux:text> <flux:badge size="sm">feature</flux:badge></flux:heading>
        </flux:timeline.content>
    </flux:timeline.item>

    <flux:timeline.item>
        <flux:timeline.indicator color="green">
            <flux:icon.check variant="micro" />
        </flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>james_rob <flux:text inline>approved these changes · 3 days ago</flux:text></flux:heading>
        </flux:timeline.content>
    </flux:timeline.item>
</flux:timeline>
```

## Large
Use the size="lg" prop to make timeline indicators larger. This works well for numbered steps or when you want the indicators to be more prominent.

```blade
<flux:timeline size="lg">
    <flux:timeline.item>
        <flux:timeline.indicator>1</flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>Submit</flux:heading>
            <flux:text>Complete the form and provide all necessary assets.</flux:text>
        </flux:timeline.content>
    </flux:timeline.item>

    <!-- ... -->
</flux:timeline>
```

## Horizontal
Use the horizontal prop to render the timeline horizontally instead of vertically.

```blade
<flux:timeline horizontal>
    <flux:timeline.item>
        <flux:timeline.indicator>
            <flux:icon.credit-card variant="micro" />
        </flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>Order confirmed</flux:heading>
        </flux:timeline.content>
    </flux:timeline.item>

    <!-- ... -->
</flux:timeline>
```

## Status
Use the status prop on timeline items to visually indicate progress. Items can be complete, current, or incomplete. Status controls both the indicator styling and the connector lines between items.

```blade
<flux:timeline horizontal>
    <flux:timeline.item status="complete">
        <flux:timeline.indicator>
            <flux:icon.credit-card variant="micro" />
        </flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>Order confirmed</flux:heading>
        </flux:timeline.content>
    </flux:timeline.item>

    <flux:timeline.item status="current">
        <flux:timeline.indicator>
            <flux:icon.truck variant="micro" />
        </flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>On its way</flux:heading>
        </flux:timeline.content>
    </flux:timeline.item>

    <flux:timeline.item status="incomplete">
        <flux:timeline.indicator>
            <flux:icon.home variant="micro" />
        </flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>Delivered</flux:heading>
        </flux:timeline.content>
    </flux:timeline.item>
</flux:timeline>
```

## Indicator color
Use the color prop on flux:timeline.indicator to set a colored background. Supports all standard Flux colors.

```blade
<flux:timeline.indicator color="red">
    <flux:icon.x-mark variant="micro" />
</flux:timeline.indicator>

<flux:timeline.indicator color="amber">
    <flux:icon.exclamation-triangle variant="micro" />
</flux:timeline.indicator>

<flux:timeline.indicator color="green">
    <flux:icon.check variant="micro" />
</flux:timeline.indicator>
```

## Bare indicator
Use variant="bare" on an indicator to strip its default sizing and background, allowing you to use larger standalone icons as indicators.

```blade
<flux:timeline>
    <flux:timeline.item>
        <flux:timeline.indicator variant="bare">
            <flux:icon.document-text class="size-6 text-zinc-400" />
        </flux:timeline.indicator>

        <flux:timeline.content>
            <flux:heading>Draft created</flux:heading>
        </flux:timeline.content>
    </flux:timeline.item>

    <!-- ... -->
</flux:timeline>
```

## Block item
Use the flux:timeline.block component to display a single block element as a timeline item.

```blade
<flux:timeline>
    <!-- ... -->

    <flux:timeline.item>
        <flux:timeline.block>
            <flux:callout variant="secondary">
                <flux:callout.heading>james_rob<flux:text>replied to your message · 4 days ago</flux:text></flux:callout.heading>

                <x-slot name="actions">
                    <flux:button>View message -></flux:button>
                    <flux:button variant="ghost">Reply</flux:button>
                </x-slot>
            </flux:callout>
        </flux:timeline.block>
    </flux:timeline.item>

    <!-- ... -->
</flux:timeline>
```

## Block subgrid
When using flux:timeline.block, you can nest flux:timeline.subgrid components to maintain the timeline's column structure within the block.

This ensures content within the block stays properly aligned with the timeline's indicator column and content column, rather than spanning the full width. Perfect for comment threads, nested content, or multi-part block items.

```blade
<flux:timeline>
    <!-- ... -->

    <flux:timeline.item>
        <flux:timeline.block class="bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl overflow-hidden">
            <flux:timeline.subgrid class="p-3 bg-zinc-50 dark:bg-zinc-800">
                <flux:avatar size="xs" circle src="https://github.com/joshhanley.png" />

                <div class="space-y-1">
                    <flux:heading>james_rob <flux:text class="font-medium" inline>commented · 4 days ago</flux:text></flux:heading>

                    <flux:text class="text-zinc-800 dark:text-white">Contrast slider goes a bit wild at the top end...</flux:text>

                    <div class="mt-2">
                        <div class="size-6 rounded-full border border-zinc-200 dark:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700 text-zinc-300 dark:text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300 shadow-xs grid place-items-center">
                            <flux:icon.face-smile variant="micro" />
                        </div>
                    </div>
                </div>
            </flux:timeline.subgrid>

            <div class="border-t border-zinc-200 dark:border-zinc-700"></div>

            <flux:timeline.subgrid class="p-3 bg-white dark:bg-zinc-900">
                <flux:avatar size="xs" circle src="https://github.com/calebporzio.png" />

                <div>
                    <flux:composer variant="input" placeholder="Leave a reply..." label="Prompt" label:sr-only description="Enter your prompt here" description:sr-only>
                        <x-slot name="actionsLeading">
                            <flux:button size="sm" variant="subtle" icon="paper-clip" />
                            <flux:button size="sm" variant="subtle" icon="slash" />
                            <flux:button size="sm" variant="subtle" icon="adjustments-horizontal" />
                        </x-slot>

                        <x-slot name="actionsTrailing">
                            <flux:button size="sm" variant="filled" icon="microphone" />
                            <flux:button type="submit" size="sm" variant="primary" icon="paper-airplane" />
                        </x-slot>
                    </flux:composer>
                </div>
            </flux:timeline.subgrid>
        </flux:timeline.block>
    </flux:timeline.item>

    <!-- ... -->
</flux:timeline>
```

## Alignment
Use the align prop to align the timeline items.

Alignment can be applied to the entire timeline or to individual items.

```blade
<flux:timeline align="start|baseline|center|end">
    <!-- ... -->
</flux:timeline>
```

### Baseline adjustment
When using align="baseline" with large text sizes, you may need to adjust the baseline reference point to achieve proper alignment.

Target the \[data-flux-timeline-baseline\] attribute to set a custom font size that matches your content, ensuring the indicator aligns correctly with the first line of text.

```blade
<flux:timeline.item class="[&_[data-flux-timeline-baseline]]:text-2xl" align="baseline">
    <flux:timeline.indicator>2</flux:timeline.indicator>

    <flux:timeline.content>
        <flux:heading size="xl">With baseline adjustment</flux:heading>
    </flux:timeline.content>
</flux:timeline.item>
```

## Spacing
The \--flux-timeline-item-gap CSS variable controls the space between each timeline item, while \--flux-timeline-content-gap sets the spacing between the indicator and the content within an item.

Both of these variables affect timelines rendered in either vertical or horizontal layouts, allowing you to easily adjust spacing for any orientation.

```blade
<flux:timeline class="[--flux-timeline-item-gap:3rem] [--flux-timeline-content-gap:1rem]">
    <!-- ... -->
</flux:timeline>
```

## Reference

### flux:timeline
Container for a vertical or horizontal sequence of timeline items.

| Prop | Description |
| --- | --- |
| horizontal | Render the timeline horizontally instead of vertically. |
| align | Cross-axis alignment of indicators to content. Options: start, baseline, center (default), end. |
| size | Size of the timeline indicators. Options: lg. |

| Slot | Description |
| --- | --- |
| default | The timeline items. |

| Class | Description |
| --- | --- |
| --flux-timeline-item-gap | CSS variable controlling the space between each timeline item. |
| --flux-timeline-content-gap | CSS variable controlling the space between the indicator and the content within an item. |

### flux:timeline.item
An individual event in the timeline. Draws leading and trailing connector lines.

| Prop | Description |
| --- | --- |
| status | Controls indicator and connector line styling. Options: complete, current, incomplete. |
| align | Per-item alignment override. Options: start, baseline, center, end. |
| size | Per-item size override. Options: lg. |

| Slot | Description |
| --- | --- |
| default | The indicator and content components for this item. |

### flux:timeline.indicator
The dot or circle between connector lines. Can contain icons, numbers, or text.

| Prop | Description |
| --- | --- |
| variant | Visual variant of the indicator. Options: bare (strips default sizing and background). |
| status | Override the parent item's status for indicator styling. Options: complete, current, incomplete. |
| color | Colored background for the indicator. Options: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose. |

| Slot | Description |
| --- | --- |
| default | Content inside the indicator (icons, numbers, text). |

### flux:timeline.content
Content area displayed next to the indicator.

| Slot | Description |
| --- | --- |
| default | The content to display alongside the indicator. |

### flux:timeline.block
A full-width block item with no indicator column. Use for embedding cards, callouts, or other content that spans the full timeline width.

| Slot | Description |
| --- | --- |
| default | The block content to display. |

### flux:timeline.subgrid
Used inside flux:timeline.block to re-align content with the timeline's indicator and content columns.

| Slot | Description |
| --- | --- |
| default | The content to display within the subgrid layout. |