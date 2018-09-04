import str from "obj-str";

export const Card = ({ className, children, ...props }) => (
  <div className={"card" + className || ""} {...props}>
    {children}
  </div>
);

export const Form = ({ children, ...props }) => (
  <form {...props}>{children}</form>
);

Form.Group = ({ className, children, ...props }) => (
  <div className={"form-group" + className || ""} {...props}>
    {children}
  </div>
);
