---
components_used: [button, card, heading, otp, text]
---

# OTP Input

Capture one-time passwords with a series of individual input fields.

```blade
<flux:otp wire:model="code" length="6" />
```

## Example usage
Display a form for verifying one-time passwords.

```blade
<flux:card>
    <form wire:submit="verify" class="space-y-8">
        <div class="max-w-64 mx-auto space-y-2">
            <flux:heading size="lg" class="text-center">Verify your account</flux:heading>
            <flux:text class="text-center">Please enter a one-time password from the authenticator app.</flux:text>
        </div>

        <flux:otp wire:model="code" length="6" label="OTP Code" label:sr-only :error:icon="false" error:class="text-center" class="mx-auto" />

        <div class="space-y-4">
            <flux:button variant="primary" type="submit" class="w-full">Verify</flux:button>
            <flux:button wire:click="resend" class="w-full">Resend code</flux:button>
        </div>
    </form>
</flux:card>
```

## Autosubmit
Use the submit="auto" prop to automatically submit the form once all input fields are filled.

```blade
<form wire:submit="verify" class="space-y-8">
    <div class="max-w-64 mx-auto space-y-2">
        <flux:heading size="lg" class="text-center">Verify your account</flux:heading>
        <flux:text class="text-center">Please enter a one-time password from the authenticator app.</flux:text>
    </div>

    <div class="space-y-6">
        <flux:otp wire:model="code" length="6" submit="auto" class="mx-auto" />
    </div>
</form>
```

## Alphanumeric
Allow non-numeric characters by setting the mode to alphanumeric or alpha.

```blade
<flux:otp wire:model="licenseKey" length="10" mode="alphanumeric" label="License key" description:trailing="Enter the license key printed on the installation disc" />
```

## Private
To mask sensitive input values, use the private prop.

```blade
<flux:otp wire:model="pin" length="4" private label="PIN Code" />
```

## Separator
Use the default slot to render input fields with a separator in between them.

```blade
<flux:otp wire:model="code">
    <flux:otp.input />
    <flux:otp.input />
    <flux:otp.input />
    <flux:otp.separator />
    <flux:otp.input />
    <flux:otp.input />
    <flux:otp.input />
</flux:otp>
```

## Group
Group all input fields together using the flux:otp.group component.

```blade
<flux:otp wire:model="code">
    <flux:otp.group>
        <flux:otp.input />
        <flux:otp.input />
        <flux:otp.input />
        <flux:otp.input />
        <flux:otp.input />
        <flux:otp.input />
    </flux:otp.group>
</flux:otp>
```

## Group separator
Add a separator between groups of input fields using the flux:otp.separator component.

```blade
<flux:otp wire:model="code">
    <flux:otp.group>
        <flux:otp.input />
        <flux:otp.input />
        <flux:otp.input />
    </flux:otp.group>

    <flux:otp.separator />

    <flux:otp.group>
        <flux:otp.input />
        <flux:otp.input />
        <flux:otp.input />
    </flux:otp.group>
</flux:otp>
```

## Reference

### flux:otp
| Prop | Description |
| --- | --- |
| wire:model | Binds the value to a Livewire property. See the wire:model documentation for more information. |
| value | The current value as a string. |
| length | The number of input fields to display. |
| mode | The input mode. Can be numeric (default), alphanumeric, or alpha. |
| private | Sets the input fields to private type to mask the input values. |
| submit | Keyboard behavior for form submission. Options: (default), auto to submit when all fields are filled. |
| autocomplete | Sets the autocomplete attribute for the first input field. Use off to disable browser autofill. Default: one-time-code. |

| Slot | Description |
| --- | --- |
| default | Custom input fields and separators. When used, the length prop is ignored. |

### flux:otp.input
| Prop | Description |
| --- | --- |
| — | — |

### flux:otp.separator
| Prop | Description |
| --- | --- |
| — | — |

### flux:otp.group
| Slot | Description |
| --- | --- |
| Default | The input fields to include in the group. |