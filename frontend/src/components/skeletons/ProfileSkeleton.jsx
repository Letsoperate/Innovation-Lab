import React from "react";
import { Skeleton } from "@heroui/react";

const ProfileSkeleton = () => (
  <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-0">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 p-4 border-b border-gray-100">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
