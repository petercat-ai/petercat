import React from 'react';

const BubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} fill="none">
    <g clipPath="url(#a)">
      <rect width={40} height={40} fill="#fff" rx={20} />
      <path
        fill="#27272A"
        fillRule="evenodd"
        d="M17.29 17.247c-2.202 1.171-4.887 1.343-7.238.513-.808-.285-1.65-.526-2.417-.638a10.609 10.609 0 0 0-.073-.01c-.473-.067-.91.34-.79.802.595 2.264 2.536 6.815 2.536 6.815s.313 4.846 1.4 10.056c.423 2.022.614 4.544.689 6.873.087 2.706 3.242 4.261 4.887 2.111.118.149.247.296.385.443 1.934 2.055 5.226.902 6.8-1.441.268.239.54.466.81.682 2.492 1.989 6.103.816 7.11-2.21.203.298.487.632.815.978 1.622 1.714 4.416.874 5.096-1.385 2.47 1.887 5.555 1.324 5.14-1.757-.417-3.108-1.42-7.091-3.57-11.851-3-6.647-9.668-16.71-11.23-18.847a6.213 6.213 0 0 0-.418-.48c-.44-.47-1.236-.39-1.5.197a70.785 70.785 0 0 1-1.768 3.693c-1.336 2.547-3.998 4.072-6.551 5.396l-.114.06Z"
        clipRule="evenodd"
      />
      <path
        fill="url(#b)"
        fillRule="evenodd"
        d="M17.29 17.247c-2.202 1.171-4.887 1.343-7.238.513-.808-.285-1.65-.526-2.417-.638a10.609 10.609 0 0 0-.073-.01c-.473-.067-.91.34-.79.802.595 2.264 2.536 6.815 2.536 6.815s.313 4.846 1.4 10.056c.423 2.022.614 4.544.689 6.873.087 2.706 3.242 4.261 4.887 2.111.118.149.247.296.385.443 1.934 2.055 5.226.902 6.8-1.441.268.239.54.466.81.682 2.492 1.989 6.103.816 7.11-2.21.203.298.487.632.815.978 1.622 1.714 4.416.874 5.096-1.385 2.47 1.887 5.555 1.324 5.14-1.757-.417-3.108-1.42-7.091-3.57-11.851-3-6.647-9.668-16.71-11.23-18.847a6.213 6.213 0 0 0-.418-.48c-.44-.47-1.236-.39-1.5.197a70.785 70.785 0 0 1-1.768 3.693c-1.336 2.547-3.998 4.072-6.551 5.396l-.114.06Z"
        clipRule="evenodd"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M27.328 25.954c1.69-.36 2.74-2.16 2.345-4.022-.396-1.861-2.087-3.079-3.778-2.72-1.691.36-2.741 2.16-2.346 4.022.396 1.861 2.088 3.08 3.779 2.72Zm.3-1.878c.639-.136 1.036-.817.886-1.521-.15-.704-.789-1.164-1.428-1.029-.64.136-1.037.817-.887 1.521.15.704.79 1.165 1.428 1.029ZM15.568 29.292c1.35-.287 2.188-1.729 1.87-3.22-.317-1.493-1.668-2.47-3.018-2.183-1.35.287-2.187 1.73-1.87 3.221.317 1.492 1.668 2.47 3.018 2.182Zm.249-1.507c.51-.108.827-.653.707-1.218-.12-.564-.631-.933-1.142-.825-.51.109-.827.654-.707 1.218.12.565.631.934 1.142.825Z"
        clipRule="evenodd"
      />
      <g filter="url(#c)">
        <rect width={40} height={40} fill="#fff" fillOpacity={0.01} rx={20} />
      </g>
    </g>
    <rect
      width={39.5}
      height={39.5}
      x={0.25}
      y={0.25}
      stroke="#fff"
      strokeWidth={0.5}
      rx={19.75}
    />
    <defs>
      <radialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(5.00002 19.00001 -18.37403 4.83528 20 21.5)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" stopOpacity={0} />
        <stop offset={0.588} stopColor="#fff" stopOpacity={0.07} />
        <stop offset={1} stopColor="#fff" stopOpacity={0.25} />
      </radialGradient>
      <clipPath id="a">
        <rect width={40} height={40} fill="#fff" rx={20} />
      </clipPath>
      <filter
        id="c"
        width={40}
        height={40}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={3} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1195_4524" />
      </filter>
    </defs>
  </svg>
);
export default BubbleIcon;
