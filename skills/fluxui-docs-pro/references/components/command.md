---
components_used: [command, input, modal]
---

# Command palette

A searchable list of commands.

```blade
<flux:command>
    <flux:command.input placeholder="Search..." />

    <flux:command.items>
        <flux:command.item wire:click="..." icon="user-plus" kbd="⌘A">Assign to…</flux:command.item>
        <flux:command.item wire:click="..." icon="document-plus">Create new file</flux:command.item>
        <flux:command.item wire:click="..." icon="folder-plus" kbd="⌘⇧N">Create new project</flux:command.item>
        <flux:command.item wire:click="..." icon="book-open">Documentation</flux:command.item>
        <flux:command.item wire:click="..." icon="newspaper">Changelog</flux:command.item>
        <flux:command.item wire:click="..." icon="cog-6-tooth" kbd="⌘,">Settings</flux:command.item>
    </flux:command.items>
</flux:command>
```

## As a modal
Open a command palette as a modal for quick access to frequently used commands.

```blade
<flux:modal.trigger name="search" shortcut="cmd.k">
    <flux:input as="button" placeholder="Search..." icon="magnifying-glass" kbd="⌘K" />
</flux:modal.trigger>

<flux:modal name="search" variant="bare" class="w-full max-w-[30rem] my-[12vh] max-h-screen overflow-y-hidden">
    <flux:command class="border-none shadow-lg inline-flex flex-col max-h-[76vh]">
        <flux:command.input placeholder="Search..." closable />

        <flux:command.items>
            <flux:command.item icon="user-plus" kbd="⌘A">Assign to…</flux:command.item>
            <flux:command.item icon="document-plus">Create new file</flux:command.item>
            <flux:command.item icon="folder-plus" kbd="⌘⇧N">Create new project</flux:command.item>
            <flux:command.item icon="book-open">Documentation</flux:command.item>
            <flux:command.item icon="newspaper">Changelog</flux:command.item>
            <flux:command.item icon="cog-6-tooth" kbd="⌘,">Settings</flux:command.item>
        </flux:command.items>
    </flux:command>
</flux:modal>
```

## Reference

### flux:command
The root command palette component that wraps the input and items.

| Attribute | Description |
| --- | --- |
| data-flux-command | Applied to the root element for styling and identification. |

### flux:command.input
| Prop | Description |
| --- | --- |
| clearable | If true, displays a clear button when the input has content. |
| closable | If true, displays a close button to dismiss the command palette. |
| icon | Name of the icon displayed at the start of the input. Default: magnifying-glass. |
| placeholder | Placeholder text displayed when the input is empty. |

### flux:command.items
Container for command items. No props available.

### flux:command.item
| Prop | Description |
| --- | --- |
| icon | Name of the icon displayed at the start of the item. |
| icon:variant | Visual style of the icon. Options: outline (default), solid, mini, micro. |
| kbd | Keyboard shortcut hint displayed at the end of the item (e.g., ⌘K). |

| Attribute | Description |
| --- | --- |
| data-flux-command-item | Applied to the item element for styling and identification. |