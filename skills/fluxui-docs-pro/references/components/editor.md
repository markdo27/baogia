---
components_used: [dropdown, editor, icon, menu, tooltip]
---

# Rich text editor

A basic rich text editor for your application. Built using [ProseMirror](https://prosemirror.net) and [Tiptap](https://tiptap.dev/).

Because of large external dependencies, the editor's JavaScript is not included in the core Flux bundle. It will be loaded on-the-fly as a separate JS file when you use the flux:editor component.

```blade
<flux:editor wire:model="content" label="…" description="…" />
```

## Toolbar
Flux's editor toolbar is both keyboard/screen-reader accessible and completely customizable to suit your application's needs.

## Configuring items

You can configure which toolbar items are visible, and in what order, by passing in a space-separated list of items to the toolbar prop.

```blade
<flux:editor toolbar="heading | bold italic underline | align ~ undo redo" />
```

You may have noticed the | and ~ characters in the toolbar configuration. These are shorthand for separator and spacer respectively.

The following toolbar items are available:

-   heading
-   bold
-   italic
-   strike
-   underline
-   bullet
-   ordered
-   blockquote
-   subscript
-   superscript
-   highlight
-   link
-   code
-   undo
-   redo

## Custom items

You can add your own toolbar items by adding new files to the resources/views/flux/editor directory in your project.

```
- resources
    - views
        - flux
            - editor
                - copy.blade.php
```

Here's an example of what a custom "Copy to clipboard" item in a blade file might look like:

```blade
<flux:tooltip content="{{ __('Copy to clipboard') }}" class="contents">
    <flux:editor.button x-on:click="navigator.clipboard?.writeText($el.closest('[data-flux-editor]').value); $el.setAttribute('data-copied', ''); setTimeout(() => $el.removeAttribute('data-copied'), 2000)">
        <flux:icon.clipboard variant="outline" class="[[data-copied]_&]:hidden size-5!" />
        <flux:icon.clipboard-document-check variant="outline" class="hidden [[data-copied]_&]:block size-5!" />
    </flux:editor.button>
</flux:tooltip>
```

Now you can reference your new component by name in any toolbar configuration like so:

```blade
<flux:editor toolbar="heading | […] | align ~ copy" />
```

## Customization

If you have deeper customization needs, you can compose your own editor component. Here's an example of putting a custom dropdown menu in an editor's toolbar:

```blade
<flux:editor>
    <flux:editor.toolbar>
        <flux:editor.heading />
        <flux:editor.separator />
        <flux:editor.bold />
        <flux:editor.italic />
        <flux:editor.strike />
        <flux:editor.separator />
        <flux:editor.bullet />
        <flux:editor.ordered />
        <flux:editor.blockquote />
        <flux:editor.separator />
        <flux:editor.link />
        <flux:editor.separator />
        <flux:editor.align />

        <flux:editor.spacer />

        <flux:dropdown position="bottom end" offset="-15">
            <flux:editor.button icon="ellipsis-horizontal" tooltip="More" />

            <flux:menu>
                <flux:menu.item wire:click="…" icon="arrow-top-right-on-square">Preview</flux:menu.item>
                <flux:menu.item wire:click="…" icon="arrow-down-tray">Export</flux:menu.item>
                <flux:menu.item wire:click="…" icon="share">Share</flux:menu.item>
            </flux:menu>
        </flux:dropdown>
    </flux:editor.toolbar>

    <flux:editor.content />
</flux:editor>
```

## Height
By default, the editor will have a minimum height of 200px, and a maximum height of 500px. If you want to customize this behavior, you can use Tailwind utilties to target the content slot and set your own min/max height and overflow behavior.

```blade
<flux:editor class="**:data-[slot=content]:min-h-[100px]!" />
```

The \[&\_\[data-slot=content\]\]: selector targets a child element with a data-slot="content" attribute.

This is an advanced Tailwind technique used to style a nested element inline without needing direct access to it.

## Shortcut keys
Flux's editor uses Tiptap's default shortcut keys which are common amongst most rich text editors.

| Operation | Windows/Linux | Mac |
| --- | --- | --- |
| Apply paragraph style | Ctrl+Alt+0 | Cmd+Alt+0 |
| Apply heading level 1 | Ctrl+Alt+1 | Cmd+Alt+1 |
| Apply heading level 2 | Ctrl+Alt+2 | Cmd+Alt+2 |
| Apply heading level 3 | Ctrl+Alt+3 | Cmd+Alt+3 |
| Bold | Ctrl+B | Cmd+B |
| Italic | Ctrl+I | Cmd+I |
| Underline | Ctrl+U | Cmd+U |
| Strikethrough | Ctrl+Shift+X | Cmd+Shift+X |
| Bullet list | Ctrl+Shift+8 | Cmd+Shift+8 |
| Ordered list | Ctrl+Shift+7 | Cmd+Shift+7 |
| Blockquote | Ctrl+Shift+B | Cmd+Shift+B |
| Code | Ctrl+E | Cmd+E |
| Highlight | Ctrl+Shift+H | Cmd+Shift+H |
| Align left | Ctrl+Shift+L | Cmd+Shift+L |
| Align center | Ctrl+Shift+E | Cmd+Shift+E |
| Align right | Ctrl+Shift+R | Cmd+Shift+R |
| Paste without formatting | Ctrl+Shift+V | Cmd+Shift+V |
| Add a line break | Ctrl+Shift+Enter | Cmd+Shift+Enter |
| Undo | Ctrl+Z | Cmd+Z |
| Redo | Ctrl+Shift+Z | Cmd+Shift+Z |

## Markdown syntax
Although Flux's editor isn't a markdown editor itself, it allows you to use markdown syntax to trigger styling changes while authoring your content.

| Markdown | Operation |
| --- | --- |
| # | Apply heading level 1 |
| ## | Apply heading level 2 |
| ### | Apply heading level 3 |
| ** | Bold |
| * | Italic |
| ~~ | Strikethrough |
| - | Bullet list |
| 1. | Ordered list |
| > | Blockquote |
| ` | Inline code |
| ``` | Code block |
| ```? | Code block (with class="language-?") |
| --- | Horizontal rule |

## Localization
If you need to localize the editor's aria-label or tooltip copy, you'll need to register the following translation keys in one of your app's lang files.

Here's an example of supporting Spanish localization:

```
// lang/es.json

{
    "Rich text editor": "Editor de texto enriquecido",
    "Formatting": "Formato",
    "Text": "Texto",
    "Heading 1": "Encabezado 1",
    "Heading 2": "Encabezado 2",
    "Heading 3": "Encabezado 3",
    "Styles": "Estilos",
    "Bold": "Negrita",
    "Italic": "Cursiva",
    "Underline": "Subrayado",
    "Strikethrough": "Tachado",
    "Subscript": "Subíndice",
    "Superscript": "Superíndice",
    "Highlight": "Resaltar",
    "Code": "Código",
    "Bullet list": "Lista con viñetas",
    "Ordered list": "Lista numerada",
    "Blockquote": "Cita",
    "Insert link": "Insertar enlace",
    "Unlink": "Quitar enlace",
    "Align": "Alinear",
    "Left": "Izquierda",
    "Center": "Centro",
    "Right": "Derecha",
    "Undo": "Deshacer",
    "Redo": "Rehacer"
}
```

## Extensions
Tiptap has a wide range of extensions that can be used to add custom functionality to the editor.

The following extensions are already installed:

-   Highlight
-   Link
-   Placeholder
-   StarterKit
-   Superscript
-   Subscript
-   TextAlign
-   Underline

But you can also add your own extensions, disable built-in extensions, or modify the behavior of the editor.

## Set up listener

To do this, you'll first need to create a listener for the flux:editor event in the <head> tag in your layout.

```
<head>
    ...
    <script type="module">
        document.addEventListener('flux:editor', (e) => {
            ...
        })
    </script>
</head>
```

Or you can add the listener to your app.js file.

```
...

document.addEventListener('flux:editor', (e) => {
    ...
})
```

## Registering extensions

Once you have the listener set up, you can add extensions by passing an array of extensions to the registerExtensions method supplied by the flux:editor event.

If an extension already exists, it will be replaced.

```
import Youtube from 'https://cdn.jsdelivr.net/npm/@tiptap/extension-youtube@2.11.7/+esm'

document.addEventListener('flux:editor', (e) => {
    e.detail.registerExtensions([
        Youtube.configure({
            controls: false,
            nocookie: true,
        }),
    ])
})
```

## Disabling extensions

If you need to disable an extension that comes with the editor, you can disable an extension by calling the disableExtension method supplied by the flux:editor event and passing through the name of the extension.

```
document.addEventListener('flux:editor', (e) => {
    e.detail.disableExtension('underline')
})
```

## Accessing the instance

Sometimes you may need to access the Tiptap instance directly to register event listeners or otherwise interact with with the instance.

You can do so by passing a callback to the init method supplied by the flux:editor event and accessing the editor instance from within the callback.

The init callback will be called when Tiptap's beforeCreate event is fired. You can find more details about Tiptap's events in the [Tiptap documentation](https://tiptap.dev/docs/editor/api/events).

```
document.addEventListener('flux:editor', (e) => {
    e.detail.init(({ editor }) => {
        editor.on('create', () => {})

        editor.on('update', () => {})

        editor.on('selectionUpdate', () => {})

        editor.on('transaction', () => {})

        editor.on('focus', () => {})

        editor.on('blur', () => {})

        editor.on('destroy', () => {})

        editor.on('drop', () => {})

        editor.on('paste', () => {})

        editor.on('contentError', () => {})
    })
})
```

## Reference

### flux:editor
| Prop | Description |
| --- | --- |
| wire:model | Binds the editor to a Livewire property. See the wire:model documentation for more information. |
| value | Initial content for the editor. Used when not binding with wire:model. |
| label | Label text displayed above the editor. When provided, wraps the editor in a flux:field component with an adjacent flux:label component. See the field component. |
| description | Help text displayed below the editor. When provided alongside label, appears between the label and editor within the flux:field wrapper. See the field component. |
| description:trailing | The description provided will be displayed below the editor instead of above it. |
| badge | Badge text displayed at the end of the flux:label component when the label prop is provided. |
| placeholder | Placeholder text displayed when the editor is empty. |
| toolbar | Space-separated list of toolbar items to display. Use \| for separator and ~ for spacer. By default, includes heading, bold, italic, strike, bullet, ordered, blockquote, link, and align tools. |
| disabled | Prevents user interaction with the editor. |
| invalid | Applies error styling to the editor. |

| Slot | Description |
| --- | --- |
| default | The editor content and toolbar components. If omitted, the standard toolbar and an empty content area will be used. |

| Attribute | Description |
| --- | --- |
| data-flux-editor | Applied to the root element for styling and identification. |

### flux:editor.toolbar
Container for editor toolbar items. Can be used for custom toolbar layouts.

| Prop | Description |
| --- | --- |
| items | Space-separated list of toolbar items to display. Use \| for separator and ~ for spacer. If not provided, displays the default toolbar. |

| Slot | Description |
| --- | --- |
| default | The toolbar items, separators, and spacers. Use this slot to create a completely custom toolbar. |

### flux:editor.button
| Prop | Description |
| --- | --- |
| icon | Name of the icon to display in the button. |
| iconVariant | The variant of the icon to display. Options: mini, micro, outline. Default: mini (without slot) or micro (with slot). |
| tooltip | Text to display in a tooltip when hovering over the button. |
| disabled | Prevents interaction with the button. |

| Slot | Description |
| --- | --- |
| default | Content to display inside the button. If provided alongside an icon, the icon will be displayed before this content. |

### flux:editor.content
Container for the editor's editable content. Typically used when creating a custom editor layout.

| Slot | Description |
| --- | --- |
| default | The initial HTML content for the editor. This content will be processed and managed by the editor. |

### Toolbar Items
Available toolbar items that can be referenced in the \`toolbar\` prop or used directly in a custom toolbar.

| Component | Description |
| --- | --- |
| heading | Heading level selector. |
| bold | Bold text formatting. |
| italic | Italic text formatting. |
| strike | Strikethrough text formatting. |
| underline | Underline text formatting. |
| bullet | Bulleted list. |
| ordered | Numbered list. |
| blockquote | Block quote formatting. |
| code | Code block formatting. |
| link | Link insertion. |
| align | Text alignment options. |
| undo | Undo last action. |
| redo | Redo last action. |