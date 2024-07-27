"use client";
import { Button } from "@/components/ui/button"
import { ArrowUp, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

const UpVoteButton = () => {
    const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button variant="outline" size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin"/>
        </Button>
      ) : (
        <Button className="outline" size="sm" type="submit">
            <ArrowUp className="h-4 w-4"/>
        </Button>
      )}
    </>
  )
}

export default UpVoteButton
