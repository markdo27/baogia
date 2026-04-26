---
components_used: [button, heading, icon, input, modal, spacer, text]
---

# Pillbox

A multi-select component that displays selected items as removable "pills" that expand the input area as needed.

```blade
<flux:pillbox wire:model="selectedTags" multiple placeholder="Choose tags...">
    <flux:pillbox.option value="design">Design</flux:pillbox.option>
    <flux:pillbox.option value="development">Development</flux:pillbox.option>
    <flux:pillbox.option value="marketing">Marketing</flux:pillbox.option>
    <flux:pillbox.option value="sales">Sales</flux:pillbox.option>
    <flux:pillbox.option value="support">Support</flux:pillbox.option>
    <flux:pillbox.option value="engineering">Engineering</flux:pillbox.option>
    <flux:pillbox.option value="product">Product</flux:pillbox.option>
    <flux:pillbox.option value="operations">Operations</flux:pillbox.option>
</flux:pillbox>
```

## Small
A smaller pillbox element for more compact layouts.

```blade
<flux:pillbox size="sm" multiple placeholder="Choose tags...">
    <flux:pillbox.option value="design">Design</flux:pillbox.option>
    <flux:pillbox.option value="development">Development</flux:pillbox.option>
    <flux:pillbox.option value="marketing">Marketing</flux:pillbox.option>
    <flux:pillbox.option value="sales">Sales</flux:pillbox.option>
    <flux:pillbox.option value="support">Support</flux:pillbox.option>
    <flux:pillbox.option value="engineering">Engineering</flux:pillbox.option>
    <flux:pillbox.option value="product">Product</flux:pillbox.option>
    <flux:pillbox.option value="operations">Operations</flux:pillbox.option>
</flux:pillbox>
```

## Searchable
Add a search input to filter through large lists of options.

```blade
<flux:pillbox multiple searchable placeholder="Choose skills...">
    <flux:pillbox.option value="javascript">JavaScript</flux:pillbox.option>
    <flux:pillbox.option value="typescript">TypeScript</flux:pillbox.option>
    <flux:pillbox.option value="php">PHP</flux:pillbox.option>
    <flux:pillbox.option value="python">Python</flux:pillbox.option>
    <flux:pillbox.option value="ruby">Ruby</flux:pillbox.option>
    <flux:pillbox.option value="go">Go</flux:pillbox.option>
    <flux:pillbox.option value="rust">Rust</flux:pillbox.option>
    <flux:pillbox.option value="java">Java</flux:pillbox.option>
    <flux:pillbox.option value="csharp">C#</flux:pillbox.option>
    <flux:pillbox.option value="swift">Swift</flux:pillbox.option>
</flux:pillbox>
```

## Custom search placeholder

You can customize the search input placeholder:

```blade
<flux:pillbox multiple searchable search:placeholder="Filter skills...">
    ...
</flux:pillbox>
```

## With icons
Add icons to options for better visual recognition.

```blade
<flux:pillbox multiple placeholder="Choose platforms...">
    <flux:pillbox.option value="github">
        <div class="flex items-center gap-2">
            <flux:icon.code-bracket variant="mini" class="text-zinc-400" /> GitHub
        </div>
    </flux:pillbox.option>
    <flux:pillbox.option value="gitlab">
        <div class="flex items-center gap-2">
            <flux:icon.server variant="mini" class="text-zinc-400" /> GitLab
        </div>
    </flux:pillbox.option>
    <flux:pillbox.option value="bitbucket">
        <div class="flex items-center gap-2">
            <flux:icon.cloud variant="mini" class="text-zinc-400" /> Bitbucket
        </div>
    </flux:pillbox.option>
</flux:pillbox>
```

## Combobox
Display an input directly within the pillbox.

