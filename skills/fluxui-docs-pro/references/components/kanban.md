---
components_used: [avatar, badge, button, dropdown, heading, icon, menu]
---

# Kanban

A collection of cards arranged in columns, representing different stages of a workflow.

```blade
<flux:kanban>
    @foreach ($this->columns as $column)
        <flux:kanban.column>
            <flux:kanban.column.header :heading="$column->title" :count="count($column->cards)" />

            <flux:kanban.column.cards>
                @foreach ($column->cards as $card)
                    <flux:kanban.card :heading="$card->title" />
                @endforeach
            </flux:kanban.column.cards>
        </flux:kanban.column>
    @endforeach
</flux:kanban>
```

## Column actions
Add actions to the column header.

```blade
<flux:kanban.column>
    <flux:kanban.column.header :heading="$column->title" :count="count($column->cards)">
        <x-slot name="actions">
            <flux:dropdown>
                <flux:button variant="subtle" icon="ellipsis-horizontal" size="sm" />

                <flux:menu>
                    <flux:menu.item icon="plus">New card</flux:menu.item>
                    <flux:menu.item icon="archive-box">Archive column</flux:menu.item>

                    <flux:menu.separator />

                    <flux:menu.item variant="danger" icon="trash">Delete</flux:menu.item>
                </flux:menu>
            </flux:dropdown>

            <flux:button variant="subtle" icon="plus" size="sm" />
        </x-slot>
    </flux:kanban.column.header>

    <flux:kanban.column.cards>
        <!-- ... -->
    </flux:kanban.column.cards>
</flux:kanban.column>
```

## Column subheading
Add a subheading to the column header using the subheading prop.

```blade
<flux:kanban.column>
    <flux:kanban.column.header heading="Blacklog" subheading="Ideas and suggestions" />

    <flux:kanban.column.cards>
        <!-- ... -->
    </flux:kanban.column.cards>
</flux:kanban.column>
```

## Column footer
Add a footer to the column using the flux:kanban.column.footer component to display additional information or actions like a "New card" button.

```blade
<flux:kanban.column>
    <flux:kanban.column.header :heading="$column['title']" count="5" />

    <flux:kanban.column.cards>
        <!-- ... -->
    </flux:kanban.column.cards>

    <flux:kanban.column.footer>
        <form>
            <flux:kanban.card>
                <div class="flex items-center gap-1">
                    <flux:heading class="flex-1">
                        <input class="w-full outline-none" placeholder="New card...">
                    </flux:heading>

                    <flux:button type="submit" variant="filled" size="sm" inset="top bottom" class="-me-1.5">Add</flux:button>
                </div>
            </flux:kanban.card>
        </form>

        <flux:button variant="subtle" icon="plus" size="sm" align="start">
            New card
        </flux:button>
    </flux:kanban.column.footer>
</flux:kanban.column>
```

## Card as button
Make a card clickable by passing the as="button" prop to the flux:kanban.card component.

Now you can use the wire:click or x-on:click directives to handle the click event.

```blade
<flux:kanban.card as="button" wire:click="edit" heading="Update privacy policy in app" />
```

## Card header
Add a header to the card using the <x-slot name="header"> slot to display additional information or actions.

```blade
<flux:kanban.card as="button" heading="Update privacy policy in app">
    <x-slot name="header">
        <div class="flex gap-2">
            <flux:badge color="blue" size="sm">UI</flux:badge>
            <flux:badge color="green" size="sm">Backend</flux:badge>
            <flux:badge color="red" size="sm">Bug</flux:badge>
        </div>
    </x-slot>
</flux:kanban.card>
```

## Card footer
Add a footer to the card using the <x-slot name="footer"> slot to display additional information or actions.

```blade
<flux:kanban.card as="button" heading="Update privacy policy in app">
    <x-slot name="footer">
        <flux:icon name="bars-3-bottom-left" variant="micro" class="text-zinc-400" />

        <flux:avatar.group>
            <flux:avatar circle size="xs" src="https://unavatar.io/x/calebporzio" />
            <flux:avatar circle size="xs" src="https://unavatar.io/github/hugosaintemarie" />
            <flux:avatar circle size="xs" src="https://unavatar.io/github/joshhanley" />
            <flux:avatar circle size="xs">3+</flux:avatar>
        </flux:avatar.group>
    </x-slot>
</flux:kanban.card>
```

## Reference

### flux:kanban
| Slot | Description |
| --- | --- |
| default | Place multiple flux:kanban.column components here to create columns in the kanban board. |

### flux:kanban.column
| Slot | Description |
| --- | --- |
| default | Should contain a flux:kanban.column.header, a flux:kanban.column.cards, and optionally a flux:kanban.column.footer component. |

### flux:kanban.column.header
| Prop | Description |
| --- | --- |
| heading | The title text to display in the column header. |
| subheading | Optional secondary text to display below the column header. |
| count | Optional number to display next to the heading, typically showing the number of cards in the column. |
| badge | Optional badge text or content to display next to the heading. Supports badge:* attributes for customization. |

| Slot | Description |
| --- | --- |
| default | Custom content to display in the header. Will override the heading and count props if provided. |
| actions | Optional slot for action buttons or dropdowns that appear on the right side of the column header. |

### flux:kanban.column.cards
| Slot | Description |
| --- | --- |
| default | Place multiple flux:kanban.card components here to populate the column with cards. |

### flux:kanban.column.footer
| Slot | Description |
| --- | --- |
| default | Custom content to display at the bottom of the column, commonly used for "Add card" buttons or forms. |

### flux:kanban.card
| Prop | Description |
| --- | --- |
| heading | The title text to display in the card. |
| as | Element to render the card as. Options: button, div (default). When set to button, the card becomes clickable. |

| Slot | Description |
| --- | --- |
| default | Custom content to display in the card body. Will override the heading prop if provided. |
| header | Optional content to display above the card heading, commonly used for badges or tags. |
| footer | Optional content to display below the card heading, commonly used for icons, avatars, or metadata. |