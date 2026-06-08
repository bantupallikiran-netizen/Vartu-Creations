import React from "react";

interface SkeletonLoaderProps {
  currentTab: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ currentTab }) => {
  // Common pulsing style with boutique warm colors
  const pulseClass = "animate-pulse bg-[#D4A373]/10 rounded-2xl border border-[#D4A373]/5";
  const linePulseClass = "animate-pulse bg-[#6B705C]/10 rounded-sm";

  const renderHomeSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner Skeleton */}
      <div className={`h-[380px] w-full ${pulseClass} flex flex-col justify-end p-8 space-y-4`}>
        <div className={`h-8 w-1/4 ${linePulseClass}`} />
        <div className={`h-4 w-1/2 ${linePulseClass}`} />
        <div className={`h-10 w-32 rounded-full bg-[#D4A373]/25 animate-pulse`} />
      </div>

      {/* Categories Row */}
      <div className="space-y-4">
        <div className={`h-5 w-48 ${linePulseClass}`} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-24 ${pulseClass}`} />
          ))}
        </div>
      </div>

      {/* Featured Products Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className={`h-6 w-56 ${linePulseClass}`} />
          <div className={`h-4 w-20 ${linePulseClass}`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className={`h-[280px] ${pulseClass}`} />
              <div className={`h-4 w-3/4 ${linePulseClass}`} />
              <div className={`h-3 w-1/2 ${linePulseClass}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShopSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search and Categories row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className={`h-10 w-full md:w-80 rounded-full ${pulseClass}`} />
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-8 w-16 rounded-full shrink-0 ${pulseClass}`} />
          ))}
        </div>
      </div>

      {/* View settings & Filter row */}
      <div className="flex justify-between items-center border-[#D4A373]/10 border-t border-b py-3">
        <div className={`h-4 w-36 ${linePulseClass}`} />
        <div className={`h-4 w-24 ${linePulseClass}`} />
      </div>

      {/* Grid of 6 shop products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4 bg-white p-4 rounded-2xl border border-[#D4A373]/10">
            <div className={`h-64 ${pulseClass}`} />
            <div className="space-y-1.5 pl-1">
              <div className={`h-4 w-2/3 ${linePulseClass}`} />
              <div className={`h-3 w-1/2 ${linePulseClass}`} />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className={`h-5 w-16 ${linePulseClass}`} />
              <div className={`h-8 w-24 rounded-full bg-[#8B9D83]/20 animate-pulse`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Intro Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className={`h-8 w-48 mx-auto ${linePulseClass}`} />
        <div className={`h-4 w-full ${linePulseClass}`} />
        <div className={`h-4 w-3/4 mx-auto ${linePulseClass}`} />
      </div>

      {/* Two column interactive workspace skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Options */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#D4A373]/15 space-y-6">
          <div className="space-y-4">
            <div className={`h-5 w-40 ${linePulseClass}`} />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-24 ${pulseClass}`} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className={`h-4 w-28 ${linePulseClass}`} />
            <div className={`h-20 w-full ${pulseClass}`} />
          </div>

          <div className="space-y-3">
            <div className={`h-4 w-32 ${linePulseClass}`} />
            <div className="grid grid-cols-2 gap-4">
              <div className={`h-10 w-full ${pulseClass}`} />
              <div className={`h-10 w-full ${pulseClass}`} />
            </div>
          </div>

          <div className={`h-10 w-full rounded-full bg-[#8B9D83]/20 animate-pulse`} />
        </div>

        {/* Right Column: Visual Preview Canvas */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#D4A373]/15 flex flex-col justify-between">
          <div className="space-y-4">
            <div className={`h-5 w-36 ${linePulseClass}`} />
            <div className={`h-72 w-full ${pulseClass}`} />
          </div>
          <div className="space-y-2 pt-4">
            <div className={`h-4 w-1/2 ${linePulseClass}`} />
            <div className={`h-3 w-3/4 ${linePulseClass}`} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkshopsSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className={`h-8 w-56 mx-auto ${linePulseClass}`} />
        <div className={`h-4 w-full ${linePulseClass}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#D4A373]/15 overflow-hidden">
            <div className={`h-52 w-full ${pulseClass}`} />
            <div className="p-6 space-y-4">
              <div className={`h-5 w-1/3 ${linePulseClass}`} />
              <div className={`h-6 w-3/4 ${linePulseClass}`} />
              <div className="space-y-1">
                <div className={`h-3 w-1/2 ${linePulseClass}`} />
                <div className={`h-3 w-1/3 ${linePulseClass}`} />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className={`h-4 w-16 ${linePulseClass}`} />
                <div className={`h-9 w-28 rounded-full bg-[#8B9D83]/20 animate-pulse`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGenericSkeleton = () => (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="space-y-2">
        <div className={`h-8 w-1/3 ${linePulseClass}`} />
        <div className={`h-4 w-1/2 ${linePulseClass}`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-[#D4A373]/15 space-y-4">
            <div className={`h-32 ${pulseClass}`} />
            <div className={`h-4 w-3/4 ${linePulseClass}`} />
            <div className={`h-3 w-1/2 ${linePulseClass}`} />
          </div>
        ))}
      </div>
    </div>
  );

  switch (currentTab) {
    case "home":
      return renderHomeSkeleton();
    case "shop":
      return renderShopSkeleton();
    case "custom":
      return renderCustomSkeleton();
    case "workshops":
      return renderWorkshopsSkeleton();
    default:
      return renderGenericSkeleton();
  }
};
