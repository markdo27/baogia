---
components_used: [button, menu, navmenu, profile]
---

# Dropdown

A composable dropdown component that can handle both simple navigation menus as well as complex action menus with checkboxes, radios, and submenus.

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Options</flux:button>

    <flux:menu>
        <flux:menu.item icon="plus">New post</flux:menu.item>

        <flux:menu.separator />

        <flux:menu.submenu heading="Sort by">
            <flux:menu.radio.group>
                <flux:menu.radio checked>Name</flux:menu.radio>
                <flux:menu.radio>Date</flux:menu.radio>
                <flux:menu.radio>Popularity</flux:menu.radio>
            </flux:menu.radio.group>
        </flux:menu.submenu>

        <flux:menu.submenu heading="Filter">
            <flux:menu.checkbox checked>Draft</flux:menu.checkbox>
            <flux:menu.checkbox checked>Published</flux:menu.checkbox>
            <flux:menu.checkbox>Archived</flux:menu.checkbox>
        </flux:menu.submenu>

        <flux:menu.separator />

        <flux:menu.item variant="danger" icon="trash">Delete</flux:menu.item>
    </flux:menu>
</flux:dropdown>
```

## Navigation menus
Display a simple set of links in a dropdown menu.

Use the navmenu component for a simple collections of links. Otherwise, use the menu component for action menus that require keyboard navigation, submenus, etc.

```blade
<flux:dropdown position="bottom" align="end">
    <flux:profile avatar="/img/demo/user.png" name="Olivia Martin" />

    <flux:navmenu>
        <flux:navmenu.item href="#" icon="user">Account</flux:navmenu.item>
        <flux:navmenu.item href="#" icon="building-storefront">Profile</flux:navmenu.item>
        <flux:navmenu.item href="#" icon="credit-card">Billing</flux:navmenu.item>
        <flux:navmenu.item href="#" icon="arrow-right-start-on-rectangle">Logout</flux:navmenu.item>
        <flux:navmenu.item href="#" icon="trash" variant="danger">Delete</flux:navmenu.item>
    </flux:navmenu>
</flux:dropdown>
```

## Positioning
Customize the position of the dropdown menu via the position and align props. You can first pass the base position: top, bottom, left, and right, then an alignment modifier like start, center, or end.

```blade
<flux:dropdown position="top" align="start">

<!-- More positions... -->
<flux:dropdown position="right" align="center">
<flux:dropdown position="bottom" align="center">
<flux:dropdown position="left" align="end">
```

## Offset & gap
Customize the offset/gap of the dropdown menu via the offset and gap props. These properties accept values in pixels.

```blade
<flux:dropdown offset="-15" gap="2">
```

## Keyboard hints
Add keyboard shortcut hints to menu items to teach users how to navigate your app faster.

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Options</flux:button>

    <flux:menu>
        <flux:menu.item icon="pencil-square" kbd="⌘S">Save</flux:menu.item>
        <flux:menu.item icon="document-duplicate" kbd="⌘D">Duplicate</flux:menu.item>
        <flux:menu.item icon="trash" variant="danger" kbd="⌘⌫">Delete</flux:menu.item>
    </flux:menu>
</flux:dropdown>
```

## Checkbox items
Select one or many menu options.

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Permissions</flux:button>

    <flux:menu>
        <flux:menu.checkbox wire:model="read" checked>Read</flux:menu.checkbox>
        <flux:menu.checkbox wire:model="write" checked>Write</flux:menu.checkbox>
        <flux:menu.checkbox wire:model="delete">Delete</flux:menu.checkbox>
    </flux:menu>
</flux:dropdown>
```

## Radio items
Select a single menu option.

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Sort by</flux:button>

    <flux:menu>
        <flux:menu.radio.group wire:model="sortBy">
            <flux:menu.radio checked>Latest activity</flux:menu.radio>
            <flux:menu.radio>Date created</flux:menu.radio>
            <flux:menu.radio>Most popular</flux:menu.radio>
        </flux:menu.radio.group>
    </flux:menu>
</flux:dropdown>
```

## Groups
Visually group related menu items with a separator line.

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Options</flux:button>

    <flux:menu>
        <flux:menu.item>View</flux:menu.item>
        <flux:menu.item>Transfer</flux:menu.item>

        <flux:menu.separator />

        <flux:menu.item>Publish</flux:menu.item>
        <flux:menu.item>Share</flux:menu.item>

        <flux:menu.separator />

        <flux:menu.item variant="danger">Delete</flux:menu.item>
    </flux:menu>
</flux:dropdown>
```

## Groups with headings
Group options under headings to make them more discoverable.

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Options</flux:button>

    <flux:menu>
        <flux:menu.group heading="Account">
            <flux:menu.item>Profile</flux:menu.item>
            <flux:menu.item>Permissions</flux:menu.item>
        </flux:menu.group>

        <flux:menu.group heading="Billing">
            <flux:menu.item>Transactions</flux:menu.item>
            <flux:menu.item>Payouts</flux:menu.item>
            <flux:menu.item>Refunds</flux:menu.item>
        </flux:menu.group>

        <flux:menu.item>Logout</flux:menu.item>
    </flux:menu>
</flux:dropdown>
```

