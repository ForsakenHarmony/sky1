import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";

export const FormContext = createContext(null);
export const Form = FormContext.Provider;
export const Consumer = FormContext.Consumer;

export function useField() {
  const form = useContext(FormContext);

  const props = {};

  return props;
}
