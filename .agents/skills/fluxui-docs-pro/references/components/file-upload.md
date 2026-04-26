---
components_used: [button, file-item, icon]
---

# File upload

A flexible file upload component with built-in drag-and-drop support, file previews, and Livewire integration for handling file uploads in your application.

```blade
<flux:file-upload wire:model="photos" multiple label="Upload files">
    <flux:file-upload.dropzone
        heading="Drop files here or click to browse"
        text="JPG, PNG, GIF up to 10MB"
    />
</flux:file-upload>

<div class="mt-4 flex flex-col gap-2">
    <flux:file-item
        heading="Profile_pic.jpg"
        image="https://fluxui.dev/img/demo/user.png"
        size="162400"
    >
        <x-slot name="actions">
            <flux:file-item.remove />
        </x-slot>
    </flux:file-item>
</div>
```

## Inline layout
For a more compact interface, use the inline prop on the dropzone to create a horizontal layout that takes up less vertical space.

```blade
<flux:file-upload wire:model="photos" multiple label="Upload files">
    <flux:file-upload.dropzone
        heading="Drop files or click to browse"
        text="JPG, PNG, GIF up to 10MB"
        inline
    />
</flux:file-upload>

<div class="mt-3 flex flex-col gap-2">
    <flux:file-item heading="Profile_pic.jpg">
        <x-slot name="actions">
            <flux:file-item.remove />
        </x-slot>
    </flux:file-item>

    <flux:file-item heading="Brand_banner.jpg">
        <x-slot name="actions">
            <flux:file-item.remove />
        </x-slot>
    </flux:file-item>
</div>
```

## Progress indicator
Use the with-progress on the dropzone to show a progress indicator while the file is uploading.

The text prop is required with the progress indicator.

```blade
<flux:file-upload wire:model="photos" multiple label="Upload files">
    <flux:file-upload.dropzone
        heading="Drop files or click to browse"
        text="JPG, PNG, GIF up to 10MB"
        with-progress
        inline
    />
</flux:file-upload>
```

When using with-progress, the component provides two CSS variables that you can use for custom progress implementations:

-   \--flux-file-upload-progress - The progress percentage as a decimal (e.g., "42%")
-   \--flux-file-upload-progress-as-string - The progress percentage as a quoted string (e.g., "'42%'")

These variables are automatically updated during upload and can be used in your custom CSS to create progress bars, circular indicators, or any other visual feedback you need.

## Disabled state
Use the disabled prop to prevent user interaction with the file upload component. When disabled, the dropzone becomes unclickable, drag-and-drop is disabled, and the UI appears in a muted state to indicate it's inactive.

```blade
<flux:file-upload wire:model="photos" multiple label="Upload files" disabled>
    <flux:file-upload.dropzone
        heading="Drop files or click to browse"
        text="JPG, PNG, GIF up to 10MB"
        inline
    />
</flux:file-upload>
```

## Custom uploader
The flux:file-upload wrapper handles all the complex file upload functionality - drag and drop, file selection, and upload progress. You can place any custom HTML inside it to completely customize the appearance while maintaining all the upload behavior.

Here's an example of a custom avatar uploader:

```blade
<flux:file-upload wire:model="photo">
    <!-- Custom avatar uploader -->
    <div class="
        relative flex items-center justify-center size-20 rounded-full transition-colors cursor-pointer
        border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/10
        bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 hover:dark:bg-white/15 in-data-dragging:dark:bg-white/15
    ">
        <!-- Show the uploaded file if it exists -->
        @if ($photo)
            <img src="{{ $photo?->temporaryUrl() }}" class="size-full object-cover rounded-full" />
        @else
            <!-- Show the default icon if no file is uploaded -->
            <flux:icon name="user" variant="solid" class="text-zinc-500 dark:text-zinc-400" />
        @endif

        <!-- Corner upload icon -->
        <div class="absolute bottom-0 right-0 bg-white dark:bg-zinc-800 rounded-full">
            <flux:icon name="arrow-up-circle" variant="solid" class="text-zinc-500 dark:text-zinc-400" />
        </div>
    </div>
</flux:file-upload>
```

The file upload wrapper automatically provides data attributes you can use to style your custom uploader:

-   data-dragging - Present when a file is being dragged over the upload area
-   data-loading - Present while files are being uploaded

These attributes can be targeted with CSS using the in-data-dragging: and in-data-loading: utility prefixes to create dynamic visual feedback during drag and upload states.

## Livewire integration
The file upload component seamlessly integrates with Livewire's file upload functionality. Use the wire:model directive to bind uploaded files to your Livewire component properties.

### Single file upload
For single file uploads, bind directly to a property and handle the uploaded file display and removal.

