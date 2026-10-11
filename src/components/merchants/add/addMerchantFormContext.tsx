import { createContext, useContext, type ReactNode } from 'react'
import type { CatalogCountry, CatalogPaymentMethod } from '../../../data/merchantCatalog'
import type { AddMerchantFieldErrors, AddMerchantFormValues } from './addMerchantTypes'

export type AddMerchantFormContextValue = {
  values: AddMerchantFormValues
  errors: AddMerchantFieldErrors
  countries: CatalogCountry[]
  availableMethods: CatalogPaymentMethod[]
  phonePrefix: string
  currency: string
  country?: CatalogCountry
  disabled: boolean
  onChange: <K extends keyof AddMerchantFormValues>(key: K, value: AddMerchantFormValues[K]) => void
  onBlurEmail: () => void
}

const AddMerchantFormContext = createContext<AddMerchantFormContextValue | null>(null)

export function AddMerchantFormProvider({
  value,
  children,
}: {
  value: AddMerchantFormContextValue
  children: ReactNode
}) {
  return <AddMerchantFormContext.Provider value={value}>{children}</AddMerchantFormContext.Provider>
}

export function useAddMerchantForm() {
  const context = useContext(AddMerchantFormContext)
  if (!context) {
    throw new Error('أقسام نموذج التاجر يجب أن تُستخدم داخل AddMerchantFormProvider')
  }
  return context
}
