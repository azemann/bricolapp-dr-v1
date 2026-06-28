import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section className={`card ${className || ""}`.trim()}>{children}</section>
);

export const Button = ({
  children,
  onClick,
  variant = "default",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "danger";
  type?: "button" | "submit" | "reset";
}) => (
  <button type={type} className={`btn btn-${variant}`} onClick={onClick}>
    {children}
  </button>
);

export const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="field">
    <span className="field-label">{label}</span>
    {children}
    {hint ? <span className="field-hint">{hint}</span> : null}
  </label>
);

export const TextInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
}) => (
  <input
    className="input"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    type={type}
  />
);

export const NumericInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <input
    className="input"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    inputMode="decimal"
  />
);

export const Chip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button className={`chip ${active ? "chip-active" : ""}`.trim()} onClick={onClick}>
    {label}
  </button>
);

export const InlineGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-grid">{children}</div>
);
