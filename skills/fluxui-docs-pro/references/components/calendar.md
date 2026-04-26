# Calendar

A flexible calendar component for date selection. Supports single dates, multiple dates, and date ranges. Perfect for scheduling and booking systems.

```blade
<flux:calendar />
```

## Basic Usage

Set the initial selected date using the value prop with a Y-m-d formatted date string:

```blade
<flux:calendar value="2026-03-04" />
```

You can also bind the selection to a Livewire property using wire:model:

```blade
<flux:calendar wire:model="date" />
```

Now you can access the selected date from your Livewire component using either a Carbon instance or a Y-m-d formatted string:

```
<?php

use Illuminate\Support\Carbon;
use Livewire\Component;

class BookAppointment extends Component {
    public Carbon $date;

    public function mount() {
        $this->date = now();
    }
}
```

## Multiple dates
Select multiple non-consecutive dates.

```blade
<flux:calendar multiple />
```

Set multiple selected dates using a comma-separated list in the value prop:

```blade
<flux:calendar
    multiple
    value="2026-03-02,2026-03-05,2026-03-15"
/>
```

You can also bind the selection to a Livewire property using wire:model:

```blade
<flux:calendar multiple wire:model="dates" />
```

You can access the selected dates in your Livewire component using an array of Y-m-d formatted date strings:

```
<?php

use Illuminate\Support\Carbon;
use Livewire\Component;

class RequestTimeOff extends Component {
    public array $dates = [];

    public function mount() {
        $this->dates = [
            now()->format('Y-m-d'),
            now()->addDays(1)->format('Y-m-d'),
        ];
    }
}
```

## Date range
Select a range of dates.

```blade
<flux:calendar mode="range" />
```

Set the initial range using the value prop with a start and end date separated by a forward slash:

```blade
<flux:calendar mode="range" value="2026-03-02/2026-03-06" />
```

You can also bind the selection to a Livewire property using wire:model:

```blade
<flux:calendar mode="range" wire:model="range" />
```

Now you can access the selected range from your Livewire component using an associative array of Y-m-d formatted date strings:

```
<?php

use Livewire\Component;

class BookFlight extends Component {
    public ?array $range;

    public function book() {
        // ...

        $flight->depart_on = $this->range['start'];
        $flight->return_on = $this->range['end'];

        // ...
    }
}
```

Alternatively, you can use the specialized DateRange object for enhanced functionality:

```
<?php

use Livewire\Component;
use Flux\DateRange;

class BookFlight extends Component {
    public ?DateRange $range;

    public function book() {
        // ...

        $flight->depart_on = $this->range->start();
        $flight->return_on = $this->range->end();

        // ...
    }
}
```

We highly recommend using the DateRange object for range selection, it provides a lot of useful functionality.

