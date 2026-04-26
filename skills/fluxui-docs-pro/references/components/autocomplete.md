# Autocomplete

Enhance an input field with autocomplete suggestions.

Autocomplete suggests text as you type and inserts the selected suggestion directly into the input field. It does not support a value attribute.

If you need to show a label but store a value (e.g., showing a user's name but storing their ID), use a [combobox](/components/select#combobox) instead.

```blade
<flux:autocomplete wire:model="state" label="State of residence">
    <flux:autocomplete.item>Alabama</flux:autocomplete.item>
    <flux:autocomplete.item>Arkansas</flux:autocomplete.item>
    <flux:autocomplete.item>California</flux:autocomplete.item>
    <!-- ... -->
</flux:autocomplete>
```

## Reference

### flux:autocomplete
| Prop | Description |
| --- | --- |
| wire:model | The name of the Livewire property to bind the input value to. |
| type | HTML input type (e.g., text, email, password, file, date). Default: text. |
| label | Label text displayed above the input. |
| description | Descriptive text displayed below the label. |
| placeholder | Placeholder text displayed when the input is empty. |
| size | Size of the input. Options: sm, xs. |
| variant | Visual style variant. Options: filled. Default: outline. |
| disabled | If true, prevents user interaction with the input. |
| readonly | If true, makes the input read-only. |
| invalid | If true, applies error styling to the input. |
| multiple | For file inputs, allows selecting multiple files. |
| mask | Input mask pattern using Alpine's mask plugin. Example: 99/99/9999. |
| icon | Name of the icon displayed at the start of the input. |
| icon:trailing | Name of the icon displayed at the end of the input. |
| kbd | Keyboard shortcut hint displayed at the end of the input. |
| clearable | If true, displays a clear button when the input has content. |
| copyable | If true, displays a copy button to copy the input's content. |
| viewable | For password inputs, if true, displays a toggle to show/hide the password. |
| as | Render the input as a different element. Options: button. Default: input. |
| container:class | Additional CSS classes applied to the autocomplete container. Useful for setting height constraints like max-h-80. |
| input:class | CSS classes applied directly to the input element instead of the input wrapper. |

| Slot | Description |
| --- | --- |
| icon | Custom content displayed at the start of the input (e.g., icons). |
| icon:leading | Custom content displayed at the start of the input (e.g., icons). |
| icon:trailing | Custom content displayed at the end of the input (e.g., buttons). |

### flux:autocomplete.item
| Prop | Description |
| --- | --- |
| disabled | If present or true, the item cannot be selected. |