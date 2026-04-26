---
components_used: [button, heading, icon, input, modal, spacer, text]
---

# Select

Choose a single option from a dropdown list.

For lists of up to 5 items, consider using [checkboxes](/components/checkbox) or [radio buttons](/components/radio) instead.

```blade
<flux:select wire:model="industry" placeholder="Choose industry...">
    <flux:select.option>Photography</flux:select.option>
    <flux:select.option>Design services</flux:select.option>
    <flux:select.option>Web development</flux:select.option>
    <flux:select.option>Accounting</flux:select.option>
    <flux:select.option>Legal services</flux:select.option>
    <flux:select.option>Consulting</flux:select.option>
    <flux:select.option>Other</flux:select.option>
</flux:select>
```

## Small
A smaller select element for more compact layouts.

```blade
<flux:select size="sm" placeholder="Choose industry...">
    <flux:select.option>Photography</flux:select.option>
    <flux:select.option>Design services</flux:select.option>
    <flux:select.option>Web development</flux:select.option>
    <flux:select.option>Accounting</flux:select.option>
    <flux:select.option>Legal services</flux:select.option>
    <flux:select.option>Consulting</flux:select.option>
    <flux:select.option>Other</flux:select.option>
</flux:select>
```

## Custom select
An alternative to the browser's native select element. Typically used when you need custom option styling like icons, images, and other treatments.

This variant is only available in the Pro version of Flux.

[Upgrade to unlock ->](/pricing)

```blade
<flux:select variant="listbox" placeholder="Choose industry...">
    <flux:select.option>Photography</flux:select.option>
    <flux:select.option>Design services</flux:select.option>
    <flux:select.option>Web development</flux:select.option>
    <flux:select.option>Accounting</flux:select.option>
    <flux:select.option>Legal services</flux:select.option>
    <flux:select.option>Consulting</flux:select.option>
    <flux:select.option>Other</flux:select.option>
</flux:select>
```

## The button slot

If you need full control over the button used to trigger the custom select, you can use the button slot to render it yourself.

```blade
<flux:select variant="listbox">
    <x-slot name="button">
        <flux:select.button class="rounded-full!" placeholder="Choose industry..." :invalid="$errors->has('...')" />
    </x-slot>

    <flux:select.option>Photography</flux:select.option>
    ...
</flux:select>
```

## Clearable

If you want to make the selected value clearable, you can use the clearable prop to add an "x" button to the right side of the input:

```blade
<flux:select variant="listbox" clearable>
    ...
</flux:select>
```

## Options with images/icons

One distinct advantage of using a custom listbox select over the native <select> element is that you can now add icons and images to your options.

```blade
<flux:select variant="listbox" placeholder="Select role...">
    <flux:select.option>
        <div class="flex items-center gap-2">
            <flux:icon.shield-check variant="mini" class="text-zinc-400" /> Owner
        </div>
    </flux:select.option>

    <flux:select.option>
        <div class="flex items-center gap-2">
            <flux:icon.key variant="mini" class="text-zinc-400" /> Administrator
        </div>
    </flux:select.option>

    <flux:select.option>
        <div class="flex items-center gap-2">
            <flux:icon.user variant="mini" class="text-zinc-400" /> Member
        </div>
    </flux:select.option>

    <flux:select.option>
        <div class="flex items-center gap-2">
            <flux:icon.eye variant="mini" class="text-zinc-400" /> Viewer
        </div>
    </flux:select.option>
</flux:select>
```

## Searchable select
The searchable select variant makes navigating large option lists easier for your users.

This variant is only available in the Pro version of Flux.

[Upgrade to unlock ->](/pricing)

```blade
<flux:select variant="listbox" searchable placeholder="Choose industries...">
    <flux:select.option>Photography</flux:select.option>
    <flux:select.option>Design services</flux:select.option>
    <flux:select.option>Web development</flux:select.option>
    <flux:select.option>Accounting</flux:select.option>
    <flux:select.option>Legal services</flux:select.option>
    <flux:select.option>Consulting</flux:select.option>
    <flux:select.option>Other</flux:select.option>
</flux:select>
```

