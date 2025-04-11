import { ReviewEvaluationType } from '@/lib/constants/reviewEvaluation';
import React from 'react';

const colorMap = {
  [ReviewEvaluationType.negative]: {
    text: 'text-red-700',
    border: 'border-red-300',
    bg: 'bg-red-100',
  },
  [ReviewEvaluationType.neutral]: {
    text: 'text-blue-700',
    border: 'border-blue-300',
    bg: 'bg-blue-100',
  },
  [ReviewEvaluationType.positive]: {
    text: 'text-green-700',
    border: 'border-green-300',
    bg: 'bg-green-100',
  },
  default: {
    text: 'text-gray-700',
    border: 'border-gray-300',
    bg: 'bg-gray-100',
  },
};

const CommentEvaluation = ({ evaluation }: { evaluation: string }) => {
  const colors = colorMap[evaluation as keyof typeof colorMap] || colorMap.default;

  return (
    <div
      className={`flex flex-row items-center rounded-full px-2 ${colors.text} ${colors.border} ${colors.bg} border`}
    >
      <span className='font-sx'>{evaluation}</span>
    </div>
  );
};

export default CommentEvaluation;
