import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta = {
  title: 'Components/Card/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the badge image',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: 'Badge',
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'opacity-50',
    alt: 'Faded Badge',
  },
};
