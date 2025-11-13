import type { Meta, StoryObj } from '@storybook/react';
import SkillTag from './SkillTag';

const meta = {
  title: 'Components/Contents/SkillTag',
  component: SkillTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['default', 'input', 'cancel', 'white'],
      description: 'Display mode of the tag',
    },
    value: {
      control: 'text',
      description: 'Text value of the tag',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
} satisfies Meta<typeof SkillTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: 'default',
    value: 'React',
  },
};

export const White: Story = {
  args: {
    mode: 'white',
    value: 'TypeScript',
  },
};

export const WithCancel: Story = {
  args: {
    mode: 'cancel',
    value: 'JavaScript',
    onClick: () => console.log('Remove clicked'),
  },
};

export const Input: Story = {
  args: {
    mode: 'input',
    onClick: () => console.log('Input submitted'),
  },
};

export const MultipleSkills: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <SkillTag mode="default" value="React" />
      <SkillTag mode="default" value="Next.js" />
      <SkillTag mode="default" value="TypeScript" />
      <SkillTag mode="default" value="Tailwind CSS" />
      <SkillTag mode="white" value="Node.js" />
      <SkillTag mode="white" value="Express" />
      <SkillTag mode="cancel" value="Remove Me" onClick={() => console.log('Removed')} />
    </div>
  ),
};
