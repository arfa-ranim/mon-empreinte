// src/hooks/useValidation.ts

import { useState, useCallback } from "react";

export type FormValue =
  | string
  | number
  | boolean
  | string[];

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: FormValue) => boolean | string;
  message?: string;
}

export type ValidationErrors = Record<string, string>;

export function useValidation<T extends Record<string, FormValue>>(
  initialValues: T,
  rules: Partial<Record<keyof T, ValidationRule>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      const rule = rules[name];

      if (!rule) return null;

      // Required validation
      if (rule.required) {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return rule.message || "Ce champ est requis";
        }
      }

      // Skip other validations if empty
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return null;
      }

      // String length validation
      if (
        rule.minLength &&
        typeof value === "string" &&
        value.length < rule.minLength
      ) {
        return rule.message || `Minimum ${rule.minLength} caractères`;
      }

      if (
        rule.maxLength &&
        typeof value === "string" &&
        value.length > rule.maxLength
      ) {
        return rule.message || `Maximum ${rule.maxLength} caractères`;
      }

      // Numeric validation
      const numericValue =
        typeof value === "number"
          ? value
          : typeof value === "string"
          ? Number(value)
          : NaN;

      if (
        rule.min !== undefined &&
        !isNaN(numericValue) &&
        numericValue < rule.min
      ) {
        return rule.message || `Minimum ${rule.min}`;
      }

      if (
        rule.max !== undefined &&
        !isNaN(numericValue) &&
        numericValue > rule.max
      ) {
        return rule.message || `Maximum ${rule.max}`;
      }

      // Regex validation
      if (
        rule.pattern &&
        typeof value === "string" &&
        !rule.pattern.test(value)
      ) {
        return rule.message || "Format invalide";
      }

      // Custom validation
      if (rule.validate) {
        const result = rule.validate(value);

        if (typeof result === "string") {
          return result;
        }

        if (result === false) {
          return rule.message || "Valeur invalide";
        }
      }

      return null;
    },
    [rules]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    for (const key of Object.keys(rules) as (keyof T)[]) {
      const error = validateField(key, values[key]);

      if (error) {
        newErrors[key as string] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validateField, values, rules]);

  const handleChange = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (touched[name as string]) {
        const error = validateField(name, value);

        setErrors((prev) => ({
          ...prev,
          [name as string]: error || "",
        }));
      }
    },
    [validateField, touched]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({
        ...prev,
        [name as string]: true,
      }));

      const error = validateField(name, values[name]);

      setErrors((prev) => ({
        ...prev,
        [name as string]: error || "",
      }));
    },
    [validateField, values]
  );

  const setFieldValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValues,
    setErrors,
    handleChange,
    handleBlur,
    validateAll,
    validateField,
    setFieldValue,
    reset,
  };
}