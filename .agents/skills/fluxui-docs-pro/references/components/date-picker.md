---
components_used: [calendar]
---

# Date picker

Allow users to select dates or date ranges via a calendar overlay. Perfect for filtering data or scheduling events.

Use date inputs instead of date pickers for far-future or past events such as birthdates.

```blade
<flux:date-picker />
```

## Basic usage

Set the initial selected date using the value prop with a Y-m-d formatted date string:

```blade
<flux:date-picker value="2026-03-04" />
```

You can also bind the selection to a Livewire property using wire:model:

```blade
<flux:date-picker wire:model="date" />
```

Now you can access the selected date from your Livewire component using either a Carbon instance or a Y-m-d formatted string:

```
<?php

use Illuminate\Support\Carbon;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component {
    public ?Carbon $date;

    public function save()
    {
        Post::create([
            // ...
            'published_at' => $this->date,
        ])

        // ...
    }
}
```

## Input trigger
Attach the date picker to a date input for more precise date selection control.

```blade
<flux:date-picker wire:model="date">
    <x-slot name="trigger">
        <flux:date-picker.input />
    </x-slot>
</flux:date-picker>
```

## Range picker
Enable selection of date ranges for reporting, booking systems, or any scenario requiring a start and end date.

```blade
<flux:date-picker mode="range" />
```

Set the initial range using the value prop with a start and end date separated by a forward slash:

```blade
<flux:date-picker mode="range" value="2026-03-02/2026-03-06" />
```

You can also bind the selection to a Livewire property using wire:model:

```blade
<flux:date-picker mode="range" wire:model="range" />
```

Now you can access the selected range from your Livewire component using an associative array of Y-m-d formatted date strings:

```
<?php

use Illuminate\Support\Carbon;
use Livewire\Component;

class Dashboard extends Component {
    public array $range;

    public function mount() {
        $this->range = [
            'start' => now()->subMonth()->format('Y-m-d'),
            'end' => now()->format('Y-m-d'),
        ];
    }
}
```

Alternatively, you can use the specialized DateRange object for enhanced functionality:

```
<?php

use Livewire\Component;
use Flux\DateRange;

class Dashboard extends Component {
    public DateRange $range;

    public function mount() {
        $this->range = new DateRange(now()->subMonth(), now());
    }
}
```

We highly recommend using the DateRange object for range selection, it provides a lot of useful functionality.

