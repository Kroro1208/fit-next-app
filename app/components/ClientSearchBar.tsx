'use client';

import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSearch } from "../context/SearchContext"

const ClientSearchBar = () => {
    const { searchQuery, setSearchQuery } = useSearch();
    const router = useRouter();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            router.push(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    }

    return (
        <div className="relative hidden md:block">
            <Input
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                type="text" 
                placeholder="投稿を検索..." 
                className="pl-10 pr-4 py-2 rounded-full w-64 focus:w-80 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
    );
}

export default ClientSearchBar;