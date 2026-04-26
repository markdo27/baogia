---
components_used: [dropdown, navlist, navmenu]
---

# Navbar

Arrange navigation links vertically or horizontally.

Discover more about the navbar on the [layout documentation \->](/layouts/sidebar)

```blade
<flux:navbar>
    <flux:navbar.item href="#">Home</flux:navbar.item>
    <flux:navbar.item href="#">Features</flux:navbar.item>
    <flux:navbar.item href="#">Pricing</flux:navbar.item>
    <flux:navbar.item href="#">About</flux:navbar.item>
</flux:navbar>
```

## Detecting the current page
Navbars and navlists will try to automatically detect and mark the current page based on the href attribute passed in. However, if you need full control, you can pass the current prop to the item directly.

```blade
<flux:navbar.item href="/" current>Home</flux:navbar.item>
<flux:navbar.item href="/" :current="false">Home</flux:navbar.item>
<flux:navbar.item href="/" :current="request()->is('/')">Home</flux:navbar.item>
```

## With icons
Add a leading icons for visual context.

```blade
<flux:navbar>
    <flux:navbar.item href="#" icon="home">Home</flux:navbar.item>
    <flux:navbar.item href="#" icon="puzzle-piece">Features</flux:navbar.item>
    <flux:navbar.item href="#" icon="currency-dollar">Pricing</flux:navbar.item>
    <flux:navbar.item href="#" icon="user">About</flux:navbar.item>
</flux:navbar>
```

## With badges
Add a trailing badge to a navbar item using the badge prop.

```blade
<flux:navbar>
    <flux:navbar.item href="#">Home</flux:navbar.item>
    <flux:navbar.item href="#" badge="12">Inbox</flux:navbar.item>
    <flux:navbar.item href="#">Contacts</flux:navbar.item>
    <flux:navbar.item href="#" badge="Pro" badge:color="lime">Calendar</flux:navbar.item>
</flux:navbar>
```

## Dropdown navigation
Condense multiple navigation items into a single dropdown menu to save on space and group related items.

```blade
<flux:navbar>
    <flux:navbar.item href="#">Dashboard</flux:navbar.item>
    <flux:navbar.item href="#">Transactions</flux:navbar.item>

    <flux:dropdown>
        <flux:navbar.item icon:trailing="chevron-down">Account</flux:navbar.item>

        <flux:navmenu>
            <flux:navmenu.item href="#">Profile</flux:navmenu.item>
            <flux:navmenu.item href="#">Settings</flux:navmenu.item>
            <flux:navmenu.item href="#">Billing</flux:navmenu.item>
        </flux:navmenu>
    </flux:dropdown>
</flux:navbar>
```

## Navlist (sidebar)
Arrange your navbar vertically using the navlist component.

```blade
<flux:navlist class="w-64">
    <flux:navlist.item href="#" icon="home">Home</flux:navlist.item>
    <flux:navlist.item href="#" icon="puzzle-piece">Features</flux:navlist.item>
    <flux:navlist.item href="#" icon="currency-dollar">Pricing</flux:navlist.item>
    <flux:navlist.item href="#" icon="user">About</flux:navlist.item>
</flux:navlist>
```

## Navlist group
Group related navigation items.

```blade
<flux:navlist>
    <flux:navlist.group heading="Account" class="mt-4">
        <flux:navlist.item href="#">Profile</flux:navlist.item>
        <flux:navlist.item href="#">Settings</flux:navlist.item>
        <flux:navlist.item href="#">Billing</flux:navlist.item>
    </flux:navlist.group>
</flux:navlist>
```

## Collapsible groups
Group related navigation items into collapsible sections using the expandable prop.

```blade
<flux:navlist class="w-64">
    <flux:navlist.item href="#" icon="home">Dashboard</flux:navlist.item>
    <flux:navlist.item href="#" icon="list-bullet">Transactions</flux:navlist.item>

    <flux:navlist.group heading="Account" expandable>
        <flux:navlist.item href="#">Profile</flux:navlist.item>
        <flux:navlist.item href="#">Settings</flux:navlist.item>
        <flux:navlist.item href="#">Billing</flux:navlist.item>
    </flux:navlist.group>
</flux:navlist>
```

If you want a group to be collapsed by default, you can use the expanded prop:

```blade
<flux:navlist.group heading="Account" expandable :expanded="false">
```

## Navlist badges
Show additional information related to a navlist item using the badge prop.

```blade
<flux:navlist class="w-64">
    <flux:navlist.item href="#" icon="home">Home</flux:navlist.item>
    <flux:navlist.item href="#" icon="envelope" badge="12">Inbox</flux:navlist.item>
    <flux:navlist.item href="#" icon="user-group">Contacts</flux:navlist.item>
    <flux:navlist.item href="#" icon="calendar-days" badge="Pro" badge:color="lime">Calendar</flux:navlist.item>
</flux:navlist>
```

## Reference

### flux:navbar
A horizontal navigation container.

| Slot | Description |
| --- | --- |
| default | The navigation items. |

| Attribute | Description |
| --- | --- |
| data-flux-navbar | Applied to the root element for styling and identification. |

### flux:navbar.item
| Prop | Description |
| --- | --- |
| href | URL the item links to. |
| current | If true, applies active styling to the item. Auto-detected based on current URL if not specified. |
| icon | Name of the icon to display at the start of the item. |
| icon:trailing | Name of the icon to display at the end of the item. |
| badge | Content to display as a badge. Can be a string, boolean, or a slot. |
| badge:color | Color of the badge. Options: same color options as the color prop on the badge component. |
| badge:variant | Variant of the badge. Options: solid, outline. Default: solid. |

| Attribute | Description |
| --- | --- |
| data-current | Applied when the item is active/current. |

### flux:navlist
A vertical navigation container (sidebar).

| Slot | Description |
| --- | --- |
| default | The navigation items and groups. |

| Attribute | Description |
| --- | --- |
| data-flux-navlist | Applied to the root element for styling and identification. |

### flux:navlist.item
| Prop | Description |
| --- | --- |
| href | URL the item links to. |
| current | If true, applies active styling to the item. Auto-detected based on current URL if not specified. |
| icon | Name of the icon to display at the start of the item. |
| badge | Content to display as a badge. Can be a string, boolean, or a slot. |
| badge:color | Color of the badge. Options: same color options as the color prop on the badge component. |
| badge:variant | Variant of the badge. Options: solid, outline. Default: solid. |

| Attribute | Description |
| --- | --- |
| data-current | Applied when the item is active/current. |

### flux:navlist.group
| Prop | Description |
| --- | --- |
| heading | Text displayed as the group heading. |
| expandable | If true, makes the group collapsible. |
| expanded | If true, expands the group by default when expandable. |

| Slot | Description |
| --- | --- |
| default | The group's navigation items. |

### Profile switcher