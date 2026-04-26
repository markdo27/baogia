---
components_used: [avatar, badge, button, checkbox, dropdown, heading, icon, link, radio, separator, text, textarea]
---

# Popover

Show extra content in a popup on click or hover.

This component is for generic popover content. Use it only if the [Dropdown menu](/components/dropdown) component doesn't fit your needs.

```blade
<flux:dropdown>
    <flux:button
        icon="adjustments-horizontal"
        icon:variant="micro"
        icon:class="text-zinc-400"
        icon-trailing="chevron-down"
        icon-trailing:variant="micro"
        icon-trailing:class="text-zinc-400"
    >
        Options
    </flux:button>

    <flux:popover class="flex flex-col gap-4">
        <flux:radio.group wire:model="sort" label="Sort by" label:class="text-zinc-500 dark:text-zinc-400">
            <flux:radio value="active" label="Recently active" />
            <flux:radio value="posted" label="Date posted" checked />
        </flux:radio.group>

        <flux:separator variant="subtle" />

        <flux:radio.group wire:model="view" label="View as" label:class="text-zinc-500 dark:text-zinc-400">
            <flux:radio value="list" label="List" checked />
            <flux:radio value="gallery" label="Gallery" />
        </flux:radio.group>

        <flux:separator variant="subtle" />

        <flux:button variant="subtle" size="sm" class="justify-start -m-2 px-2!">Reset to default</flux:button>
    </flux:popover>
</flux:dropdown>
```

## Hover trigger
Use the hover prop on the dropdown to show the popover when hovering over the trigger element.

Currently, you can only use the button element as the trigger element.

```blade
<flux:dropdown hover position="bottom" align="start" offset="-16" gap="10">
    <button type="button" class="flex items-center gap-3">
        <flux:avatar size="sm" name="Caleb Porzio" src="https://unavatar.io/x/calebporzio" />

        <flux:heading>Caleb Porzio</flux:heading>
    </button>

    <flux:popover class="flex flex-col gap-3 rounded-xl shadow-xl">
        <flux:avatar size="xl" name="Caleb Porzio" src="https://unavatar.io/x/calebporzio" />

        <div>
            <flux:heading size="lg">Caleb Porzio</flux:heading>

            <div class="flex items-center gap-2">
                <flux:text size="lg">@calebporzio</flux:text>
                <flux:badge>Follows you</flux:badge>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <flux:text class="flex gap-1"><flux:heading>775</flux:heading> following</flux:text>
            <flux:text class="flex gap-1"><flux:heading>50.2k</flux:heading> followers</flux:text>
        </div>

        <div class="flex gap-2">
            <flux:button variant="outline" size="sm" icon="check" icon:class="opacity-75" class="flex-1">Following</flux:button>
            <flux:button variant="primary" size="sm" icon="chat-bubble-left-right" icon:class="opacity-75" class="flex-1">Message</flux:button>
        </div>
    </flux:popover>
</flux:dropdown>
```

[Log in to view](/login)

## Position
Control the position of your popover using the position and align props on the dropdown component.

```blade
<flux:dropdown position="top" align="start">
    <flux:button>...</flux:button>

    <flux:popover>...</flux:popover>
</flux:dropdown>

<flux:dropdown position="right" align="center">
    <flux:button>...</flux:button>

    <flux:popover>...</flux:popover>
</flux:dropdown>

<flux:dropdown position="left" align="center">
    <flux:button>...</flux:button>

    <flux:popover>...</flux:popover>
</flux:dropdown>

<flux:dropdown position="bottom" align="end">
    <flux:button>...</flux:button>

    <flux:popover>...</flux:popover>
</flux:dropdown>
```

[Log in to view](/login)

## Gap & offset
The gap prop controls the distance between the trigger and popover, while offset shifts the popover along its alignment axis.

```blade
<!-- Gap -->
<flux:dropdown gap="16">
    <flux:button>Gap: 16px</flux:button>

    <flux:popover>...</flux:popover>
</flux:dropdown>

<!-- Offset -->
<flux:dropdown offset="32">
    <flux:button>Offset: 32px</flux:button>

    <flux:popover>...</flux:popover>
</flux:dropdown>
```

[Log in to view](/login)

## Examples

### Category picker
A list of selectable categories.

```blade
<flux:dropdown>
    <flux:button
        icon="tag"
        icon:variant="micro"
        icon:class="text-zinc-400"
    >
        Categories

        <x-slot name="iconTrailing">
            <flux:badge size="sm" class="-mr-1">
                <span x-text="$wire.categories.length" class="tabular-nums">&nbsp;</span>
            </flux:badge>
        </x-slot>
    </flux:button>

    <flux:popover class="max-w-[18rem] flex flex-col gap-4">
        <flux:checkbox.group variant="pills" wire:model="categories">
            <flux:checkbox value="fantasy" label="Fantasy" />
            <flux:checkbox value="science-fiction" label="Science fiction" />
            <flux:checkbox value="horror" label="Horror" />
            <flux:checkbox value="mystery" label="Mystery" />
            <flux:checkbox value="romance" label="Romance" />
            <flux:checkbox value="autobiography" label="Autobiography" />
            <flux:checkbox value="thriller" label="Thriller" />
            <flux:checkbox value="poetry" label="Poetry" />
            <flux:checkbox value="children" label="Children" />
        </flux:checkbox.group>

        <flux:separator variant="subtle" />

        <flux:button
            variant="subtle"
            size="sm"
            class="justify-start -m-2 !px-2"
            wire:click="$set('categories', [])"
        >
            Clear all
        </flux:button>
    </flux:popover>
</flux:dropdown>
```

### Feedback
A feedback form with radio options and a text input.

