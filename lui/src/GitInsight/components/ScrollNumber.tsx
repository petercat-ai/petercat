import React, { useEffect, useRef, useState } from 'react';

interface NumberScrollProps {
  count: number;
  play: boolean;
}

const NumberScroll: React.FC<NumberScrollProps> = ({ count, play }) => {
  const [currNum, setCurrNum] = useState<number>(count);
  const numberRef = useRef<HTMLDivElement>(null);

  const scrollNumber = (digits: string[]) => {
    const number = numberRef.current;
    if (number) {
      number.querySelectorAll('span[data-value]').forEach((tick, i) => {
        const tickElement = tick as HTMLElement;
        tickElement.style.transform = `translateY(-${
          100 * parseInt(digits[i])
        }%)`;
      });
      number.style.width = `${digits.length * 12}px`;
    }
  };

  const addDigit = (digit: string) => {
    const spanList = Array.from(
      { length: 10 },
      (_, j) => `<span>${j}</span>`,
    ).join('');
    const number = numberRef.current;

    if (number) {
      number.insertAdjacentHTML(
        'beforeend',
        `<span style="transform: translateY(-1000%); ${baseSpanStyle}" data-value="${digit}">
          ${spanList}
        </span>`,
      );

      const firstDigit = number.lastElementChild as HTMLElement;
      firstDigit.className = 'visible';
      Object.assign(firstDigit.style, visibleSpanStyle);
    }
  };

  const setup = (startNum: number) => {
    const digits = startNum.toString().split('');
    digits.forEach(() => addDigit('0'));
    scrollNumber(['0']);

    setTimeout(() => scrollNumber(digits), 0);
    setCurrNum(startNum);
  };

  const baseSpanStyle = `
    display: flex;
    text-align: center;
    flex-direction: column;
    opacity: 0;
    flex-shrink: 2;
    flex-basis: 48px;
    width: 1px;
    position: absolute;
    right: 0;
    line-height: 48px;
    transition: all 1s ease;
  `;

  const visibleSpanStyle: React.CSSProperties = {
    position: 'static',
    width: '30px',
    opacity: 1,
    flexShrink: 1,
  };

  useEffect(() => {
    if (!play) return;
    setup(currNum);
  }, [count, play]);

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        color: 'rgba(75, 85, 99, 1)',
        fontWeight: 800,
        width: 'fit-content',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'baseline',
          fontSize: '20px',
        }}
      >
        <div
          ref={numberRef}
          id="number"
          style={{
            position: 'relative',
            display: 'flex',
            overflow: 'hidden',
            height: '48px',
            transition: `width 0.3s ease`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default NumberScroll;