## The search slot

If you need full control over the search field inside the listbox, you can use the search slot to render it yourself.

```blade
<flux:select variant="listbox" searchable>
    <x-slot name="search">
        <flux:select.search class="px-4" placeholder="Search industries..." />
    </x-slot>

    ...
</flux:select>
```

## Multiple select
Allow your users to select multiple options from a list of options.

This variant is only available in the Pro version of Flux.

[Upgrade to unlock ->](/pricing)

```blade
<flux:select variant="listbox" multiple placeholder="Choose industries...">
    <flux:select.option>Photography</flux:select.option>
    <flux:select.option>Design services</flux:select.option>
    <flux:select.option>Web development</flux:select.option>
    <flux:select.option>Accounting</flux:select.option>
    <flux:select.option>Legal services</flux:select.option>
    <flux:select.option>Consulting</flux:select.option>
    <flux:select.option>Other</flux:select.option>
</flux:select>
```

## Selected suffix

By default, when more than one option is selected, the suffix " selected" will be appended to the number of selected options. You can customize this language by passing a selected-suffix prop to the select component.

```blade
<flux:select variant="listbox" selected-suffix="industries selected" multiple>
    ...
</flux:select>
```

If you pass a custom suffix, and need localization, you can use the \_\_() helper function to translate the suffix:

```blade
<flux:select variant="listbox" selected-suffix="{{ __('industries selected') }}" multiple>
    ...
</flux:select>
```

## Checkbox indicator

If you prefer a checkbox indicator instead of the default checkmark icon, you can use the indicator="checkbox" prop.

```blade
<flux:select variant="listbox" indicator="checkbox" multiple>
    ...
</flux:select>
```

## Clearing search

By default, a searchable select will clear the search input when the user selects an option. If you want to disable this behavior, you can use the clear="close" prop to only clear the search input when the user closes the select.

```blade
<flux:select variant="listbox" searchable multiple clear="close">
    ...
</flux:select>
```

## Combobox
A versatile combobox that can be used for anything from basic autocomplete to complex multi-selects.

This variant is only available in the Pro version of Flux.

[Upgrade to unlock ->](/pricing)

```blade
<flux:select variant="combobox" placeholder="Choose industry...">
    <flux:select.option>Photography</flux:select.option>
    <flux:select.option>Design services</flux:select.option>
    <flux:select.option>Web development</flux:select.option>
    <flux:select.option>Accounting</flux:select.option>
    <flux:select.option>Legal services</flux:select.option>
    <flux:select.option>Consulting</flux:select.option>
    <flux:select.option>Other</flux:select.option>
</flux:select>
```

## The input slot

If you need full control over the input element used to trigger the combobox, you can use the input slot to render it yourself.

```blade
<flux:select variant="combobox">
    <x-slot name="input">
        <flux:select.input x-model="search" :invalid="$errors->has('...')" />
    </x-slot>

    ...
</flux:select>
```

## Backend search
If you want to dynamically generate options on the server, you can use the :filter="false" prop to disable client-side filtering.

This variant is only available in the Pro version of Flux.

[Upgrade to unlock ->](/pricing)

```blade
<flux:select wire:model="userId" variant="combobox" :filter="false">
    <x-slot name="input">
        <flux:select.input wire:model.live="search" />
    </x-slot>

    @foreach ($this->users as $user)
        <flux:select.option value="{{ $user->id }}" wire:key="{{ $user->id }}">
            {{ $user->name }}
        </flux:select.option>
    @endforeach
</flux:select>

<!--
public $search = '';

public $userId = null;

#[\Livewire\Attributes\Computed]
public function users() {
    return \App\Models\User::query()
        ->when($this->search, fn($query) => $query->where('name', 'like', '%' . $this->search . '%'))
        ->limit(20)
        ->get();
}
-->
```

