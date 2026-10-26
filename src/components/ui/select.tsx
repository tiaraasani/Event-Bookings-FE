import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "cn";

export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4 shrink-0 text-brand-muted"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4 text-brand-orange"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4L8.5 12l6.8-6.7a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Select({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  disabled,
  className,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <SelectPrimitive.Root
      value={value === "" ? null : value}
      onValueChange={(next) => onValueChange(next ?? "")}
      items={options}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-brand-disabled/80 bg-white px-3.5 text-left text-sm text-brand-text shadow-sm outline-none transition hover:border-brand-navy/40 focus-visible:border-brand-orange focus-visible:ring-4 focus-visible:ring-brand-orange/15 data-[popup-open]:border-brand-orange data-[popup-open]:ring-4 data-[popup-open]:ring-brand-orange/15 disabled:cursor-not-allowed disabled:border-brand-disabled disabled:bg-brand-disabled/40 disabled:text-brand-muted",
          className,
        )}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
          className="truncate data-[placeholder]:text-brand-muted/70"
        />
        <SelectPrimitive.Icon>
          <ChevronIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          sideOffset={6}
          className="isolate z-50 outline-none"
        >
          <SelectPrimitive.Popup className="max-h-(--available-height) w-(--anchor-width) min-w-40 origin-(--transform-origin) overflow-y-auto rounded-xl border border-brand-navy/10 bg-white p-1.5 text-brand-navy shadow-xl shadow-brand-navy/15 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex cursor-default items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-brand-text outline-none select-none data-highlighted:bg-brand-neutral data-highlighted:text-brand-navy data-selected:font-semibold data-selected:text-brand-navy"
              >
                <SelectPrimitive.ItemText className="truncate">
                  {option.label}
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <CheckIcon />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export { Select };
