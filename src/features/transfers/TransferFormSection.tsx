import type { ReactNode } from 'react'

type TransferFormSectionProps = {
  number: string
  title: string
  hint?: string
  children: ReactNode
}

function TransferFormSection({ number, title, hint, children }: TransferFormSectionProps) {
  return (
    <section className="transfer-form-section">
      <header className="transfer-form-section-head">
        <h2><span>{number}</span>{title}</h2>
        {hint ? <em>{hint}</em> : null}
      </header>
      {children}
    </section>
  )
}

export default TransferFormSection
