import { type ReactNode, useEffect, useState } from 'react';

type RunInClientProps = {
  param: string;
  fallback?: ReactNode;
  children: ReactNode;
};

export function RunInClient({
  param,
  fallback = null,
  children,
}: RunInClientProps) {
  const queryString = window.location.search;
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const submitted = queryString.includes(param);
      if (submitted) {
        setFormSubmitted(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [queryString]);

  return formSubmitted ? children : fallback;
}
