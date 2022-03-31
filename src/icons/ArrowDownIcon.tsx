import * as React from 'react';
export default function ArrowDownIcon(props: {
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
        d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
