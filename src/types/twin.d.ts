/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="twin.macro" />
/// <reference types="styled-components/cssprop" />

import 'twin.macro';
import 'styled-components/macro';

declare module 'react' {
  // Allow the css prop on any element.
  interface Attributes {
    css?: unknown;
  }
}
