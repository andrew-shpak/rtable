import * as React from 'react';
export default function ArrowRightIcon(props: {
  color?: string;
  visible?: boolean;
}) {
  const { color = 'currentColor', visible = true } = props;
  return (
    <svg
      width="16"
      height="16"
      fill={color}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}
