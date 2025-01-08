import { PropsWithChildren } from "react"

export default function SingleStartupLayout({ children }: PropsWithChildren) {
  return (
    <div className="">
      <div className="mx-auto flex  flex-1 flex-col px-4 relative">
        {children}
      </div>
    </div>
  )
};