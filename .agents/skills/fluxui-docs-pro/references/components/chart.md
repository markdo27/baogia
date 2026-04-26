---
components_used: [card, heading, text]
---

# Chart

Flux's Chart component is a lightweight, zero-dependency tool for building charts in your Livewire applications. It is designed to be simple but extremely flexible, so that you can assemble and style your charts exactly as you need them.

```blade
<flux:chart wire:model="data" class="aspect-3/1">
    <flux:chart.svg>
        <flux:chart.line field="visitors" class="text-pink-500 dark:text-pink-400" />

        <flux:chart.axis axis="x" field="date">
            <flux:chart.axis.line />
            <flux:chart.axis.tick />
        </flux:chart.axis>

        <flux:chart.axis axis="y">
            <flux:chart.axis.grid />
            <flux:chart.axis.tick />
        </flux:chart.axis>

        <flux:chart.cursor />
    </flux:chart.svg>

    <flux:chart.tooltip>
        <flux:chart.tooltip.heading field="date" :format="['year' => 'numeric', 'month' => 'numeric', 'day' => 'numeric']" />
        <flux:chart.tooltip.value field="visitors" label="Visitors" />
    </flux:chart.tooltip>
</flux:chart>
```

## Data structure

Flux charts expect a structured array of data, typically provided via wire:model or passed as a value prop. Each data point should be an associative array with named fields:

```
<?php

use Livewire\Component;

class Dashboard extends Component
{
    public array $data = [
        ['date' => '2026-03-04', 'visitors' => 267],
        ['date' => '2026-03-03', 'visitors' => 259],
        ['date' => '2026-03-02', 'visitors' => 269],
        // ...
    ];
}
```

If you've stored this data as a public property, you can use wire:model to bind the data to the chart:

```blade
<flux:chart wire:model="data" />
```

Otherwise, you can pass data in any form directly into the :value prop:

```blade
<flux:chart :value="$this->data" />
```

For things like simple line charts with no axes, you can pass a single array of values as well:

```blade
<flux:chart :value="[1, 2, 3, 4, 5]" />
```

## Examples

## Line chart

To create a line chart, you can include the <flux:chart.line> component in the <flux:chart.svg> component:

```blade
<flux:chart wire:model="data" class="aspect-[3/1]">
    <flux:chart.svg>
        <flux:chart.line field="memory" class="text-pink-500" />
        <flux:chart.point field="memory" class="text-pink-400" />

        <flux:chart.axis axis="x" field="date">
            <flux:chart.axis.tick />
            <flux:chart.axis.line />
        </flux:chart.axis>

        <flux:chart.axis axis="y" tick-values="[0, 128, 256, 384, 512]" :format="['style' => 'unit', 'unit' => 'megabyte']">
            <flux:chart.axis.grid />
            <flux:chart.axis.tick />
        </flux:chart.axis>
    </flux:chart.svg>
</flux:chart>
```

As you can see above, you can also render circular points on top of the line using the <flux:chart.point> component.

## Area chart

Similar to a line chart but with a filled area beneath the line. Great for showing cumulative values or emphasizing volume.

```blade
<flux:chart wire:model="data" class="aspect-3/1">
    <flux:chart.svg>
        <flux:chart.line field="stock" class="text-blue-500 dark:text-blue-400" curve="none" />
        <flux:chart.area field="stock" class="text-blue-200/50 dark:text-blue-400/30" curve="none" />

        <flux:chart.axis axis="y" position="right" tick-prefix="$" :format="[
            'notation' => 'compact',
            'compactDisplay' => 'short',
            'maximumFractionDigits' => 1,
        ]">
            <flux:chart.axis.grid />
            <flux:chart.axis.tick />
        </flux:chart.axis>

        <flux:chart.axis axis="x" field="date">
            <flux:chart.axis.tick />
            <flux:chart.axis.line />
        </flux:chart.axis>
    </flux:chart.svg>
</flux:chart>
```

## Multiple lines

You can plot multiple lines in the same chart by including multiple <flux:chart.line> components. This helps compare different data series against each other.

