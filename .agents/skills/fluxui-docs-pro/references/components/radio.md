---
components_used: [fieldset, heading, legend, text]
---

# Radio

Select one option from a set of mutually exclusive choices. Perfect for single-choice questions and settings.

```blade
<flux:radio.group wire:model="payment" label="Select your payment method">
    <flux:radio value="cc" label="Credit Card" checked />
    <flux:radio value="paypal" label="Paypal" />
    <flux:radio value="ach" label="Bank transfer" />
</flux:radio.group>
```

## With descriptions
Align descriptions for each radio directly below its label.

```blade
<flux:radio.group label="Role">
    <flux:radio
        name="role"
        value="administrator"
        label="Administrator"
        description="Administrator users can perform any action."
        checked
    />
    <flux:radio
        name="role"
        value="editor"
        label="Editor"
        description="Editor users have the ability to read, create, and update."
    />
    <flux:radio
        name="role"
        value="viewer"
        label="Viewer"
        description="Viewer users only have the ability to read. Create, and update are restricted."
    />
</flux:radio.group>
```

## Within fieldset
Group radio inputs inside a fieldset and provide more context with descriptions for each radio option.

```blade
<flux:fieldset>
    <flux:legend>Role</flux:legend>

    <flux:radio.group>
        <flux:radio
            value="administrator"
            label="Administrator"
            description="Administrator users can perform any action."
            checked
        />
        <flux:radio
            value="editor"
            label="Editor"
            description="Editor users have the ability to read, create, and update."
        />
        <flux:radio
            value="viewer"
            label="Viewer"
            description="Viewer users only have the ability to read. Create, and update are restricted."
        />
    </flux:radio.group>
</flux:fieldset>
```

## Segmented
A more compact alternative to standard radio buttons.

```blade
<flux:radio.group wire:model="role" label="Role" variant="segmented">
    <flux:radio label="Admin" />
    <flux:radio label="Editor" />
    <flux:radio label="Viewer" />
</flux:radio.group>
```

You can also use the size="sm" prop to make the radios smaller.

```blade
<flux:radio.group wire:model="role" label="Role" variant="segmented" size="sm">
    <flux:radio label="Admin" />
    <flux:radio label="Editor" />
    <flux:radio label="Viewer" />
</flux:radio.group>
```

## Segmented with icons
Combine segmented radio buttons with icon prefixes.

```blade
<flux:radio.group wire:model="role" variant="segmented">
    <flux:radio label="Admin" icon="wrench" />
    <flux:radio label="Editor" icon="pencil-square" />
    <flux:radio label="Viewer" icon="eye" />
</flux:radio.group>
```

## Radio cards
A bordered alternative to standard radio buttons.

```blade
<flux:radio.group wire:model="shipping" label="Shipping" variant="cards" class="max-sm:flex-col">
    <flux:radio value="standard" label="Standard" description="4-10 business days" checked />
    <flux:radio value="fast" label="Fast" description="2-5 business days" />
    <flux:radio value="next-day" label="Next day" description="1 business day" />
</flux:radio.group>
```

You can swap between vertical and horizontal card layouts by conditionally applying flex-col based on the viewport.

```blade
<flux:radio.group ... class="max-sm:flex-col">
    <!-- ... -->
</flux:radio.group>
```

## Vertical cards
You can arrange a set of radio cards vertically by simply adding the flex-col class to the group container.

```blade
<flux:radio.group label="Shipping" variant="cards" class="flex-col">
    <flux:radio value="standard" label="Standard" description="4-10 business days" />
    <flux:radio value="fast" label="Fast" description="2-5 business days" />
    <flux:radio value="next-day" label="Next day" description="1 business day" />
</flux:radio.group>
```

## Cards with icons
You can arrange a set of radio cards vertically by simply adding the flex-col class to the group container.

```blade
<flux:radio.group label="Shipping" variant="cards" class="max-sm:flex-col">
    <flux:radio value="standard" icon="truck" label="Standard" description="4-10 business days" />
    <flux:radio value="fast" icon="cube" label="Fast" description="2-5 business days" />
    <flux:radio value="next-day" icon="clock" label="Next day" description="1 business day" />
</flux:radio.group>
```

