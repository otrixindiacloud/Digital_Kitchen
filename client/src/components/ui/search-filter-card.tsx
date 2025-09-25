import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SearchFilterCardProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions: { value: string; label: string }[];
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterLabel?: string;
  className?: string;
}

export function SearchFilterCard({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
  filterLabel = "All",
  className = ""
}: SearchFilterCardProps) {
  return (
    <Card className={`shadow-sm border-0 bg-white ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-11 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-lg"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-4 py-2.5 h-11 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 min-w-[120px]"
            >
              <option value="all">{filterLabel}</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