## Create option
Allow users to the create new options using the <flux:select.option.create> component.

Flux will automatically hide the create option when the search input matches an existing item in the list. You can also specify the minimum number of characters required for the create option to appear using the min-length prop.

This variant is only available in the Pro version of Flux.

[Upgrade to unlock ->](/pricing)

```blade
<flux:select wire:model="projectId" variant="combobox">
    <x-slot name="input">
        <flux:select.input wire:model="search" placeholder="Start typing..." />
    </x-slot>

    @foreach ($this->projects as $project)
        <flux:select.option :wire:key="$project->id">{{ $project->name }}</flux:select.option>
    @endforeach

    <flux:select.option.create wire:click="createProject" min-length="2">
        Create "<span wire:text="search"></span>"
    </flux:select.option.create>
</flux:select>

<!--
public $search = '';

public $projectId = null;

public function createProject()
{
    $project = Project::create([
        'name' => $this->search,
    ]);

    $this->projectId = $project->id;
}
-->
```

### With backend search
If you're using :filter="false", make sure to adjust your query to always include the newly created item when the search input is cleared.

Flux will automatically disable the create option during requests to prevent duplicate entries and when the list is updated, it performs a uniqueness check on the frontend.

```blade
<flux:select wire:model="projectId" variant="combobox" :filter="false">
    <x-slot name="input">
        <flux:select.input wire:model.live="search" placeholder="Start typing..." />
    </x-slot>

    @foreach($this->projects as $project)
        <flux:select.option :value="$project->id">{{ $project->name }}</flux:select.option>
    @endforeach

    <flux:select.option.create wire:click="createProject" min-length="2">
        Create "<span wire:text="search"></span>"
    </flux:select.option.create>
</flux:select>

<!--
#[\Livewire\Attributes\Computed]
public function projects() {
    return Project::query()
        ->where('name', 'like', '%' . trim($this->search) . '%')
        ->limit(20)->get()
        ->when(blank($this->search) && $this->projectId, function ($results) {
            return Project::query()
                ->whereIn('id', [$this->projectId])
                ->whereNotIn('id', $results->pluck('id'))
                ->get()->merge($results);
        });
}
-->
```

## With listbox variant

If you're using the listbox variant with backend search, make sure to clear the search input after creation to prevent an additional request from being sent when the search input is cleared by the frontend.

```
public function createProject() {
    // Create logic...

    $this->search = '';
}
```

## Loading message

When then create option is hidden by the frontend but new results aren't available yet, Flux displays a special "Loading..." message. To customize this message, use the when-loading prop on the <flux:select.option.empty> component.

```blade
<flux:select wire:model="projectId" variant="combobox" :filter="false">
    ...

    <x-slot name="empty">
        <flux:select.option.empty when-loading="Loading projects...">
            No projects found.
        </flux:select.option.empty>
    </x-slot>
</flux:select>
```

### With validation
When you perform additional validation on the backend, the search input will indicate an invalid state when there are validation errors present. Make sure to reset the error bag when the user updates the input.

```blade
<flux:select wire:model="projectId" variant="combobox" :filter="false">
    <x-slot name="input">
        <flux:select.input wire:model.live="search" placeholder="Start typing..." />
    </x-slot>

    ...

    <flux:select.option.create wire:click="createProject" min-length="2">
        Create "<span wire:text="search"></span>"
    </flux:select.option.create>
</flux:select>

<!--
public function createProject() {
    $this->validate(['search' => 'required|unique:projects,name']);

    // Create logic...
}

public function updatedSearch() {
    $this->resetErrorBag('search');
}
-->
```

### With modal
Use the modal prop to specify a name of a modal and handle more complex creation workflows inside a form.