```blade
<flux:chart wire:model="data">
    <flux:chart.viewport class="min-h-[20rem]" >
        <flux:chart.svg>
            <flux:chart.line field="twitter" class="text-blue-500" curve="none" />
            <flux:chart.point field="twitter" class="text-blue-500" r="6" stroke-width="3" />
            <flux:chart.line field="facebook" class="text-red-500" curve="none" />
            <flux:chart.point field="facebook" class="text-red-500" r="6" stroke-width="3" />
            <flux:chart.line field="instagram" class="text-green-500" curve="none" />
            <flux:chart.point field="instagram" class="text-green-500" r="6" stroke-width="3" />

            <flux:chart.axis axis="x" field="date">
                <flux:chart.axis.tick />
                <flux:chart.axis.line />
            </flux:chart.axis>

            <flux:chart.axis axis="y" tick-start="0" tick-end="1" :format="[
                'style' => 'percent',
                'minimumFractionDigits' => 0,
                'maximumFractionDigits' => 0,
            ]">
                <flux:chart.axis.grid />
                <flux:chart.axis.tick />
            </flux:chart.axis>
        </flux:chart.svg>
    </flux:chart.viewport>

    <div class="flex justify-center gap-4 pt-4">
        <flux:chart.legend label="Instagram">
            <flux:chart.legend.indicator class="bg-green-400" />
        </flux:chart.legend>

        <flux:chart.legend label="Twitter">
            <flux:chart.legend.indicator class="bg-blue-400" />
        </flux:chart.legend>

        <flux:chart.legend label="Facebook">
            <flux:chart.legend.indicator class="bg-red-400" />
        </flux:chart.legend>
    </div>
</flux:chart>
```

You might have noticed that the above example includes a <flux:chart.viewport> component. This is used to constrain the chart SVG within the chart component so that you can render siblings like legends or summaries above or below it.

## Bar chart

To create a bar chart, you can include the <flux:chart.bar> component in the <flux:chart.svg> component:

```blade
<flux:chart wire:model="data" class="aspect-[3/1]">
    <flux:chart.svg>
        <flux:chart.bar field="revenue" class="text-blue-500" radius="0" width="85%" />

        <flux:chart.axis axis="x" field="date" tick-count="10">
            <flux:chart.axis.tick />
            <flux:chart.axis.line />
        </flux:chart.axis>

        <flux:chart.axis axis="y" :format="['useGrouping' => true]" tick-prefix="$">
            <flux:chart.axis.grid />
            <flux:chart.axis.tick />
        </flux:chart.axis>

        <flux:chart.cursor type="area" />
    </flux:chart.svg>

    <flux:chart.tooltip>
        <flux:chart.tooltip.heading field="date" />
        <flux:chart.tooltip.value field="revenue" label="Revenue" :format="['useGrouping' => true]" prefix="$" />
    </flux:chart.tooltip>
</flux:chart>
blade
<flux:chart wire:model="data" class="aspect-[3/1]">
    <flux:chart.svg>
        <flux:chart.bar field="tickets" class="text-blue-300 dark:text-blue-700" />

        <flux:chart.axis axis="x" field="month">
            <flux:chart.axis.tick />
        </flux:chart.axis>

        <flux:chart.axis axis="y">
            <flux:chart.axis.grid />
            <flux:chart.axis.tick />
        </flux:chart.axis>
    </flux:chart.svg>

    <flux:chart.tooltip>
        <flux:chart.tooltip.value field="tickets" label="Tickets" />
    </flux:chart.tooltip>
</flux:chart>
```

## Grouped bar chart

To create a grouped bar chart, you can wrap multiple <flux:chart.bar> components inside a single <flux:chart.group> component:

