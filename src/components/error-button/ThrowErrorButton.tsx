import type { ReactNode } from 'react';
import { useState } from 'react';

import { CustomButton } from '../custom-button/CustomButton';

export function ThrowErrorButton(): ReactNode {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const handleClick = (): void => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('Error throwing button was clicked');
  }

  return (
    <CustomButton type="button" variant="cancel" onClick={handleClick}>
      Throw error
    </CustomButton>
  );
}
