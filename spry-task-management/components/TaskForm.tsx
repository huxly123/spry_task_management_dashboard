"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  hasErrors,
  validateTaskInput,
  type TaskFormErrors,
} from "@/lib/validation";
import {
  STATUS_LABELS,
  TASK_STATUSES,
  type Task,
  type TaskInput,
  type TaskStatus,
} from "@/types/task";

interface TaskFormProps {
  initialValues?: Task;
  defaultStatus?: TaskInput["status"];
  submitLabel: string;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
}

const emptyInput: TaskInput = {
  title: "",
  description: "",
  status: "pending",
  dueDate: "",
};

export function TaskForm({
  initialValues,
  defaultStatus = "pending",
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskInput>(() =>
    initialValues
      ? {
          title: initialValues.title,
          description: initialValues.description,
          status: initialValues.status,
          dueDate: initialValues.dueDate.slice(0, 10),
        }
      : { ...emptyInput, status: defaultStatus },
  );
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof TaskInput, boolean>>
  >({});

  function handleChange<K extends keyof TaskInput>(
    field: K,
    value: TaskInput[K],
  ) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) {
      setErrors(validateTaskInput(next));
    }
  }

  function handleBlur(field: keyof TaskInput) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateTaskInput(values));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = validateTaskInput(values);
    setErrors(validation);
    setTouched({ title: true, dueDate: true, description: true, status: true });
    if (hasErrors(validation)) return;
    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field id="title" label="Title" required error={errors.title}>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          placeholder="e.g. Review quarterly report"
          className={inputClass(!!errors.title)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
      </Field>

      <Field id="description" label="Description" error={errors.description}>
        <textarea
          id="description"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          placeholder="Optional details about this task"
          rows={3}
          className={inputClass(!!errors.description)}
          aria-invalid={!!errors.description}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="status" label="Status">
          <select
            id="status"
            value={values.status}
            onChange={(e) =>
              handleChange("status", e.target.value as TaskStatus)
            }
            className={inputClass(false)}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>

        <Field id="dueDate" label="Due date" required error={errors.dueDate}>
          <input
            id="dueDate"
            type="date"
            value={values.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            onBlur={() => handleBlur("dueDate")}
            className={inputClass(!!errors.dueDate)}
            aria-invalid={!!errors.dueDate}
            aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <button type="submit" className={primaryButtonClass}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-sm text-rose-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
  }`;

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400";
