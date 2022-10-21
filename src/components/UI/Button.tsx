import { HTMLProps, forwardRef } from "react";

import NextLink from "next/link";
import classNames from "classnames";

interface Props extends HTMLProps<HTMLButtonElement> {
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  href: string;
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className = "", children, onClick, selected, href },
  ref
) {
  return (
    <>
      <NextLink href={href}>
        <button
          type="button"
          ref={ref}
          aria-label={children?.toString()}
          onClick={onClick}
          className={classNames({
            [className]: className,
            "ring-4 ring-violet-400": selected,
            "rounded-md border border-gray-50 bg-violet-700 px-4 py-2 text-xl text-gray-100 shadow-lg hover:bg-violet-500 ":
              true,
            "transition duration-150 ease-out": true,
          })}
        >
          {children}
        </button>
      </NextLink>
    </>
  );
});

export default Button;
