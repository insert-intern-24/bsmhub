import type { Meta, StoryObj } from '@storybook/react';
import CategoryTag from './CategoryTag';

const meta = {
  title: 'Components/Contents/CategoryTag',
  component: CategoryTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'text',
      description: 'Category name',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether the category is active',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
} satisfies Meta<typeof CategoryTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: 'Web',
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    category: 'Mobile',
    isActive: true,
  },
};

export const CategoryList: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <CategoryTag category="전체" isActive={true} onClick={() => console.log('전체')} />
      <CategoryTag category="웹" isActive={false} onClick={() => console.log('웹')} />
      <CategoryTag category="모바일" isActive={false} onClick={() => console.log('모바일')} />
      <CategoryTag category="게임" isActive={false} onClick={() => console.log('게임')} />
      <CategoryTag category="AI/ML" isActive={false} onClick={() => console.log('AI/ML')} />
      <CategoryTag category="임베디드" isActive={false} onClick={() => console.log('임베디드')} />
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <div className="flex flex-wrap gap-2">
        <CategoryTag category="전체" isActive={true} />
        <CategoryTag category="웹 개발" isActive={false} />
        <CategoryTag category="모바일 앱" isActive={false} />
        <CategoryTag category="데이터 사이언스" isActive={false} />
        <CategoryTag category="클라우드" isActive={false} />
        <CategoryTag category="보안" isActive={false} />
        <CategoryTag category="DevOps" isActive={false} />
        <CategoryTag category="블록체인" isActive={false} />
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};
