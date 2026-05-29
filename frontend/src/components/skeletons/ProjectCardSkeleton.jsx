import React from "react";
import { Skeleton } from "@heroui/react";

const ProjectCardSkeleton = () => (
  <div className="flex items-start gap-3 p-4 border-b border-gray-100">
    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/5 rounded-lg" />
      <Skeleton className="h-3 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
    <Skeleton className="w-14 h-16 rounded-lg shrink-0" />
  </div>
);

export default ProjectCardSkeleton;
