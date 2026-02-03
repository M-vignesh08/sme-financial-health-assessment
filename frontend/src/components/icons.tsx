import type { SVGProps } from "react";

export function FinSightLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M168 96H88a8 8 0 0 0 0 16h80a8 8 0 0 0 0-16Z" />
        <path d="M168 128H88a8 8 0 0 0 0 16h80a8 8 0 0 0 0-16Z" />
        <path d="m146.12 165.88-32-32a8 8 0 0 0-11.32 11.32l32 32a8 8 0 0 0 11.32-11.32Z" />
      </g>
    </svg>
  );
}
