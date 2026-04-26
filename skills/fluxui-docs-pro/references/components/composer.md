---
components_used: [button, editor, icon]
---

# Composer

A configurable message input with support for action buttons and rich text. Ideal for chat interfaces and AI prompts.

```blade
<form wire:submit="send">
    <flux:composer wire:model="prompt" label="Prompt" label:sr-only placeholder="How can I help you today?">
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
</form>
```

## With header
Display file previews or other content above the input area using the header slot.

```blade
<flux:composer wire:model="prompt" label="Prompt" label:sr-only placeholder="How can I help you today?">
    <x-slot name="header">
        <!-- Header content... -->
        <div class="relative border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
            <img src="https://fluxui.dev/img/demo/caleb.png" alt="Profile picture" class="size-14">

            <div class="absolute top-0 right-0 p-1">
                <button type="button" class="p-0.5 rounded-full bg-zinc-900/50 hover:bg-zinc-900/70 flex justify-center items-center">
                    <flux:icon icon="x-mark" variant="micro" class="text-white" />
                </button>
            </div>
        </div>
    </x-slot>

    <x-slot name="actionsLeading">
        <!-- ... -->
    </x-slot>

    <x-slot name="actionsTrailing">
        <!-- ... -->
    </x-slot>
</flux:composer>
```

## Inline
Place action buttons alongside the input in a single row for a more compact layout.

```blade
<flux:composer wire:model="prompt" rows="1" inline label="Prompt" label:sr-only placeholder="How can I help you today?">
    <x-slot name="actionsLeading">
        <flux:button size="sm" variant="ghost" icon="plus" />
    </x-slot>

    <x-slot name="actionsTrailing">
        <flux:button size="sm" variant="filled" icon="microphone" />
        <flux:button type="submit" size="sm" variant="primary" icon="paper-airplane" />
    </x-slot>
</flux:composer>
```

## Input variant
Use the variant="input" prop to render the composer with border radiuses that match other form inputs.

```blade
<flux:composer variant="input" label="Message" placeholder="What's on your mind?">
    <!-- ... -->
</flux:composer>
```

## Height
Set the initial and maximum height of the input area using rows and max-rows.

```blade
<flux:composer rows="4" max-rows="8" ...>
    <!-- ... -->
</flux:composer>
```

## Submit behavior
By default, the form submits when pressing <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd>. Set submit="enter" to submit on <kbd>Enter</kbd> alone.

```blade
<form wire:submit="send">
    <flux:composer wire:model="prompt" submit="enter" ...>
        <!-- ... -->
    </flux:composer>
</form>
```

## Rich text
Enable rich text formatting by passing an editor component to the input slot.

```blade
<flux:composer wire:model="prompt" rows="3" label="Prompt" label:sr-only placeholder="How can I help you today?">
    <x-slot name="input">
        <flux:editor variant="borderless" toolbar="bold italic bullet ordered | link | align" />
    </x-slot>

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
```

## Disabled
Prevent user interaction with the composer by adding the disabled attribute.

```blade
<flux:composer disabled ...>
    <!-- ... -->
</flux:composer>
```

## Invalid
When paired with a name or wire:model attribute alongside a label prop, validation errors will automatically apply invalid styling to the composer.

```blade
<flux:composer wire:model="prompt" label="Prompt" label:sr-only ...>
    <!-- ... -->
</flux:composer>
```

## Reference

### flux:composer
| Prop | Description |
| --- | --- |
| wire:model | Binds the composer to a Livewire property. See the wire:model documentation for more information. |
| name | Name attribute for the composer. Used for validation error detection. |
| placeholder | Placeholder text displayed when the input is empty. |
| label | Label text for the composer. When provided, wraps the composer in a flux:field component with an adjacent flux:label component. See the field component. |
| label:sr-only | Visually hides the label while keeping it accessible to screen readers. |
| description | Help text displayed near the composer. See the field component. |
| description:sr-only | Visually hides the description while keeping it accessible to screen readers. |
| rows | Number of visible text lines for the input area. Default: 2. |
| max-rows | Maximum number of rows the input can expand to as content grows. |
| inline | Displays action buttons alongside the input in a single row. |
| submit | Keyboard behavior for form submission. Options: cmd+enter (default), enter. |
| disabled | Prevents user interaction with the composer. |
| invalid | If true, applies error styling to the composer. |

| Slot | Description |
| --- | --- |
| input | Custom input content. Use this slot to replace the default textarea with a rich text editor. |
| header | Content displayed above the input area. Useful for file previews or uploads. |
| footer | Content displayed below the input area. |
| actionsLeading | Buttons or actions displayed at the start of the action bar. |
| actionsTrailing | Buttons or actions displayed at the end of the action bar, typically including the submit button. |

| Attribute | Description |
| --- | --- |
| data-flux-composer | Applied to the root element for styling and identification. |