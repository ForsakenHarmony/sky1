import clsx from "clsx";

export const Card = ({ className, children, ...props }: any) => (
  <section class={clsx("card", className)} {...props}>
    {children}
  </section>
);

export const CardHeader = ({ className, children, ...props }: any) => (
  <header class={clsx("card-header", className)} {...props}>
    {children}
  </header>
);

export const CardTitle = ({ className, children, ...props }: any) => (
  <h5 class={clsx("card-title h5", className)} {...props}>
    {children}
  </h5>
);

export const CardFooter = ({ className, children, ...props }: any) => (
  <footer class={clsx("card-footer", className)} {...props}>
    {children}
  </footer>
);

export const CardBody = ({ className, children, ...props }: any) => (
  <main class={clsx("card-body", className)} {...props}>
    {children}
  </main>
);

export const Form = ({ children, ...props }: any) => (
  <form {...props}>{children}</form>
);

Form.Group = ({ className, children, ...props }: any) => (
  <div className={"form-group" + className || ""} {...props}>
    {children}
  </div>
);
