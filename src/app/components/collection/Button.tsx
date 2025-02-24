import React from 'react';

function Button({ text }: { text: string }) {
  return (
    <button
      type="submit"
      className="w-full bg-titleColor py-2 text-white font-semibold rounded-full"
    >
      {text}
    </button>
  );
}

export default Button;
