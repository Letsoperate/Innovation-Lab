import React from "react";
import { Skeleton } from "@heroui/react";

const SidebarSkeleton = () => (
  <aside className="space-y-4">
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <Skeleton className="h-4 w-32 rounded-lg mb-3" />
      <Skeleton className="h-3 w-full rounded-lg mb-2" />
      <Skeleton className="h-3 w-2/3 rounded-lg" />
    </div>
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <Skeleton className="h-4 w-28 rounded-lg mb-3" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
          <Skeleton className="h-3 flex-1 rounded-lg" />
        </div>
      ))}
    </div>
  </aside>
);

export default SidebarSkeleton;