```blade
<flux:pillbox variant="combobox" multiple placeholder="Choose skills...">
    <flux:pillbox.option value="javascript">JavaScript</flux:pillbox.option>
    <flux:pillbox.option value="typescript">TypeScript</flux:pillbox.option>
    <flux:pillbox.option value="php">PHP</flux:pillbox.option>
    <flux:pillbox.option value="python">Python</flux:pillbox.option>
    <flux:pillbox.option value="ruby">Ruby</flux:pillbox.option>
    <flux:pillbox.option value="go">Go</flux:pillbox.option>
    <flux:pillbox.option value="rust">Rust</flux:pillbox.option>
    <flux:pillbox.option value="java">Java</flux:pillbox.option>
    <flux:pillbox.option value="csharp">C#</flux:pillbox.option>
    <flux:pillbox.option value="swift">Swift</flux:pillbox.option>
</flux:pillbox>
```

## Create option
Allow users to the create new options using the <flux:pillbox.option.create> component.

Flux will automatically hide the create option when the search input matches an existing item in the list. You can also specify the minimum number of characters required for the create option to appear using the min-length prop.

```blade
<flux:pillbox wire:model="selectedTags" variant="combobox" multiple>
    <x-slot name="input">
        <flux:pillbox.input wire:model="search" placeholder="Choose tags..." />
    </x-slot>

    @foreach ($this->tags as $tag)
        <flux:pillbox.option :value="$tag->id">{{ $tag->name }}</flux:pillbox.option>
    @endforeach

    <flux:pillbox.option.create wire:click="createTag" min-length="2">
        Create new "<span wire:text="search"></span>"
    </flux:pillbox.option.create>
</flux:pillbox>

<!--
public $search = '';

public $selectedTags = [];

public function createProject()
{
    $tag = Tag::create([
        'name' => $this->search,
    ]);

    $this->selectedTags[] = $tag->id;

    $this->search = '';
}
-->
```

### With backend search
If you're using :filter="false", make sure to adjust your query to always include the newly created item when the search input is cleared.

Flux will automatically disable the create option during requests to prevent duplicate entries and when the list is updated, it performs a uniqueness check on the frontend.

```blade
<flux:pillbox wire:model.live="selectedTags" variant="combobox" multiple :filter="false">
    <x-slot name="input">
        <flux:pillbox.input wire:model.live="search" placeholder="Choose tags..." />
    </x-slot>

    @foreach($this->tags as $tag)
        <flux:pillbox.option :value="$tag->id">{{ $tag->name }}</flux:pillbox.option>
    @endforeach

    <flux:pillbox.option.create wire:click="createTag" min-length="2">
        Create "<span wire:text="search"></span>"
    </flux:pillbox.option.create>
</flux:pillbox>

<!--
#[\Livewire\Attributes\Computed]
public function tags() {
    return \App\Models\Tag::query()
        ->where('name', 'like', '%' . trim($this->search) . '%')
        ->limit(20)->get()
        ->when(blank($this->search) && $this->selectedTags, function ($results) {
            return \App\Models\Tag::query()
                ->whereIn('id', $this->selectedTags)
                ->whereNotIn('id', $results->pluck('id'))
                ->get()->merge($results);
        });
}
-->
```

## Loading message

When then create option is hidden by the frontend but new results aren't available yet, Flux displays a special "Loading..." message. To customize this message, use the when-loading prop on the <flux:pillbox.option.empty> component.

```blade
<flux:pillbox wire:model="selectedTags" variant="combobox" multiple :filter="false">
    ...

    <x-slot name="empty">
        <flux:pillbox.option.empty when-loading="Loading tags...">
            No tags found.
        </flux:pillbox.option.empty>
    </x-slot>
</flux:pillbox>
```

### With validation
When you perform additional validation on the backend, the search input will indicate an invalid state when there are validation errors present. Make sure to reset the error bag when the user updates the input.