```blade
<flux:dropdown>
    <flux:button icon="chat-bubble-oval-left" icon:variant="micro" icon:class="text-zinc-300">
        Feedback
    </flux:button>

    <flux:popover class="min-w-[30rem] flex flex-col gap-4">
        <flux:radio.group variant="buttons" class="*:flex-1">
            <flux:radio icon="bug-ant" checked>Bug report</flux:radio>
            <flux:radio icon="light-bulb">Suggestion</flux:radio>
            <flux:radio icon="question-mark-circle">Question</flux:radio>
        </flux:radio.group>

        <div class="relative">
            <flux:textarea
                rows="8"
                class="dark:bg-transparent!"
                placeholder="Please include reproduction steps. You may attach images or video files."
            />

            <div class="absolute bottom-3 left-3 flex items-center gap-2">
                <flux:button variant="filled" size="xs" icon="face-smile" icon:variant="outline" icon:class="text-zinc-400 dark:text-zinc-300" />
                <flux:button variant="filled" size="xs" icon="paper-clip" icon:class="text-zinc-400 dark:text-zinc-300" />
            </div>
        </div>

        <div class="flex gap-2 justify-end">
            <flux:button variant="filled" size="sm" kbd="esc" class="w-28">Cancel</flux:button>
            <flux:button size="sm" kbd="⏎" class="w-28">Submit</flux:button>
        </div>
    </flux:popover>
</flux:dropdown>
```

### Event details
Detailed information about an event.

```blade
<flux:dropdown position="bottom center">
    <button type="button" class="w-54 rounded-lg p-2 flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200">
        <div class="self-stretch w-0.5 bg-zinc-800 rounded-full"></div>

        <div>
            <flux:heading>Team sync</flux:heading>

            <flux:text class="mt-1">10:00 AM</flux:text>
        </div>
    </button>

    <flux:popover class="w-80 p-0 data-open:flex flex-col">
        <div class="p-4">
            <flux:heading>Team sync</flux:heading>

            <flux:text class="mt-2">Let's review the progress made last week and define the priorities for the next</flux:text>

            <flux:radio.group variant="segmented" class="mt-3">
                <flux:radio value="going" label="Going" checked />
                <flux:radio value="not-going" label="Not going" />
                <flux:radio value="maybe" label="Maybe" />
            </flux:radio.group>
        </div>

        <flux:separator />

        <div class="p-4 flex gap-2">
            <flux:icon.users variant="micro" class="text-zinc-400" />

            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <div class="flex gap-2">
                        <flux:heading>Guests</flux:heading>
                    </div>

                    <flux:text><flux:link href="#" variant="subtle">Invite</flux:link></flux:text>
                </div>

                <div class="flex items-center gap-3 mt-2">
                    <flux:avatar.group>
                        <flux:avatar size="xs" circle src="https://unavatar.io/x/calebporzio" />

                        <flux:avatar size="xs" circle src="https://unavatar.io/github/hugosaintemarie" />

                        <flux:avatar size="xs" circle src="https://unavatar.io/github/joshhanley" />
                    </flux:avatar.group>

                    <flux:text>1 maybe, 1 awaiting</flux:text>
                </div>
            </div>
        </div>

        <flux:separator />

        <div class="p-4 flex gap-2">
            <flux:icon.clock variant="micro" class="text-zinc-400" />

            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <div class="flex gap-2">
                        <flux:heading>10:00 AM</flux:heading>

                        <flux:icon.arrow-right variant="micro" class="text-zinc-400" />

                        <flux:heading>11:00 AM</flux:heading>
                    </div>

                    <flux:text><flux:link href="#" variant="subtle">Edit</flux:link></flux:text>
                </div>

                <div class="flex gap-3 mt-2">
                    <flux:text>May 29 2025</flux:text>

                    <flux:text>·</flux:text>

                    <flux:text class="flex items-center gap-1.5">
                        <flux:icon.arrow-path-rounded-square variant="micro" class="text-zinc-400" />
                        Every weekday
                    </flux:text>
                </div>
            </div>
        </div>

        <flux:separator />

        <div class="p-4 flex gap-2">
            <flux:icon.map-pin variant="micro" class="text-zinc-400" />

            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <flux:heading>Location</flux:heading>

                    <flux:text><flux:link href="#" variant="subtle">Edit</flux:link></flux:text>
                </div>

                <flux:text class="mt-2">Paris HQ, 13 rue de la Prairie 75018</flux:text>
            </div>
        </div>
    </flux:popover>
</flux:dropdown>
```

## Reference

### flux:dropdown
The container component that manages popover positioning and interaction. Required wrapper for all popovers.

| Prop | Description |
| --- | --- |
| position | Position of the popover relative to the trigger element. Options: top, right, bottom (default), left. |
| align | Alignment of the popover relative to the trigger element. Options: start (default), center, end. |
| hover | If present, the popover opens on hover instead of click. Useful for tooltips and quick previews. |
| wire:model | Bind the open/closed state to a Livewire property for programmatic control. |

| Slot | Description |
| --- | --- |
| default | Must contain exactly one trigger element (button, link, etc.) followed by one flux:popover component. |

| Attribute | Description |
| --- | --- |
| data-flux-dropdown | Applied to the root element for styling and identification. |
| data-open | Applied when the popover is currently open. |

### flux:popover
A container component that displays content in a floating overlay. Must be used within a flux:dropdown component for positioning and interaction.

| Prop | Description |
| --- | --- |
| class | Additional CSS classes to apply to the popover container. Useful for setting width constraints like max-w-sm or w-80. |

| Slot | Description |
| --- | --- |
| default | The content to display inside the popover. Can include any HTML or Flux components. |

| Attribute | Description |
| --- | --- |
| data-flux-popover | Applied to the root element for styling and identification. |