import type { ReactNode } from 'react'

type TransferFormSectionProps = {
  number: string
  title: string
  hint?: string
  children: ReactNode
}

function TransferFormSection({
  section,
  children,
}: {
  section: Omit<TransferFormSectionProps, 'children'>
  children: ReactNode
}) {
  const { number, title, hint } = section
  return (
    <section className="border-b border-[#edf0f2] pb-4 [&+&]:pt-4">
      <header className="mb-3 flex items-center justify-between gap-2.5">
        <h2 className="flex items-center gap-2 text-[16px] font-bold text-[#303b46]">
          <span className="grid size-[26px] place-items-center rounded-full bg-green-soft text-[12px] font-bold text-green">
            {number}
          </span>
          {title}
        </h2>
        {hint ? <em className="text-[11px] not-italic text-text-muted">{hint}</em> : null}
      </header>
      {children}
    </section>
  )
}

export default TransferFormSection