[Check out everything you can do with the DateRange object ->](#the-daterange-object)

## Range limits
Control the allowed range of dates that can be selected.

```blade
<flux:date-picker mode="range" min-range="3" />
blade
<flux:date-picker mode="range" max-range="10" />
```

## Range with inputs
Use separate inputs for start and end dates to provide a clearer interface for date range selection.

```blade
<flux:date-picker mode="range">
    <x-slot name="trigger">
        <div class="flex flex-col sm:flex-row gap-6 sm:gap-4">
            <flux:date-picker.input label="Start" />
            <flux:date-picker.input label="End" />
        </div>
    </x-slot>
</flux:date-picker>
```

## Presets
Allow users to select from frequently used ranges like "Last 7 days" or "This month".

```blade
<flux:date-picker mode="range" with-presets />
```

You can also specify which presets to show, and in which order, using the presets prop:

```blade
<flux:date-picker
    mode="range"
    presets="today yesterday thisWeek last7Days thisMonth yearToDate allTime"
/>
```

## Available presets

Below is a list of all available presets.

| Key | Label | Constructor | Date Range |
| --- | --- | --- | --- |
| today | Today | DateRange::today() | Current day |
| yesterday | Yesterday | DateRange::yesterday() | Previous day |
| thisWeek | This Week | DateRange::thisWeek() | Current week |
| lastWeek | Last Week | DateRange::lastWeek() | Previous week |
| last7Days | Last 7 Days | DateRange::last7Days() | Previous 7 days |
| thisMonth | This Month | DateRange::thisMonth() | Current month |
| lastMonth | Last Month | DateRange::lastMonth() | Previous month |
| thisQuarter | This Quarter | DateRange::thisQuarter() | Current quarter |
| lastQuarter | Last Quarter | DateRange::lastQuarter() | Previous quarter |
| thisYear | This Year | DateRange::thisYear() | Current year |
| lastYear | Last Year | DateRange::lastYear() | Previous year |
| last14Days | Last 14 Days | DateRange::last14Days() | Previous 14 days |
| last30Days | Last 30 Days | DateRange::last30Days() | Previous 30 days |
| last3Months | Last 3 Months | DateRange::last3Months() | Previous 3 months |
| last6Months | Last 6 Months | DateRange::last6Months() | Previous 6 months |
| yearToDate | Year to Date | DateRange::yearToDate() | January 1st to today |
| tomorrow | Tomorrow | DateRange::tomorrow() | Next day |
| nextWeek | Next Week | DateRange::nextWeek() | Next week |
| next7Days | Next 7 Days | DateRange::next7Days() | Next 7 days from today |
| nextMonth | Next Month | DateRange::nextMonth() | Next month |
| nextQuarter | Next Quarter | DateRange::nextQuarter() | Next quarter |
| nextYear | Next Year | DateRange::nextYear() | Next year |
| next14Days | Next 14 Days | DateRange::next14Days() | Next 14 days from today |
| next30Days | Next 30 Days | DateRange::next30Days() | Next 30 days from today |
| next3Months | Next 3 Months | DateRange::next3Months() | Next 3 months from today |
| next6Months | Next 6 Months | DateRange::next6Months() | Next 6 months from today |
| allTime | All Time | DateRange::allTime($start) | Minimum supplied date to today |
| custom | Custom Range | DateRange::custom() | User-defined date range |

## All time

When using the allTime preset, you must specify a minimum date using the min prop. This minimum date will be used as the start date of the "All Time" range. Today's date will be used as the end date:

```blade
<flux:date-picker
    mode="range"
    presets="... allTime"
    :min="auth()->user()->created_at->format('Y-m-d')"
/>
```

If you need to construct this via the DateRange object from Livewire, you can do so like this:

```
use Flux\DateRange;

$this->range = DateRange::allTime(start: auth()->user()->created_at);
```

If you are using this date range to filter data, you may want to remove "where" constraints from the query when allTime is selected:

```
$orders = Order::when($this->range->isNotAllTime(), function ($query) => {
    $query->whereBetween('created_at', $this->range);
})->get();
```

## Custom range preset

When a user selects a custom date range that doesn't match any other preset, the picker will automatically switch to the custom preset if it is included in the presets prop.

```blade
<flux:date-picker mode="range" presets="... custom" />
```

## Unavailable dates
Disable specific dates from being selected. Useful for blocking out holidays, showing booked dates, or indicating unavailable time slots.

```blade
<flux:date-picker unavailable="2026-03-03,2026-03-05" />
```

## With today shortcut
Add a shortcut button to quickly navigate to today's date. When viewing a different month, it jumps to the current month. When already viewing the current month, it selects today's date.

```blade
<flux:date-picker with-today />
```

## Selectable header
Enable quick navigation by making the month and year in the header selectable.

```blade
<flux:date-picker selectable-header />
```

## Fixed weeks
Display a consistent number of weeks in every month. Prevents layout shifts when navigating between months with different numbers of weeks.

```blade
<flux:date-picker fixed-weeks />
```

## Start day
By deafult the first day of the week will be automatically set based on the user's locale. You can override this by setting the start-day attribute to any day of the week.

```blade
<flux:date-picker start-day="1" />
```

## Open to
Set the date that the date picker will open to, if there is no selected date.

```blade
<flux:date-picker open-to="2027-04-01" />
```

If you want the date picker to always use the open-to date, you can add the force-open-to attribute.

```blade
<flux:date-picker open-to="2027-04-01" force-open-to />
```

## Week numbers
Display the week number for each week.

```blade
<flux:date-picker week-numbers />
```

## Localization
By default, the date picker will use the browser's locale (e.g. navigator.language).

You can override this behavior by setting the locale attribute to any valid locale string (e.g. fr for French, en-US for English, etc.):

```blade
<flux:date-picker locale="ja-JP" />
```

## The DateRange object

Flux provides a specialized Flux\\DateRange object that extends the native CarbonPeriod class. This object provides a number of convenience methods to easily create and manage date ranges.

First, it's worth noting that most of the time, you will want to use wire:model.live to bind the range property to a DateRange object. This will automatically update the range property whenever the user selects a date range:

```blade
<flux:calendar wire:model.live="range" />
```

Now, in your component, you can type hint the range property as a DateRange object:

```
<?php

use Livewire\Component;
use Flux\DateRange;

class Dashboard extends Component {
    public DateRange $range;
}
```

## Instantiation

You can initialize a DateRange object by passing a start and end date to the DateRange constructor from something like the mount method:

```
<?php

use Livewire\Component;
use Flux\DateRange;

class Dashboard extends Component {
    public DateRange $range;

    public function mount() {
        $this->range = new DateRange(now(), now()->addDays(7));
    }
}
```

## Persisting to the session

You can persist a DateRange object in the user's session by using the #\[Session\] attribute:

```
<?php

use Livewire\Attributes\Session;
use Livewire\Component;
use Flux\DateRange;

class Dashboard extends Component {
    #[Session]
    public DateRange $range;
}
```

## Using with Eloquent

You can use the DateRange object with Eloquent's whereBetween() method to filter queries by date range:

```
<?php

use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\Order;
use Flux\DateRange;

class Dashboard extends Component {
    public ?DateRange $range;

    #[Computed]
    public function orders() {
        return $this->range
            ? Order::whereBetween('created_at', $this->range)->get()
            : Order::all();
    }
}
```

## Available methods

The DateRange object extends the native CarbonPeriod class, so it inherits all of its methods. Here are a few examples:

```
$range = new Flux\DateRange(
    now()->subDays(1),
    now()->addDays(1),
);

// Get the start and end dates as Carbon instances...
$start = $range->start();
$end = $range->end();

// Check if the range contains a date...
$range->contains(now());

// Get the number of days in the range...
$range->length();

// Loop over the range by day...
foreach ($range as $date) {
    // $date is a Carbon instance...
}

// Get the range as an array of Carbon instances representing each day in the range...
$range->toArray();
```

You can also use it anywhere Eloquent utilities expect a CarbonPeriod instance:

```
$orders = Order::whereBetween('created_at', $range)->get();
```

## Range presets

When using the presets prop, the calendar will get/set an associative array of dates as well as a preset key:

```
[
    'start' => null,
    'end' => null,
    'preset' => 'lastMonth',
]
```

You can directly get/set the preset string through a simple array binding:

```
<?php

use Livewire\Component;

class Dashboard extends Component {
    public array $range;

    public function mount() {
        $this->range = [
            'start' => null,
            'end' => null,
            'preset' => 'lastMonth',
        ];
    }
}
```

However, the DateRange object is equipped to manage the preset internally.

For example, you can create a range using the lastMonth() method:

```
<?php

use Livewire\Component;
use Flux\DateRange;

class Dashboard extends Component {
    public DateRange $range;

    public function mount() {
        $this->range = DateRange::lastMonth();
    }
}
```

[View the complete list of available presets ->](#available-presets)

You can access the preset as an enum value via the preset() method:

```
$this->range->preset();

// This will return a value like `DateRangePreset::LastMonth`...
```

## Reference

### flux:date-picker
| Prop | Description |
| --- | --- |
| wire:model | Binds the date picker to a Livewire property. See the wire:model documentation for more information. |
| value | Selected date(s). Format depends on mode: single date (Y-m-d) or range (Y-m-d/Y-m-d). |
| mode | Selection mode. Options: single (default), range. |
| min-range | Minimum number of days that can be selected in range mode. |
| max-range | Maximum number of days that can be selected in range mode. |
| min | Earliest selectable date. Can be a date string or "today". |
| max | Latest selectable date. Can be a date string or "today". |
| unavailable | Comma-separated list of dates (in Y-m-d format) that cannot be selected. |
| open-to | Set the date that the date picker will open to, if there is no selected date. |
| force-open-to | If true, forces the date picker to open to the open-to date regardless of the selected date. Default: false. |
| months | Number of months to display. Default: 1 in single mode, 2 in range mode. |
| label | Label text displayed above the date picker. When provided, wraps the component in a flux:field with an adjacent flux:label. |
| description | Help text displayed below the date picker. When provided alongside label, appears between the label and date picker within the flux:field wrapper. |
| description:trailing | The description provided will be displayed below the date picker instead of above it. |
| badge | Badge text displayed at the end of the flux:label component when the label prop is provided. |
| placeholder | Placeholder text displayed when no date is selected. Default depends on mode. |
| size | Size of the calendar day cells. Options: sm, default, lg, xl, 2xl. |
| start-day | The day of the week to start the calendar on. Options: 0 (Sunday) to 6 (Saturday). Default: based on the user's locale. |
| week-numbers | If true, displays week numbers in the calendar. |
| selectable-header | If true, displays month and year dropdowns for quick navigation. |
| with-today | If true, displays a button to quickly navigate to today's date. |
| with-inputs | If true, displays date inputs at the top of the calendar for manual date entry. |
| with-confirmation | If true, requires confirmation before applying the selected date(s). |
| with-presets | If true, displays preset date ranges. Use with presets to customize available options. |
| presets | Space-separated list of preset date ranges to display. Default: today yesterday thisWeek last7Days thisMonth yearToDate allTime. |
| clearable | Displays a clear button when a date is selected. |
| disabled | Prevents user interaction with the date picker. |
| invalid | Applies error styling to the date picker. |
| locale | Set the locale for the date picker. Examples: fr, en-US, ja-JP. |

| Slot | Description |
| --- | --- |
| trigger | Custom trigger element to open the date picker. Usually a flux:date-picker.input or flux:date-picker.button. |

| Attribute | Description |
| --- | --- |
| data-flux-date-picker | Applied to the root element for styling and identification. |

### flux:date-picker.input
| Prop | Description |
| --- | --- |
| label | Label text displayed above the input. When provided, wraps the input in a flux:field component with an adjacent flux:label component. |
| description | Help text displayed below the input. When provided alongside label, appears between the label and input within the flux:field wrapper. |
| placeholder | Placeholder text displayed when no date is selected. |
| clearable | Displays a clear button when a date is selected. |
| disabled | Prevents user interaction with the input. |
| invalid | Applies error styling to the input. |

### flux:date-picker.button
| Prop | Description |
| --- | --- |
| placeholder | Text displayed when no date is selected. |
| size | Size of the button. Options: sm, xs. |
| clearable | Displays a clear button when a date is selected. |
| disabled | Prevents user interaction with the button. |
| invalid | Applies error styling to the button. |

### DateRange Object
A specialized object for handling date ranges when using mode="range".

| Method | Description |
| --- | --- |
| $range->start() | Get the start date as a Carbon instance. |
| $range->end() | Get the end date as a Carbon instance. |
| $range->days() | Get the number of days in the range. |
| $range->preset() | Get the current preset as a DateRangePreset enum value. |
| $range->toArray() | Get the range as an array with start and end keys. |

| Static Method | Description |
| --- | --- |
| DateRange::today() | Create a DateRange for today. |
| DateRange::yesterday() | Create a DateRange for yesterday. |
| DateRange::thisWeek() | Create a DateRange for the current week. |
| DateRange::lastWeek() | Create a DateRange for the previous week. |
| DateRange::last7Days() | Create a DateRange for the last 7 days. |
| DateRange::last30Days() | Create a DateRange for the last 30 days. |
| DateRange::thisMonth() | Create a DateRange for the current month. |
| DateRange::lastMonth() | Create a DateRange for the previous month. |
| DateRange::thisQuarter() | Create a DateRange for the current quarter. |
| DateRange::lastQuarter() | Create a DateRange for the previous quarter. |
| DateRange::thisYear() | Create a DateRange for the current year. |
| DateRange::lastYear() | Create a DateRange for the previous year. |
| DateRange::yearToDate() | Create a DateRange from January 1st to today. |
| DateRange::tomorrow() | Create a DateRange for tomorrow. |
| DateRange::nextWeek() | Create a DateRange for next week. |
| DateRange::next7Days() | Create a DateRange for the next 7 days. |
| DateRange::next30Days() | Create a DateRange for the next 30 days. |
| DateRange::nextMonth() | Create a DateRange for next month. |
| DateRange::nextQuarter() | Create a DateRange for next quarter. |
| DateRange::nextYear() | Create a DateRange for next year. |
| DateRange::allTime() | Create a DateRange with no limits. |