```
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class FileUpload extends Component {
    use WithFileUploads;

    #[Validate('image|max:10240')] // 10MB Max
    public $photo;

    public function removePhoto()
    {
        $this->photo->delete();

        $this->photo = null;
    }

    public function save()
    {
        $this->photo->store(path: 'photos');

        return $this->redirect('...');
    }
}
blade
<!-- Blade view: -->

<form wire:submit="save">
    <flux:file-upload wire:model="photo" label="Upload file">
        <flux:file-upload.dropzone heading="Drop file here or click to browse" text="JPG, PNG, GIF up to 10MB" />
    </flux:file-upload>

    <div class="mt-3 flex flex-col gap-2">
        @if ($photo)
            <flux:file-item
                :heading="$photo->getClientOriginalName()"
                :image="$photo->temporaryUrl()"
                :size="$photo->getSize()"
            >
                <x-slot name="actions">
                    <flux:file-item.remove wire:click="removePhoto" aria-label="{{ 'Remove file: ' . $photo->getClientOriginalName() }}" />
                </x-slot>
            </flux:file-item>
        @endif
    </div>

    <flux:button type="submit">Save</flux:button>
</form>
```

### Multiple files upload
Handle multiple file uploads by using an array property and the multiple attribute.

```
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class FileUpload extends Component {
    use WithFileUploads;

    #[Validate(['photos.*' => 'image|max:1024'])]
    public $photos = [];

    public function removePhoto($index)
    {
        $photo = $this->photos[$index];

        $photo->delete();

        unset($this->photos[$index]);

        $this->photos = array_values($this->photos);
    }

    public function save()
    {
        foreach ($this->photos as $photo) {
            $photo->store(path: 'photos');
        }

        return $this->redirect('...');
    }
}
blade
<!-- Blade view: -->
<form wire:submit="save">
    <flux:file-upload wire:model="photos" label="Upload files" multiple>
        <flux:file-upload.dropzone heading="Drop files here or click to browse" text="JPG, PNG, GIF up to 10MB" />
    </flux:file-upload>

    <div class="mt-3 flex flex-col gap-2">
        @foreach ($photos as $index => $photo)
            <flux:file-item
                :heading="$photo->getClientOriginalName()"
                :image="$photo->temporaryUrl()"
                :size="$photo->getSize()"
            >
                <x-slot name="actions">
                    <flux:file-item.remove wire:click="removePhoto({{ $index }})" aria-label="{{ 'Remove file: ' . $photo->getClientOriginalName() }}" />
                </x-slot>
            </flux:file-item>
        @endforeach
    </div>

    <flux:button type="submit">Save</flux:button>
</form>
```

## Reference

### flux:file-upload
The main file upload container component that wraps the upload functionality and integrates with form fields.

| Prop | Description |
| --- | --- |
| name | The input name attribute for form submissions. |
| multiple | If present, allows selecting and uploading multiple files. Default: false. |
| label | Field label text displayed above the upload area. |
| description | Helper text displayed below the field. |
| error | Error message to display for validation failures. |
| disabled | If present, prevents user interaction with the file upload. Default: false. |

| Livewire directive | Description |
| --- | --- |
| wire:model | Binds the file upload to a Livewire property for handling uploaded files. |

| Data attributes | Description |
| --- | --- |
| data-dragging | Automatically added when files are being dragged over the component. Use with Tailwind's in-data-dragging: prefix for styling. |
| data-loading | Automatically added while files are being uploaded. Use with Tailwind's in-data-loading: prefix for styling. |

### flux:file-upload.dropzone
The visual drop zone area where users can drag and drop files or click to browse for files.

| Prop | Description |
| --- | --- |
| heading | Main text displayed in the dropzone area. |
| text | Supporting text displayed below the heading (e.g., file type and size restrictions). |
| icon | Icon name to display in the dropzone. Default: cloud-arrow-up. |
| inline | If present, displays the dropzone in a compact horizontal layout. Default: false. |
| with-progress | If present, shows a progress bar during file uploads instead of just a loading spinner. Requires the text prop to be defined. Default: false. |

| CSS variables | Description |
| --- | --- |
| --flux-file-upload-progress | The upload progress percentage (e.g., "42%"). Available when using with-progress. |
| --flux-file-upload-progress-as-string | The upload progress as a quoted string (e.g., "'42%'"). Available when using with-progress. |

| Data attributes | Description |
| --- | --- |
| data-dragging | Present on the file upload element when files are being dragged over the drop zone. |
| data-loading | Present on the file upload element while files are being uploaded. |

### flux:file-item
Displays an uploaded file with optional preview image, file details, and actions.

| Prop | Description |
| --- | --- |
| heading | The file name or title to display. |
| text | Additional text to display (automatically calculated from size if not provided). |
| image | URL or path to a preview image for the file. |
| size | File size in bytes. Automatically formatted to B, KB, MB, or GB. |
| icon | Icon to display when no image is provided. Default: document. |
| invalid | If present, displays the file item in an error state. Default: false. |

| Slot | Description |
| --- | --- |
| actions | Slot for action buttons like remove, download, or preview. |

### flux:file-item.remove
A pre-styled remove button for file items that can be wired to removal actions.

| Livewire directive | Description |
| --- | --- |
| wire:click | Triggers a Livewire method to remove the file when clicked. |
| aria-label | The aria-label to use for the remove button. |