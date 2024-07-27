"use client";
import { Button } from "@/components/ui/button"
import { ArrowDown, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

const DownVoteButton = () => {
    const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button variant="outline" size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin"/>
        </Button>
      ) : (
        <Button className="outline" size="sm" type="submit">
            <ArrowDown className="h-4 w-4"/>
        </Button>
      )}
    </>
  )
}

export default DownVoteButton
