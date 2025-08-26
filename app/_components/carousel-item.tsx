'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from '@/app/_components/ui/carousel';
import { cn } from '@/app/_lib/utils';

interface FlexibleCarouselProps {
  children: React.ReactNode;
  opts?: React.ComponentProps<typeof Carousel>['opts'];
  className?: string;
  itemClassName?: string;
  showNavigation?: boolean;
  previousButtonClass?: string;
  nextButtonClass?: string;
  contentClassName?: string;
}

const FlexibleCarousel = ({
  children,
  opts,
  className,
  showNavigation = true,
  previousButtonClass,
  nextButtonClass,
  contentClassName,
}: FlexibleCarouselProps) => {
  return (
    <div className={cn('relative w-full', className)}>
      <Carousel
        opts={{
          loop: true,
          align: (viewSize, snapSize, index) => {
            return -16;
          },
          ...opts,
        }}
        className="w-full"
      >
        <CarouselContent className={cn('ml-0', contentClassName)}>{children}</CarouselContent>

        {showNavigation && (
          <>
            <CarouselPrevious className={cn('!-left-4', previousButtonClass)} />
            <CarouselNext className={cn('!-right-4', nextButtonClass)} />
          </>
        )}
      </Carousel>
    </div>
  );
};

export { FlexibleCarousel };
