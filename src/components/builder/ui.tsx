"use client";
import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

export const inputCls =
  "block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-brand/15 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/15";

export function Field({
  label,
  hint,
  error,
  optional,
  children,
  id,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-sm font-medium text-stone-800">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-stone-400">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
}

type TextProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
  optional?: boolean;
};

export function TextField({ label, value, onChange, hint, error, optional, className, ...rest }: TextProps) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${inputCls} ${className ?? ""}`}
        {...rest}
      />
    </Field>
  );
}

type AreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> & {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
  optional?: boolean;
};

export function TextArea({ label, value, onChange, hint, error, optional, rows = 4, ...rest }: AreaProps) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={`${inputCls} resize-y leading-relaxed`}
        {...rest}
      />
    </Field>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      {icon && (
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-cream text-2xl">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block font-medium text-stone-900">
          {label}
        </label>
        {description && <p className="text-sm text-stone-500">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 ${
          checked ? "bg-brand" : "bg-stone-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : ""}`}
        />
      </button>
    </div>
  );
}

export function SectionCard({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-3xl border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6">
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && <h3 className="font-display text-lg font-semibold text-stone-900">{title}</h3>}
          {actions}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