## Submenus
Nest submenus for more condensed menus.

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Options</flux:button>

    <flux:menu>
        <flux:menu.submenu heading="Sort by">
            <flux:menu.radio checked>Name</flux:menu.radio>
            <flux:menu.radio>Date</flux:menu.radio>
            <flux:menu.radio>Popularity</flux:menu.radio>
        </flux:menu.submenu>

        <flux:menu.submenu heading="Filter">
            <flux:menu.checkbox checked>Draft</flux:menu.checkbox>
            <flux:menu.checkbox checked>Published</flux:menu.checkbox>
            <flux:menu.checkbox>Archived</flux:menu.checkbox>
        </flux:menu.submenu>

        <flux:menu.separator />

        <flux:menu.item variant="danger">Delete</flux:menu.item>
    </flux:menu>
</flux:dropdown>
```

## Keep open
Menus typically close when an item is clicked, however, you can add the keep-open attribute to the menu component to keep it open.

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Filter</flux:button>

    <flux:menu keep-open>
        <flux:menu.checkbox checked>Draft</flux:menu.checkbox>
        <flux:menu.checkbox checked>Published</flux:menu.checkbox>
        <flux:menu.checkbox>Archived</flux:menu.checkbox>
    </flux:menu>
</flux:dropdown>
```

If you want the menu to only stay open when a specific item is clicked, you can add the keep-open attribute to the item instead. This works with:

-   menu.item
-   menu.checkbox
-   menu.radio
-   menu.radio.group
-   menu.submenu

```blade
<flux:dropdown>
    <flux:button icon:trailing="chevron-down">Filters</flux:button>

    <flux:menu >
        <flux:menu.checkbox keep-open checked>Draft</flux:menu.checkbox>
        <flux:menu.checkbox keep-open checked>Published</flux:menu.checkbox>
        <flux:menu.checkbox keep-open>Archived</flux:menu.checkbox>
        <flux:menu.separator />
        <flux:menu.item variant="danger">Clear</flux:menu.item>
    </flux:menu>
</flux:dropdown>
```

## Reference

### flux:dropdown
| Prop | Description |
| --- | --- |
| position | Position of the dropdown menu. Options: top, right, bottom (default), left. |
| align | Alignment of the dropdown menu. Options: start, center, end. Default: start. |
| offset | Offset in pixels from the trigger element. Default: 0. |
| gap | Gap in pixels between trigger and menu. Default: 4. |

| Attribute | Description |
| --- | --- |
| data-flux-dropdown | Applied to the root element for styling and identification. |

### flux:menu
A complex menu component that supports keyboard navigation, submenus, checkboxes, and radio buttons.

| Prop | Description |
| --- | --- |
| keep-open | Prevents the menu from closing when any item inside of it is clicked. |

| Slot | Description |
| --- | --- |
| default | The menu items, separators, and submenus. |

| Attribute | Description |
| --- | --- |
| data-flux-menu | Applied to the root element for styling and identification. |

### flux:menu.item
| Prop | Description |
| --- | --- |
| icon | Name of the icon to display at the start of the item. |
| icon:trailing | Name of the icon to display at the end of the item. |
| icon:variant | Variant of the icon. Options: outline, solid, mini, micro. |
| kbd | Keyboard shortcut hint displayed at the end of the item. |
| suffix | Text displayed at the end of the item. |
| variant | Visual style of the item. Options: default, danger. |
| disabled | If true, prevents interaction with the menu item. |
| keep-open | Prevents the menu from closing when this item is selected. |

| Attribute | Description |
| --- | --- |
| data-flux-menu-item | Applied to the root element for styling and identification. |
| data-active | Applied when the item is hovered/active. |

### flux:menu.submenu
| Prop | Description |
| --- | --- |
| heading | Text displayed as the submenu heading. |
| icon | Name of the icon to display at the start of the submenu. |
| icon:trailing | Name of the icon to display at the end of the submenu. |
| icon:variant | Variant of the icon. Options: outline, solid, mini, micro. |
| keep-open | Prevents the submenu from closing when any item inside of it is selected. |

| Slot | Description |
| --- | --- |
| default | The submenu items (checkboxes, radio buttons, etc.). |

### flux:menu.separator
A horizontal line that separates menu items.

### flux:menu.checkbox.group
| Prop | Description |
| --- | --- |
| wire:model | Binds the checkbox group to a Livewire property. See the wire:model documentation for more information. |

| Slot | Description |
| --- | --- |
| default | The checkboxes. |

### flux:menu.checkbox
| Prop | Description |
| --- | --- |
| wire:model | Binds the checkbox to a Livewire property. See the wire:model documentation for more information. |
| checked | If true, the checkbox is checked by default. |
| disabled | If true, prevents interaction with the checkbox. |
| keep-open | Prevents the menu from closing when this checkbox is selected. |

| Attribute | Description |
| --- | --- |
| data-active | Applied when the checkbox is hovered/active. |
| data-checked | Applied when the checkbox is checked. |

### flux:menu.radio.group
| Prop | Description |
| --- | --- |
| wire:model | Binds the radio group to a Livewire property. See the wire:model documentation for more information. |
| keep-open | Prevents the menu from closing when any radio button in this group is selected. |

| Slot | Description |
| --- | --- |
| default | The radio buttons. |

### flux:menu.radio
| Prop | Description |
| --- | --- |
| checked | If true, the radio button is selected by default. |
| disabled | If true, prevents interaction with the radio button. |
| keep-open | Prevents the menu from closing when this radio button is selected. |

| Attribute | Description |
| --- | --- |
| data-active | Applied when the radio button is hovered/active. |
| data-checked | Applied when the radio button is selected. |