[Check out everything you can do with the DateRange object ->](#the-daterange-object)

## Range Configuration

Control range behavior with these props:

```blade
<!-- Set minimum and maximum range limits -->
<flux:calendar mode="range" min-range="3" max-range="10" />

<!-- Control number of months shown -->
<flux:calendar mode="range" months="2" />
```

## Size
Adjust the calendar's size to fit your layout. Available sizes include xs, sm, lg, xl, and 2xl.

```blade
<flux:calendar size="xl" />
```

## Static
Create a non-interactive calendar for display purposes.

```blade
<flux:calendar
    static
    value="2026-03-04"
    size="xs"
    :navigation="false"
/>
```

## Min/max dates
Restrict the selectable date range by setting minimum and maximum boundaries.

```blade
<flux:calendar max="2026-03-04" />
```

You can also use the convenient "today" shorthand:

```blade
<!-- Prevent selection before today... -->
<flux:calendar min="today" />

<!-- Prevent selection after today... -->
<flux:calendar max="today" />
```

## Unavailable dates
Disable specific dates from being selected. Useful for blocking out holidays, showing booked dates, or indicating unavailable time slots.

```blade
<flux:calendar unavailable="2026-03-03,2026-03-05" />
```

## With today shortcut
Add a shortcut button to quickly navigate to today's date. When viewing a different month, it jumps to the current month. When already viewing the current month, it selects today's date.

```blade
<flux:calendar with-today />
```

## Selectable header
Enable quick navigation by making the month and year in the header selectable.

```blade
<flux:calendar selectable-header />
```

## Fixed weeks
Display a consistent number of weeks in every month. Prevents layout shifts when navigating between months with different numbers of weeks.

```blade
<flux:calendar fixed-weeks />
```

## Start day
By default, the first day of the week will be automatically set based on the user's locale. You can override this by setting the start-day attribute to any day of the week.

```blade
<flux:calendar start-day="1" />
```

## Open to
Set the date that the calendar will open to, if there is no selected date.

```blade
<flux:calendar open-to="2027-04-01" />
```

If you want the calendar to always use the open-to date, you can add the force-open-to attribute.

```blade
<flux:calendar open-to="2027-04-01" force-open-to />
```

## Week numbers
Display the week number for each week.

```blade
<flux:calendar week-numbers />
```

## Localization
By default, the calendar will use the browser's locale (e.g. navigator.language).

You can override this behavior by setting the locale attribute to any valid locale string (e.g. fr for French, en-US for English, etc.):

```blade
<flux:calendar locale="ja-JP" />
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

## Reference

### flux:calendar
| Prop | Description |
| --- | --- |
| wire:model | Binds the calendar to a Livewire property. See the wire:model documentation for more information. |
| value | Selected date(s). Format depends on mode: single date (Y-m-d), multiple dates (comma-separated Y-m-d), or range (Y-m-d/Y-m-d). |
| mode | Selection mode. Options: single (default), multiple, range. |
| min | Earliest selectable date. Can be a date string or "today". |
| max | Latest selectable date. Can be a date string or "today". |
| unavailable | Comma-separated list of dates (in Y-m-d format) that cannot be selected. |
| size | Calendar size. Options: base (default), xs, sm, lg, xl, 2xl. |
| start-day | The day of the week to start the calendar on. Options: 0 (Sunday) to 6 (Saturday). Default: based on the user's locale. |
| months | Number of months to display. Default: 1 for single/multiple modes, 2 for range mode. |
| min-range | Minimum number of days that can be selected in range mode. |
| max-range | Maximum number of days that can be selected in range mode. |
| open-to | Set the date that the calendar will open to, if there is no selected date. |
| force-open-to | If true, forces the calendar to open to the open-to date regardless of the selected date. Default: false. |
| navigation | If false, hides month navigation controls. Default: true. |
| static | If true, makes the calendar non-interactive (display-only). Default: false. |
| multiple | If true, enables multiple date selection mode. Default: false. |
| week-numbers | If true, displays week numbers in the calendar. Default: false. |
| selectable-header | If true, displays month and year dropdowns for quick navigation. Default: false. |
| with-today | If true, displays a button to quickly navigate to today's date. Default: false. |
| with-inputs | If true, displays date inputs at the top of the calendar for manual date entry. Default: false. |
| locale | Set the locale for the calendar. Examples: fr, en-US, ja-JP. |

| Attribute | Description |
| --- | --- |
| data-flux-calendar | Applied to the root element for styling and identification. |

### DateRange Object
A specialized object for handling date ranges when using \`mode="range"\`.

| Method | Description |
| --- | --- |
| $range->start() | Get the start date as a Carbon instance. |
| $range->end() | Get the end date as a Carbon instance. |
| $range->days() | Get the number of days in the range. |
| $range->contains(date) | Check if the range contains a specific date. |
| $range->length() | Get the length of the range in days. |
| $range->toArray() | Get the range as an array with start and end keys. |
| $range->preset() | Get the current preset as a DateRangePreset enum value, if any. |

| Static Method | Description |
| --- | --- |
| DateRange::today() | Create a DateRange for today. |
| DateRange::yesterday() | Create a DateRange for yesterday. |
| DateRange::thisWeek() | Create a DateRange for the current week. |
| DateRange::lastWeek() | Create a DateRange for the previous week. |
| DateRange::last7Days() | Create a DateRange for the last 7 days. |
| DateRange::thisMonth() | Create a DateRange for the current month. |
| DateRange::lastMonth() | Create a DateRange for the previous month. |
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