```blade
<flux:chart wire:model="data">
    <flux:chart.viewport class="aspect-[3/1]">
        <flux:chart.svg>
            <flux:chart.group>
                <flux:chart.bar field="chrome" class="text-blue-600" />
                <flux:chart.bar field="firefox" class="text-blue-500" />
                <flux:chart.bar field="safari" class="text-blue-300" />
            </flux:chart.group>

            <flux:chart.axis axis="x" field="year">
                <flux:chart.axis.tick />
                <flux:chart.axis.line />
            </flux:chart.axis>

            <flux:chart.axis axis="y">
                <flux:chart.axis.grid />
                <flux:chart.axis.tick />
            </flux:chart.axis>
        </flux:chart.svg>
    </flux:chart.viewport>

    <div class="flex justify-center gap-4 pt-4">
        <flux:chart.legend label="Chrome">
            <flux:chart.legend.indicator class="bg-blue-600" />
        </flux:chart.legend>
        <flux:chart.legend label="Firefox">
            <flux:chart.legend.indicator class="bg-blue-500" />
        </flux:chart.legend>
        <flux:chart.legend label="Safari">
            <flux:chart.legend.indicator class="bg-blue-300" />
        </flux:chart.legend>
    </div>
</flux:chart>
```

## Stacked bar chart

To create a stacked bar chart, you can wrap multiple <flux:chart.bar> components inside a single <flux:chart.stack> component:

```blade
<flux:chart wire:model="data">
    <flux:chart.viewport class="aspect-[3/1]">
        <flux:chart.svg>
            <flux:chart.stack width="65%">
                <flux:chart.bar field="online" class="text-blue-600" />
                <flux:chart.bar field="retail" class="text-blue-400" />
                <flux:chart.bar field="wholesale" class="text-blue-300" radius="4 0" />
            </flux:chart.stack>

            <flux:chart.axis axis="x" field="category">
                <flux:chart.axis.tick />
                <flux:chart.axis.line />
            </flux:chart.axis>

            <flux:chart.axis axis="y">
                <flux:chart.axis.grid />
                <flux:chart.axis.tick />
            </flux:chart.axis>
        </flux:chart.svg>
    </flux:chart.viewport>

    <div class="flex justify-center gap-4 pt-4">
        <flux:chart.legend label="Online">
            <flux:chart.legend.indicator class="bg-blue-600" />
        </flux:chart.legend>
        <flux:chart.legend label="Retail">
            <flux:chart.legend.indicator class="bg-blue-400" />
        </flux:chart.legend>
        <flux:chart.legend label="Wholesale">
            <flux:chart.legend.indicator class="bg-blue-300" />
        </flux:chart.legend>
    </div>
</flux:chart>
```

## Live summary

Flux charts support live summaries, which are updated as the user hovers over the chart. To enable this feature, you can include the <flux:chart.summary> component in the <flux:chart> component:

```blade
<flux:card>
    <flux:chart class="grid gap-6" wire:model="data">
        <flux:chart.summary class="flex gap-12">
            <div>
                <flux:text>Today</flux:text>

                <flux:heading size="xl" class="mt-2 tabular-nums">
                    <flux:chart.summary.value field="sales" :format="['style' => 'currency', 'currency' => 'USD']" />
                </flux:heading>

                <flux:text class="mt-2 tabular-nums">
                    <flux:chart.summary.value field="date" :format="['hour' => 'numeric', 'minute' => 'numeric', 'hour12' => true]" />
                </flux:text>
            </div>

            <div>
                <flux:text>Yesterday</flux:text>

                <flux:heading size="lg" class="mt-2 tabular-nums">
                    <flux:chart.summary.value field="yesterday" :format="['style' => 'currency', 'currency' => 'USD']" />
                </flux:heading>
            </div>
        </flux:chart.summary>

        <flux:chart.viewport class="aspect-[3/1]">
            <flux:chart.svg>
                <flux:chart.line field="yesterday" class="text-zinc-300 dark:text-white/40" stroke-dasharray="4 4" curve="none" />
                <flux:chart.line field="sales" class="text-sky-500 dark:text-sky-400" curve="none" />

                <flux:chart.axis axis="x" field="date">
                    <flux:chart.axis.grid />
                    <flux:chart.axis.tick />
                    <flux:chart.axis.line />
                </flux:chart.axis>

                <flux:chart.axis axis="y">
                    <flux:chart.axis.tick />
                </flux:chart.axis>

                <flux:chart.cursor />
            </flux:chart.svg>
        </flux:chart.viewport>
    </flux:chart>
</flux:card>
```

## Sparkline

A compact, single-line chart used in tables or dashboards for quick visual insights. Ideal for stock prices, memory usage, or other small-scale trends.