```blade
<flux:pillbox wire:model.live="selectedTags" variant="combobox" multiple placeholder="Choose tags..." :filter="false">
    <x-slot name="input">
        <flux:pillbox.input wire:model.live="search" placeholder="Choose tags..." />
    </x-slot>

    ...

    <flux:pillbox.option.create wire:click="createTag" min-length="2">
        Create "<span wire:text="search"></span>"
    </flux:pillbox.option.create>
</flux:pillbox>

<!--
public function createTag() {
    $this->validate(['search' => 'required|unique:tags,name']);

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
<flux:pillbox wire:model="projectId" variant="combobox" placeholder="Choose project...">
    <flux:pillbox.option.create modal="create-tag">Create new</flux:pillbox.option>

    @foreach($this->tags as $tag)
        <flux:pillbox.option :value="$tag->id">{{ $tag->name }}</flux:pillbox.option>
    @endforeach
</flux:pillbox>

<flux:modal name="create-tag" class="md:w-96">
    <form wire:submit="createTag" class="space-y-6">
        <div>
            <flux:heading size="lg">Create new tag</flux:heading>
            <flux:text class="mt-2">Enter the name of the new tag.</flux:text>
        </div>

        <flux:input wire:model="newTagName" label="Name" placeholder="e.g. 'Research'" />

        <div class="flex">
            <flux:spacer />
            <flux:button type="submit" variant="primary">Create</flux:button>
        </div>
    </form>
</flux:modal>
```

## Reference

### flux:pillbox
| Prop | Description |
| --- | --- |
| wire:model | Binds the pillbox to a Livewire property. The model should be an array to store multiple selected values. See the wire:model documentation for more information. |
| placeholder | Text displayed when no pills are selected. |
| label | Label text displayed above the pillbox. When provided, wraps the pillbox in a flux:field component with an adjacent flux:label component. See the field component. |
| description | Help text displayed below the pillbox. When provided alongside label, appears between the label and pillbox within the flux:field wrapper. |
| size | Size of the pillbox. Options: sm. |
| searchable | Adds a search input inside the dropdown to filter options. |
| search:placeholder | Custom placeholder text for the search input when searchable is true. |
| filter | If false, disables client-side filtering for dynamic server-side options. |
| disabled | Prevents user interaction with the pillbox. |
| invalid | Applies error styling to the pillbox border. |

| Slot | Description |
| --- | --- |
| default | The pillbox options. Should contain flux:pillbox.option components. |
| trigger | Custom trigger element for the dropdown. Replaces the default pill container. |
| search | Custom search input for the dropdown. Used when you need to wire up custom search behavior. |
| empty | Content shown when no options match the search query. Typically the pillbox.option.empty component. |

| Attribute | Description |
| --- | --- |
| data-flux-pillbox | Applied to the root element for styling and JavaScript behavior. |

### flux:pillbox.option
| Prop | Description |
| --- | --- |
| value | The value associated with this option. This is what gets stored in the model array when selected. |
| label | Text content displayed for the option. |
| selected-label | Text content displayed when the option is selected. |
| disabled | Prevents this option from being selected. |
| filterable | If false, this option won't be hidden by the search filter. Useful for "no results" messages. |

| Slot | Description |
| --- | --- |
| default | The option content. Can include text, icons, images, or any custom HTML. |

### flux:pillbox.option.create
| Prop | Description |
| --- | --- |
| min-length | Minimum number of characters required in the search input before displaying the create option. |
| modal | Name of the modal to open when the option is selected. |
| wire:click | Livewire action to call when the option is selected. |

### flux:pillbox.option.empty
| Prop | Description |
| --- | --- |
| when-loading | Message displayed when options are loading. |

| Slot | Description |
| --- | --- |
| default | Message displayed when no options are found. |

### flux:pillbox.search
| Prop | Description |
| --- | --- |
| placeholder | Placeholder text for the search input. Defaults to "Search...". |
| icon | Icon to display in the search input. Defaults to magnifying glass. |
| clearable | If true, shows a clear button when the search input has text. Default: true. |

### flux:pillbox.trigger
| Prop | Description |
| --- | --- |
| placeholder | Text displayed when no pills are selected. |
| invalid | Applies error styling to the trigger element. |
| size | Size of the trigger. Options: sm. |
| clearable | Shows a clear all button in the trigger. |