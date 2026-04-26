# Toast

A message that provides feedback to users about an action or event, often temporary and dismissible.

To use the Toast component from Livewire, you must include it somewhere on the page; often in your layout file:

```blade
<body>
    <!-- ... -->

    <flux:toast />
</body>
```

If you are using wire:navigate to navigate between pages, you may want to persist the toast component so that toast messages don't suddenly disappear when navigating away from the page.

```blade
<body>
    <!-- ... -->

    @persist('toast')
        <flux:toast />
    @endpersist
</body>
```

Once the toast component is present on the page, you can use the Flux::toast() method to trigger a toast message from your Livewire components:

```
<?php

namespace App\Livewire;

use Livewire\Component;
use Flux\Flux;

class EditPost extends Component
{
    public function save()
    {
        // ...

        Flux::toast('Your changes have been saved.');
    }
}
```

You can also trigger a toast from Alpine directly using Flux's magic methods:

```
<button x-on:click="$flux.toast('Your changes have been saved.')">
    Save changes
</button>
```

Or you can use the window.Flux global object to trigger a toast from any JavaScript in your application:

```
<script>
    let button = document.querySelector('...')

    button.addEventListener('alpine:init', () => {
        Flux.toast('Your changes have been saved.')
    })
</script>
```

Both $flux and window.Flux support the following method parameter signatures:

```
Flux.toast('Your changes have been saved.')

// Or...

Flux.toast({
    heading: 'Changes saved',
    text: 'Your changes have been saved.',
    variant: 'success',
})
```

## With heading
Use a heading to provide additional context for the toast.

```
Flux::toast(
    heading: 'Changes saved.',
    text: 'You can always update this in your settings.',
);
```

## Variants
Use the variant prop to change the visual style of the toast.

```
Flux::toast(variant: 'success', ...);
Flux::toast(variant: 'warning', ...);
Flux::toast(variant: 'danger', ...);
```

## Positioning
By default, the toast will appear in the bottom right corner of the page. You can customize this position using the position prop.

```blade
<flux:toast position="top end" />

<!-- Customize top padding for things like navbars... -->
<flux:toast position="top end" class="pt-24" />
```

## Duration
By default, the toast will automatically dismiss after 5 seconds. You can customize this duration by passing a number of milliseconds to the duration prop.

```
// 1 second...
Flux::toast(duration: 1000, ...);
```

## Permanent
Use a value of 0 as the duration prop to make the toast stay open indefinitely.

```
// Show indefinitely...
Flux::toast(duration: 0, ...);
```

## Stack
To show a stack of toasts, you can wrap the flux:toast component in a flux:toast.group component. By default, toasts in a stack overlap and expand on hover to show each toast vertically.

```blade
<flux:toast.group>
    <flux:toast />
</flux:toast.group>
```

Use the expanded prop to always show the toast stack in an expanded state, making all toasts visible at once.

```blade
<flux:toast.group expanded>
    <flux:toast />
</flux:toast.group>
```

The group component also accepts the position prop to control where the toast stack appears on the screen.

```blade
<flux:toast.group position="top end">
    <flux:toast />
</flux:toast.group>
```

## Reference

### flux:toast
| Prop | Description |
| --- | --- |
| position | Position of the toast on the screen. Options: bottom end (default), bottom center, bottom start, top end, top center, top start. |

### flux:toast.group
| Prop | Description |
| --- | --- |
| position | Position of the toast group on the screen. Options: bottom end (default), bottom center, bottom start, top end, top center, top start. |
| expanded | If true, always shows the toast stack in an expanded state, making all toasts visible at once. Default: false. |

### Flux::toast()
The PHP method used to trigger toasts from Livewire components.

| Parameter | Description |
| --- | --- |
| heading | Optional heading text for the toast. |
| text | Main content text of the toast. |
| variant | Visual style. Options: success, warning, danger. |
| duration | Duration in milliseconds. Use 0 for permanent toasts. Default: 5000. |

### $flux.toast()
The Alpine.js magic method used to trigger toasts from Alpine components. It can be used in two ways:

```
// Simple usage with just a message...
$flux.toast('Your changes have been saved')

// Advanced usage with full configuration...
$flux.toast({
    heading: 'Success!',
    text: 'Your changes have been saved',
    variant: 'success',
    duration: 3000
})
```

| Parameter | Description |
| --- | --- |
| message | A string containing the toast message. When using this simple form, the message becomes the toast's text content. |
| options | Alternatively, an object containing: - heading: Optional title text - text: Main message text - variant: Visual style (success, warning, danger) - duration: Display time in milliseconds |