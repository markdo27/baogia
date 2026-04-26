---
components_used: [field, input, label]
---

# Slider

Select a value using a horizontal slider control.

```blade
<flux:slider wire:model="amount" />
```

## Min/max/step
Use the min, max and step props to configure the slider.

```blade
<flux:slider min="0" max="100" step="10" />
```

## Displaying value
To display the current value, add an element with a wire:text directive.

```blade
<flux:field>
    <flux:label>
        Corner radius

        <x-slot name="trailing">
            <span wire:text="amount" class="tabular-nums"></span>
        </x-slot>
    </flux:label>

    <flux:slider wire:model="amount" />
</flux:field>
```

## With input
To display an input next to the slider and ensure accessibility, wrap both inside flux:field.

```blade
<flux:field>
    <flux:label>Corner radius</flux:label>

    <div class="flex items-center gap-4 -mt-2">
        <flux:slider wire:model="amount" />
        <flux:input wire:model="amount" type="number" size="sm" class="max-w-18" />
    </div>
</flux:field>
```

## Big steps
Use the big-step prop to define a step size that will be be used when pressing the arrow keys while holding the shift key.

```blade
<flux:slider step="1" big-step="10" />
```

## Step marks
Display ticks below the slider to visualize the steps.

```blade
<flux:slider min="1" max="5">
    @foreach (range(1, 5) as $i)
        <flux:slider.tick :value="$i" />
    @endforeach
</flux:slider>
```

## Numbered steps
Display numbers below the slider to visualize the steps.

```blade
<flux:slider min="1" max="5">
    @foreach (range(1, 5) as $i)
        <flux:slider.tick :value="$i">{{ $i }}</flux:slider.tick>
    @endforeach
</flux:slider>
```

## Custom steps
Display custom labels for specified steps.

```blade
<flux:slider min="1" max="5">
    <flux:slider.tick value="1">Low</flux:slider.tick>
    <flux:slider.tick value="3">Mid</flux:slider.tick>
    <flux:slider.tick value="5">High</flux:slider.tick>
</flux:slider>
```

## Range slider
Select a range of values using two slider thumbs.

```blade
<flux:slider range />
```

## Basic usage

Set the initial range using the value prop with comma separated values:

```blade
<flux:slider range value="20,80" />
```

You can also bind the values to a Livewire property using wire:model:

```blade
<flux:slider range wire:model="range" />
```

Now you can access the values from your Livewire component using an array of values:

```
<?php

use Livewire\Component;

class Dashboard extends Component {
    public array $range = [20, 80];
}
```

### Min steps between
Use min-steps-between to set the minimum distance between thumbs. The value is defined in number of steps, where the size of each step is determined by the step attribute.

```blade
<flux:slider range step="1" min-steps-between="10" />
```

### Displaying values
To display the selected range, add two elements with a wire:text directive.

```blade
<div class="relative">
    <flux:field>
        <flux:label>
            Price range

            <x-slot name="trailing">
                $<span wire:text="range[0]" class="tabular-nums"></span>
                &ndash;
                $<span wire:text="range[1]" class="tabular-nums"></span>
            </x-slot>
        </flux:label>

        <flux:slider range wire:model="range" min="0" max="990" step="10" min-steps-between="10" big-step="100" />
    </flux:field>
</div>
```

## Custom styles
Customize the styles of the slider using the track:class and thumb:class props.

```blade
<flux:slider track:class="h-5" thumb:class="size-5" />
```

## Reference

### flux:slider
| Prop | Description |
| --- | --- |
| range | Enables range selection. |
| min | Minimum value of the slider. |
| max | Maximum value of the slider. |
| step | Step size of the slider. |
| big-step | Step size of the slider when holding shift. |
| min-steps-between | Minimum distance between thumbs in number of steps. |
| track:class | CSS classes applied to the track. |
| thumb:class | CSS classes applied to the thumb. |

### flux:slider.tick
| Prop | Description |
| --- | --- |
| value | The value at which the tick should be displayed. |

| Slot | Description |
| --- | --- |
| default | The tick label. If left empty, displays a horizontal line. |