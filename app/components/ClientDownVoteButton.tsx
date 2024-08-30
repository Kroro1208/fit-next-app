"use client";
import { Button } from "@/components/ui/button"
import { ArrowDown, Loader2 } from "lucide-react"

interface DownButtonProps {
  isLoading: boolean;
  onclick: () => void
}

const ClientDownVoteButton: React.FC<DownButtonProps> = ({ isLoading, onclick }) => {
  return (
    <>
      {isLoading ? (
        <Button variant="outline" size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin"/>
        </Button>
      ) : (
        <Button className="outline" size="sm" type="submit">
            <ArrowDown className="h-4 w-4" onClick={onclick}/>
        </Button>
      )}
    </>
  )
}

export default ClientDownVoteButton