```blade
<flux:chart :value="[15, 18, 16, 19, 22, 25, 28, 25, 29, 28, 32, 35]" class="w-[5rem] aspect-[3/1]">
    <flux:chart.svg gutter="0">
        <flux:chart.line class="text-green-500 dark:text-green-400" />
    </flux:chart.svg>
</flux:chart>
```

You might have noticed the gutter attribute on the <flux:chart.svg> component. This is because by default, the chart will be rendered with a padding of 8px on all sides. This is to prevent overflowing contents of the chart (like tick labels or stroke lines) from being cut off at the edges of the container.

For simple charts like a sparkline, you don't want that extra padding, so you can set the gutter to 0 to remove it.

[Read more about the gutter prop ->](#chart-padding)

## Dashboard stat

A small card displaying a key metric with an embedded chart in the background. Useful for KPIs like revenue, active users, or system health.

```blade
<flux:card class="overflow-hidden min-w-[12rem]">
    <flux:text>Revenue</flux:text>

    <flux:heading size="xl" class="mt-2 tabular-nums">$12,345</flux:heading>

    <flux:chart class="-mx-8 -mb-8 h-[3rem]" :value="[10, 12, 11, 13, 15, 14, 16, 18, 17, 19, 21, 20]">
        <flux:chart.svg gutter="0">
            <flux:chart.line class="text-sky-200 dark:text-sky-400" />
            <flux:chart.area class="text-sky-100 dark:text-sky-400/30" />
        </flux:chart.svg>
    </flux:chart>
</flux:card>
```

## Chart padding

By default, the chart will be rendered with a padding of 8px on all sides. This is to prevent overflowing contents of the chart (like tick labels or stroke lines) from being cut off at the edges of the container.

You can control this by setting the gutter attribute on the <flux:chart.svg> component:

Here's an example of adding the following padding to the chart:

```blade
<flux:chart>
    <flux:chart.svg gutter="12 0 12 8">
        <!-- ... -->
    </flux:chart.svg>
</flux:chart>
```

The gutter attribute accepts between one and four values, which correspond to the top, right, bottom, and left padding respectively. Similar to the padding property shorthand in CSS.

The example above will result in the following padding:

-   **Top:** 12px
-   **Right:** 0px
-   **Bottom:** 12px
-   **Left:** 8px

## Axis scale

You can configure the scale of an axis and its ticks by setting the scale attribute on the <flux:chart.axis> component:

```blade
<flux:chart.axis axis="y" scale="linear">
    <!-- ... -->
</flux:chart.axis>
```

There are three available types of scales:

-   categorical: For categorical data like names or categories.
-   linear: For numeric data like stock prices or temperatures.
-   time: For date and time data

The "y" axis is linear by default, but you can change it to a time axis by setting the scale attribute to time.

The "x" axis will automatically use a time scale if the data is date or time values. Otherwise, it will use a categorical scale.

## Axis lines

By default, axes do not include a visible baseline. You can add an axis line using <flux:chart.axis.line> inside the corresponding axis:

```blade
<flux:chart.svg>
    <!-- ... -->

    <flux:chart.axis axis="x">
        <!-- Horizontal "X" axis line: -->
        <flux:chart.axis.line />
    </flux:chart.axis>

    <flux:chart.axis axis="y">
        <!-- Vertical "Y" axis line: -->
        <flux:chart.axis.line />
    </flux:chart.axis>
</flux:chart.svg>
```

**Styling axis lines**

Because the axis line is rendered as a <line> element, you can style it using any of the SVG attributes that are available for the <line> element.

```blade
<!-- A dark gray axis line that is 2px wide and has a gray color: -->
<flux:chart.axis.line class="text-zinc-800" stroke-width="2" />
```

## Zero line

The zero line is the line that represents the zero value on the axis. It will only be visible if the axis includes a negative value.

```blade
<flux:chart.svg>
    <!-- ... -->

    <!-- Zero line: -->
    <flux:chart.zero-line />
</flux:chart.svg>
```

**Styling the zero line**

Because the zero line is rendered as a <line> element, you can style it using any of the SVG attributes that are available for the <line> element.

```blade
<!-- A dark gray zero line that is 2px wide and has a gray color: -->
<flux:chart.zero-line class="text-zinc-800" stroke-width="2" />
```

## Grid lines

You can render horizontal and vertical grid lines by adding the <flux:chart.axis.grid> component to the appropriate axis:

```blade
<flux:chart.svg>
    <!-- ... -->

    <flux:chart.axis axis="x">
        <!-- Vertical grid lines: -->
        <flux:chart.axis.grid />
    </flux:chart.axis>

    <flux:chart.axis axis="y">
        <!-- Horizontal grid lines: -->
        <flux:chart.axis.grid />
    </flux:chart.axis>
</flux:chart.svg>
```

**Styling grid lines**

Because the grid lines are rendered as a <line> element, you can style them using any of the SVG attributes that are available for the <line> element.

```blade
<!-- A dashed grid line that is 2px wide and has a gray color: -->
<flux:chart.axis.grid class="text-zinc-200/50" stroke-width="2" stroke-dasharray="4,4" />
```

## Ticks

You can render tick mark lines and labels by adding the <flux:chart.axis.mark> and/or <flux:chart.axis.tick> components to the appropriate axis:

```blade
<flux:chart.svg>
    <!-- ... -->

    <flux:chart.axis axis="x">
        <!-- X axis tick mark lines: -->
        <flux:chart.axis.mark />

        <!-- X axis tick labels: -->
        <flux:chart.axis.tick />
    </flux:chart.axis>

    <flux:chart.axis axis="y">
        <!-- Y axis tick mark lines: -->
        <flux:chart.axis.mark />

        <!-- Y axis tick labels: -->
        <flux:chart.axis.tick />
    </flux:chart.axis>
</flux:chart.svg>
```

**Styling tick mark lines**

The tick mark component is a simple wrapper around the <line> SVG element. You can customize the length, width, and color of the tick mark lines using plain CSS and SVG attributes:

```blade
<!-- A tick mark line that is 10px long, 2px wide, and has a gray color: -->
<flux:chart.axis.mark class="text-zinc-300" stroke-width="2" y1="0" y2="10" />
```

**Styling tick labels**

The <flux:chart.axis.tick> component is a simple wrapper around the <text> SVG element. You can customize the font size, color, and position of the tick labels using plain CSS and SVG attributes:

```blade
<!-- A tick label that is 12px, has a blue color, is center aligned, and is 2.5rem from the axis line: -->
<flux:chart.axis.tick class="text-xs text-blue-500" text-anchor="middle" dy="2.5rem"  />
```

## Tick frequency

You can influence the number of ticks on an axis by setting the tick-count attribute:

**Setting the tick count**

```blade
<flux:chart.axis axis="y" tick-count="5">
    <!-- ... -->
</flux:chart.axis>
```

Note that the tick-count attribute is only a target number, and the actual number of ticks may vary based on the range of values on the axis.

**Setting the tick start**

By default, the tick marks will start at zero, unless negative values are present. You can override this by setting the tick-start attribute:

```blade
<flux:chart.axis axis="y" tick-start="min">
    <!-- ... -->
</flux:chart.axis>
```

The available values for tick-start are:

-   auto: Automatically determine the starting tick value.
-   min: Start at the minimum value on the axis.
-   0: Start at zero.
-   123: Start at 123 (or any other number).

**Setting the tick end**

By default, the tick marks will end at the next tick mark after the maximum value on the axis. You can override this by setting the tick-end attribute:

```blade
<flux:chart.axis axis="y" tick-end="max">
    <!-- ... -->
</flux:chart.axis>
```

The available values for tick-end are:

-   auto: Automatically determine the ending tick value.
-   max: End at the maximum value on the axis.
-   123: End at 123 (or any other number).

**Setting explicit tick values**

You can also set explicit tick values by passing an array of values to the tick-values attribute:

```blade
<flux:chart.axis axis="y" tick-values="[0, 128, 256, 384, 512]" tick-suffix="MB">
    <!-- ... -->
</flux:chart.axis>
```

## Tick formatting

The tick labels can be formatted using the format attribute.

Under-the-hood, the format attribute is passed to the Intl.NumberFormat constructor.

This means that you can use any of the formatting options that are available for the Intl.NumberFormat constructor.

[See the MDN documentation for more information on the formatting options ->](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)

```blade
<flux:chart.svg>
    <!-- ... -->

    <!-- Format the X axis tick labels to display the month and day: -->
    <flux:chart.axis axis="x" :format="['month' => 'long', 'day' => 'numeric']">
        <!-- X axis tick labels: -->
        <flux:chart.axis.tick />
    </flux:chart.axis>

    <!-- Format the Y axis tick labels to display the value in USD: -->
    <flux:chart.axis axis="y" :format="['style' => 'currency', 'currency' => 'USD']">
        <!-- Y axis tick labels: -->
        <flux:chart.axis.tick />
    </flux:chart.axis>
</flux:chart.svg>
```

**Setting a tick prefix**

You can set a tick prefix by passing a string to the tick-prefix attribute:

```blade
<flux:chart.axis axis="y" tick-prefix="$">
    <!-- ... -->
</flux:chart.axis>
```

**Setting a tick suffix**

You can set a tick suffix by passing a string to the tick-suffix attribute:

```blade
<flux:chart.axis axis="y" tick-suffix="MB">
    <!-- ... -->
</flux:chart.axis>
```

## Cursor

Adds a vertical guide when hovering over the chart to highlight values at specific points. Customizable with stroke styles, colors, and dash patterns.

To enable a cursor, simply include <flux:chart.cursor> inside <flux:chart.svg>:

```blade
<flux:chart.svg>
    <!-- ... -->

    <flux:chart.cursor />
</flux:chart.svg>
```

**Styling the cursor**

Because the cursor is rendered as a <line> element, you can style it using any of the SVG attributes that are available for the <line> element.

```blade
<!-- A dashed, black cursor that is 1px wide: -->
<flux:chart.cursor class="text-zinc-800" stroke-width="1" stroke-dasharray="4,4" />
```

## Tooltip

Displays contextual data on hover. Supports multiple values and custom formatting for better readability.

To enable tooltips, include <flux:chart.tooltip> inside <flux:chart>:

```blade
<flux:chart>
    <flux:chart.svg>
        <!-- ... -->
    </flux:chart.svg>

    <flux:chart.tooltip>
        <flux:chart.tooltip.heading field="date" />

        <flux:chart.tooltip.value field="visitors" label="Visitors" />
        <flux:chart.tooltip.value field="views" label="Views" :format="['notation' => 'compact']" />
    </flux:chart.tooltip>
</flux:chart>
```

**Customizing tooltip content**

You can display multiple values and format numbers dynamically.

```blade
<flux:chart.tooltip>
    <flux:chart.tooltip.heading field="date" />

    <flux:chart.tooltip.value field="visitors" label="Visitors" />
    <flux:chart.tooltip.value field="views" label="Page Views" :format="['notation' => 'compact']" />
</flux:chart.tooltip>
```

## Legend

Identifies multiple data series in the chart. Each legend item corresponds to a different dataset.

When using a legend, you will need to include a <flux:chart.viewport> component to wrap the <flux:chart.svg> component so that the legend is rendered outside of the chart:

```blade
<flux:chart wire:model="data">
    <flux:chart.viewport class="aspect-3/1">
        <flux:chart.svg>
            <flux:chart.line class="text-blue-500" field="visitors" />
            <flux:chart.line class="text-red-500" field="views" />
        </flux:chart.svg>
    </flux:chart.viewport>

    <div class="flex justify-center gap-4 pt-4">
        <flux:chart.legend label="Visitors">
            <flux:chart.legend.indicator class="bg-blue-400" />
        </flux:chart.legend>

        <flux:chart.legend label="Views">
            <flux:chart.legend.indicator class="bg-red-400" />
        </flux:chart.legend>
    </div>
</flux:chart>
```

## Summary

Displays a single value from the dataset in a bold, easy-to-read format. Great for key performance indicators.

To enable a summary, include <flux:chart.summary> inside <flux:chart>:

```blade
<flux:chart wire:model="data">
    <flux:chart.summary>
        <flux:chart.summary.value field="visitors" :format="['notation' => 'compact']" />
    </flux:chart.summary>

    <flux:chart.viewport class="aspect-[3/1]">
        <!-- ... -->
    </flux:chart.viewport>
</flux:chart>
```

Notice that you will need to include a <flux:chart.viewport> component to wrap the <flux:chart.svg> component so that the summary is rendered outside of the chart.

**Setting a fallback value**

You can set a fallback value by passing a string to the fallback attribute:

```blade
<flux:chart.summary.value field="visitors" fallback="1200" />
```

This will be the value that is displayed if a data point is not being hovered over.

## Formatting

You can customize how numbers and dates appear in your charts to make them more readable. Whether it's formatting currency, percentages, or large numbers, Flux charts let you easily control how values are displayed using the :format prop.

Flux handles formatting for you behind the scenes using the Intl.NumberFormat and Intl.DateTimeFormat API, a built-in browser feature that ensures numbers and dates are displayed consistently based on locale and formatting rules. Just pass your desired format options to the :format prop, and Flux will apply them for you.

## Formatting numbers

You can format numbers by passing an array of formatting options to the :format prop.

```blade
<flux:chart.axis axis="y" :format="['style' => 'currency', 'currency' => 'USD']" />
```

**Commonly used formatting options**

Here are some commonly used number formatting options you will likely need:

| Description | Example Input | Example Output | Format Array |
| --- | --- | --- | --- |
| Currency (USD) | 1234.56 | $1,234.56 | ['style' => 'currency', 'currency' => 'USD'] |
| Currency (EUR) | 1234.56 | €1,234.56 | ['style' => 'currency', 'currency' => 'EUR'] |
| Percent | 0.85 | 85% | ['style' => 'percent'] |
| Compact Number | 1000000 | 1M | ['notation' => 'compact'] |
| Scientific | 123456789 | 1.235E8 | ['notation' => 'scientific'] |
| Fixed Decimal | 3.1415926535 | 3.14 | ['maximumFractionDigits' => 2] |
| Thousands Separator | 1234567 | 1,234,567 | ['useGrouping' => true] |
| Custom Unit | 50 | 50 MB | ['style' => 'unit', 'unit' => 'megabyte'] |

## Formatting dates

You can format dates by passing an array of formatting options to the :format prop.

```blade
<flux:chart.axis axis="x" field="date" :format="['month' => 'long', 'day' => 'numeric']" />
```

**Commonly used date formatting options**

Here are some commonly used date formatting options you will likely need:

| Description | Example Input | Example Output | Format Array |
| --- | --- | --- | --- |
| Full Date | 2024-03-15 | Friday, March 15, 2024 | ['dateStyle' => 'full'] |
| Month and Day | 2024-03-15 | March 15 | ['month' => 'long', 'day' => 'numeric'] |
| Short Month | 2024-03-15 | Mar 15 | ['month' => 'short', 'day' => 'numeric'] |
| Time Only | 2024-03-15 14:30 | 2:30 PM | ['hour' => 'numeric', 'minute' => 'numeric', 'hour12' => true] |
| 24-hour Time | 2024-03-15 14:30 | 14:30 | ['hour' => '2-digit', 'minute' => '2-digit', 'hour12' => false] |
| Weekday | 2024-03-15 | Friday | ['weekday' => 'long'] |
| Short Date | 2024-03-15 | 03/15/24 | ['month' => '2-digit', 'day' => '2-digit', 'year' => '2-digit'] |
| Year Only | 2024-03-15 | 2024 | ['year' => 'numeric'] |

## Additional resources

For more detailed information about formatting options, refer to:

-   [MDN Documentation on Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
-   [MDN Documentation on Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

## Reference

### flux:chart
| Prop | Description |
| --- | --- |
| wire:model | Binds the chart to a Livewire property containing the data to display. See the wire:model documentation for more information. |
| value | Array of data points for the chart. Each point should be an associative array with named fields. Used when not binding with wire:model. |
| curve | Default line curve type for all lines in the chart. Options: smooth (default), none. |

| Slot | Description |
| --- | --- |
| default | Chart components to render. Typically contains a flux:chart.svg component that defines the chart structure. |

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the chart container. Common uses: aspect-3/1 for aspect ratio, h-64 for fixed height. |

| Attribute | Description |
| --- | --- |
| data-flux-chart | Applied to the root element for styling and identification. |

### flux:chart.svg
Container for the chart's SVG elements. This component must be included within a \`flux:chart\` to render the chart.

| Slot | Description |
| --- | --- |
| default | Chart visualization components like lines, areas, axes, and interactive elements. |

### flux:chart.line
| Prop | Description |
| --- | --- |
| field | Name of the data field to plot on the y-axis. Required. |
| curve | Line curve type. Options: smooth (default), none. |

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the line. Common use: text-{color} for line color. |

### flux:chart.area
| Prop | Description |
| --- | --- |
| field | Name of the data field to plot on the y-axis. Required. |
| curve | Area curve type. Options: smooth (default), none. |

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the area. Common use: fill-{color}/20 for fill color. |

### flux:chart.point
Adds points (dots) to mark data points on a line or area chart.

| Prop | Description |
| --- | --- |
| field | Name of the data field to plot points for. Required. |

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the points. Common use: fill-{color} for point fill color, r attribute for point radius. |

### flux:chart.axis
| Prop | Description |
| --- | --- |
| axis | Axis to configure. Options: x, y. Required. |
| field | For x-axis, the data field to use for labels. |
| format | Date/number formatting options for axis labels. See Formatting for more details. |

### flux:chart.axis.mark
Adds tick marks to the chart. Must be used within a \`flux:chart.axis\` component.

| Prop | Description |
| --- | --- |
| position | Position of the tick marks. Options: top, bottom, left, right. |

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the tick marks. Common use: text-{color} for line color, stroke-width="1" for line thickness. |

### flux:chart.axis.line
Adds an axis line to the chart. Must be used within a \`flux:chart.axis\` component.

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the axis line. Common use: text-{color} for line color, stroke-width="1" for line thickness. |

### flux:chart.axis.grid
Adds gridlines to the chart. Must be used within a \`flux:chart.axis\` component.

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the gridlines. Common use: text-{color} for line color, stroke-width="{width}" for line thickness. |

### flux:chart.axis.tick
Adds tick marks and labels to an axis. Must be used within a \`flux:chart.axis\` component.

| Prop | Description |
| --- | --- |
| format | Date/number formatting options for tick labels. See Formatting for more details. |

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the tick marks and labels. Common use: text-{color} for label color, font-{weight} for label weight. |

### flux:chart.zero-line
Adds a horizontal line at y=0. Useful for charts that contain both positive and negative values.

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the zero line. Common use: text-{color} for line color, stroke-width="{width}" for line thickness. |

### flux:chart.tooltip
| Prop | Description |
| --- | --- |
| field | Data field to display in the tooltip. |
| format | Date/number formatting options for tooltip values. |

### flux:chart.tooltip.heading
| Prop | Description |
| --- | --- |
| field | Data field to display in the tooltip heading. |
| format | Date/number formatting options for tooltip values. See Formatting for more details. |

### flux:chart.tooltip.value
| Prop | Description |
| --- | --- |
| field | Data field to display in the tooltip. |
| format | Date/number formatting options for tooltip values. See Formatting for more details. |

### flux:chart.cursor
Adds an interactive cursor that follows mouse movement over the chart. Activates tooltips when present.

| CSS | Description |
| --- | --- |
| class | Additional CSS classes applied to the cursor line. |

### flux:chart.summary
Adds a summary section typically shown above the chart. Shows the latest values or values at cursor position.

| Slot | Description |
| --- | --- |
| default | Content to display in the summary section. Can include flux:chart.value components to display specific data values. |

### flux:chart.summaryvalue
Displays a specific data value, typically used within a \`flux:chart.summary\` component.

| Prop | Description |
| --- | --- |
| field | Data field to display. |
| fallback | Fallback text to display if the value is not found or cannot be formatted. |
| format | Date/number formatting options. See Formatting for more details. |

### flux:chart.legend
| Prop | Description |
| --- | --- |
| field | Data field this legend item represents. |
| label | Label text for the legend item. |
| format | Date/number formatting options. See Formatting for more details. |

| Slot | Description |
| --- | --- |
| default | Content to display in the legend. Can include arbitrary content, including flux:chart.legend.indicator components. |