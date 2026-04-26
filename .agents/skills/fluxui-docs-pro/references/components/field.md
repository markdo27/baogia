---
components_used: [description, error, fieldset, input, label, legend, select]
---

# Field

Encapsulate input elements with labels, descriptions, and validation.

Explore the [input component \->](/components/input)

```blade
<flux:field>
    <flux:label>Email</flux:label>

    <flux:input wire:model="email" type="email" />

    <flux:error name="email" />
</flux:field>
```

## Shorthand props
Because using the field component in its full form can be verbose and repetitive, all form controls in flux allow you pass a label and a description parameter directly. Under the hood, they will be wrapped in a field with an error component automatically.

```blade
<flux:input wire:model="email" label="Email" type="email" />
```

## With trailing description
Position the field description directly below the input.

```blade
<flux:field>
    <flux:label>Password</flux:label>

    <flux:input type="password" />

    <flux:error name="password" />

    <flux:description>Must be at least 8 characters long, include an uppercase letter, a number, and a special character.</flux:description>
</flux:field>

<!-- Alternative shorthand syntax... -->

<flux:input
    type="password"
    label="Password"
    description:trailing="Must be at least 8 characters long, include an uppercase letter, a number, and a special character."
/>
```

## With badge
Badges allow you to enhance a field with additional information such as being "required" or "optional" when it might not be expected.

```blade
<flux:field>
    <flux:label badge="Required">Email</flux:label>

    <flux:input type="email" required />

    <flux:error name="email" />
</flux:field>

<flux:field>
    <flux:label badge="Optional">Phone number</flux:label>

    <flux:input type="phone" placeholder="(555) 555-5555" mask="(999) 999-9999"  />

    <flux:error name="phone" />
</flux:field>
```

## Split layout
Display multiple fields horizontally in the same row.

```blade
<div class="grid grid-cols-2 gap-4">
    <flux:input label="First name" placeholder="River" />

    <flux:input label="Last name" placeholder="Porzio" />
</div>
```

## Fieldset
Group related fields using the fieldset and legend component.

```blade
<flux:fieldset>
    <flux:legend>Shipping address</flux:legend>

    <div class="space-y-6">
        <flux:input label="Street address line 1" placeholder="123 Main St" class="max-w-sm" />
        <flux:input label="Street address line 2" placeholder="Apartment, studio, or floor" class="max-w-sm" />

        <div class="grid grid-cols-2 gap-x-4 gap-y-6">
            <flux:input label="City" placeholder="San Francisco" />
            <flux:input label="State / Province" placeholder="CA" />
            <flux:input label="Postal / Zip code" placeholder="12345" />
            <flux:select label="Country">
                <option selected>United States</option>
                <!-- ... -->
            </flux:select>
        </div>
    </div>
</flux:fieldset>
```

## Reference

### flux:field
A container component that provides structure for form inputs with labels, descriptions, and error messages.

| Prop | Description |
| --- | --- |
| variant | Visual style variant. Options: block, inline. Default: block. |

| Slot | Description |
| --- | --- |
| default | The form control elements (input, select, etc.) and their associated labels, descriptions, and error messages. |

| Attribute | Description |
| --- | --- |
| data-flux-field | Applied to the root element for styling and identification. |

### flux:label
| Prop | Description |
| --- | --- |
| badge | Optional text to display as a badge (e.g., "Required", "Optional"). |

| Slot | Description |
| --- | --- |
| default | The label text content. |
| trailing | Optional text to display at the end of the label. |

### flux:description
| Slot | Description |
| --- | --- |
| default | The descriptive text content. |

### flux:error
| Prop | Description |
| --- | --- |
| name | The name of the field to display validation errors for. |
| message | Custom error message content (optional). |
| bag | The error bag to get the error from. Default: default. |
| deep | Whether to look for validation errors in nested array fields (e.g., fields.*). If false, only shows errors for the exact field name specified. Default: true. |
| icon | The icon to display inline with the error message. Default: exclamation-triangle. Set to false to hide the icon. |

| Slot | Description |
| --- | --- |
| default | Custom error message content (optional). |

### flux:fieldset
| Prop | Description |
| --- | --- |
| legend | The fieldset's heading text. |
| description | Optional description text for the fieldset. |

| Slot | Description |
| --- | --- |
| default | The grouped form fields and their associated legend. |

### flux:legend
| Slot | Description |
| --- | --- |
| default | The fieldset's heading text. |