## Cards without indicators
For a cleaner look, you can remove the radio indicator using :indicator="false".

```blade
<flux:radio.group label="Shipping" variant="cards" :indicator="false" class="max-sm:flex-col">
    <flux:radio value="standard" icon="truck" label="Standard" description="4-10 business days" />
    <flux:radio value="fast" icon="cube" label="Fast" description="2-5 business days" />
    <flux:radio value="next-day" icon="clock" label="Next day" description="1 business day" />
</flux:radio.group>
```

## Custom card content
You can compose your own custom cards through the flux:radio component slot.

```blade
<flux:radio.group label="Shipping" variant="cards" class="max-sm:flex-col">
    <flux:radio value="standard" checked>
        <flux:radio.indicator />

        <div class="flex-1">
            <flux:heading class="leading-4">Standard</flux:heading>
            <flux:text size="sm" class="mt-2">4-10 business days</flux:text>
        </div>
    </flux:radio>

    <flux:radio value="fast">
        <flux:radio.indicator />

        <div class="flex-1">
            <flux:heading class="leading-4">Fast</flux:heading>
            <flux:text size="sm" class="mt-2">2-5 business days</flux:text>
        </div>
    </flux:radio>

    <flux:radio value="next-day">
        <flux:radio.indicator />

        <div class="flex-1">
            <flux:heading class="leading-4">Next day</flux:heading>
            <flux:text size="sm" class="mt-2">1 business day</flux:text>
        </div>
    </flux:radio>
</flux:radio.group>
```

## Pills
Compact, rounded radio buttons that look like tags or badges. Perfect for filters, categories, and any time you want lightweight selectable options.

```blade
<flux:radio.group wire:model="priority" label="Priority" variant="pills">
    <flux:radio value="low" label="Low" />
    <flux:radio value="medium" label="Medium" />
    <flux:radio value="high" label="High" />
    <flux:radio value="critical" label="Critical" />
</flux:radio.group>
```

## Buttons
Button-style radio options that look like a toolbar. Perfect for action selections and grouped controls where you want a more prominent visual style.

```blade
<flux:radio.group variant="buttons" class="w-full *:flex-1" label="Feedback type">
    <flux:radio icon="bug-ant" checked>Bug report</flux:radio>
    <flux:radio icon="light-bulb">Suggestion</flux:radio>
    <flux:radio icon="question-mark-circle">Question</flux:radio>
</flux:radio.group>
```

## Reference

### flux:radio.group
| Prop | Description |
| --- | --- |
| wire:model | Binds the radio group selection to a Livewire property. See the wire:model documentation for more information. |
| label | Label text displayed above the radio group. When provided, wraps the radio group in a flux:field component with an adjacent flux:label component. See the field component. |
| description | Help text displayed below the radio group. When provided alongside label, appears between the label and radio group within the flux:field wrapper. See the field component. |
| variant | Visual style of the group. Options: default, segmented, cards, pills, buttons. |
| invalid | Applies error styling to the radio group. |

| Slot | Description |
| --- | --- |
| default | The radio buttons to be grouped together. |

| Attribute | Description |
| --- | --- |
| data-flux-radio-group | Applied to the root element for styling and identification. |

### flux:radio
| Prop | Description |
| --- | --- |
| label | Label text displayed above the radio button. When provided, wraps the radio button in a flux:field component with an adjacent flux:label component. See the field component. |
| description | Help text displayed below the radio button. When provided alongside label, appears between the label and radio button within the flux:field wrapper. See the field component. |
| value | Value associated with the radio button when used in a group. |
| checked | If true, the radio button is selected by default. |
| disabled | Prevents user interaction with the radio button. |
| icon | Name of the icon to display (for segmented variant). |

| Slot | Description |
| --- | --- |
| default | Custom content for card variant. |

| Attribute | Description |
| --- | --- |
| data-flux-radio | Applied to the root element for styling and identification. |
| data-checked | Applied when the radio button is selected. |

### flux:radio.indicator
Used for custom radio button layouts in card variant.