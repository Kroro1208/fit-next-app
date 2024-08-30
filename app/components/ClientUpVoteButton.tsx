"use client";
import { Button } from "@/components/ui/button"
import { ArrowUp, Loader2 } from "lucide-react"

interface UpButtonProps {
  isLoading: boolean;
  onclick: () => void
}

const ClientUpVoteButton: React.FC<UpButtonProps> = ({ isLoading, onclick }) => {
  return (
    <>
      {isLoading ? (
        <Button variant="outline" size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin"/>
        </Button>
      ) : (
        <Button className="outline" size="sm" type="submit">
            <ArrowUp className="h-4 w-4" onClick={onclick}/>
        </Button>
      )}
    </>
  )
}

export default ClientUpVoteButton