```blade
<flux:select wire:model="projectId" variant="listbox">
    @foreach($this->projects as $project)
        <flux:select.option :value="$project->id">{{ $project->name }}</flux:select.option>
    @endforeach

    <flux:select.option.create modal="create-project">Create new</flux:select.option>
</flux:select>

<flux:modal name="create-project" class="md:w-96">
    <form wire:submit="createProject" class="space-y-6">
        <div>
            <flux:heading size="lg">Create new project</flux:heading>
            <flux:text class="mt-2">Enter the name of the new project.</flux:text>
        </div>

        <flux:input wire:model="projectName" label="Name" placeholder="e.g. 'UX Research'" />

        <div class="flex">
            <flux:spacer />
            <flux:button type="submit" variant="primary">Create</flux:button>
        </div>
    </form>
</flux:modal>
```

## Reference

### flux:select
| Prop | Description |
| --- | --- |
| wire:model | Binds the select to a Livewire property. See the wire:model documentation for more information. |
| placeholder | Text displayed when no option is selected. |
| label | Label text displayed above the select. When provided, wraps the select in a flux:field component with an adjacent flux:label component. See the field component. |
| description | Help text displayed below the select. When provided alongside label, appears between the label and select within the flux:field wrapper. See the field component. |
| description:trailing | The description provided will be displayed below the select instead of above it. |
| badge | Badge text displayed at the end of the flux:label component when the label prop is provided. |
| size | Size of the select. Options: sm, xs. |
| variant | Visual style of the select. Options: default (native select), listbox, combobox. |
| multiple | Allows selecting multiple options (listbox variant only). |
| filter | If false, disables client-side filtering. |
| searchable | Adds a search input to filter options (listbox and combobox variants only). |
| empty | Message shown when no search results are found for searchable selects. Default: No results found. |
| clearable | Displays a clear button when an option is selected (listbox and combobox variants only). |
| selected-suffix | Text appended to the number of selected options in multiple mode (listbox variant only). |
| clear | When to clear the search input. Options: select (default), close (listbox and combobox variants only). |
| disabled | Prevents user interaction with the select. |
| invalid | Applies error styling to the select. |

| Slot | Description |
| --- | --- |
| default | The select options. |
| trigger | Custom trigger content. Typically the select.button or select.input component (listbox and combobox variants only). |
| empty | Custom content shown when no options are found for searchable selects. Typically the select.option.empty component (listbox and combobox variants only). |

| Attribute | Description |
| --- | --- |
| data-flux-select | Applied to the root element for styling and identification. |

### flux:select.option
| Prop | Description |
| --- | --- |
| value | Value associated with the option. |
| label | Text content displayed for the option. |
| selected-label | Text content displayed when the option is selected. |
| disabled | Prevents selecting the option. |

| Slot | Description |
| --- | --- |
| default | The option content (can include icons, images, etc. in listbox variant). |

### flux:select.option.create
| Prop | Description |
| --- | --- |
| min-length | Minimum number of characters required in the search input before displaying the create option. |
| modal | Name of the modal to open when the option is selected. |
| wire:click | Livewire action to call when the option is selected. |

### flux:select.option.empty
| Prop | Description |
| --- | --- |
| when-loading | Message displayed when options are loading. |

| Slot | Description |
| --- | --- |
| default | Message displayed when no options are found. |

### flux:select.button
| Prop | Description |
| --- | --- |
| placeholder | Text displayed when no option is selected. |
| invalid | Applies error styling to the button. |
| size | Size of the button. Options: sm, xs. |
| disabled | Prevents selecting the option. |
| clearable | Displays a clear button when an option is selected. |

### flux:select.input
| Prop | Description |
| --- | --- |
| placeholder | Text displayed when no option is selected. |
| invalid | Applies error styling to the input. |
| size | Size of the input. Options: sm, xs. |

### flux:select.search
| Prop | Description |
| --- | --- |
| placeholder | Placeholder text displayed when the input is empty. |
| icon | Name of the icon displayed at the start of the input. |
| clearable | Displays a clear button when the input has content. Default: true. |