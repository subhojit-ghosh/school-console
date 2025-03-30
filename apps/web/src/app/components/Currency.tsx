import React from 'react';

interface CurrencyProps {
  value: number;
  currency?: string;
  locale?: string;
}

const Currency: React.FC<CurrencyProps> = ({
  value,
  currency = 'INR',
  locale = 'en-US',
}) => {
  const formattedValue = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return formattedValue;
};

export default Currency;
