import { Plus } from 'lucide-react'
import type { CatalogPaymentMethod } from '../../../data/merchantCatalog'
import PaymentMethodBlock from './PaymentMethodBlock'
import type { AddMerchantFieldErrors, MethodBlock } from './addMerchantTypes'

type ReceivingMethodsSectionProps = {
  methods: MethodBlock[]
  availableMethods: CatalogPaymentMethod[]
  errors: AddMerchantFieldErrors
  disabled?: boolean
  onChange: (methods: MethodBlock[]) => void
}

function ReceivingMethodsSection({
  methods, availableMethods, errors, disabled, onChange,
}: ReceivingMethodsSectionProps) {
  const usedMethodIds = methods.map((block) => block.methodId)

  function updateBlock(key: string, updater: (block: MethodBlock) => MethodBlock) {
    onChange(methods.map((block) => (block.key === key ? updater(block) : block)))
  }

  function addBlock() {
    const next = availableMethods.find((method) => !usedMethodIds.includes(method.id))
    if (!next) return
    onChange([
      ...methods,
      { key: `m-${Date.now()}`, methodId: next.id, accounts: [''] },
    ])
  }

  function removeBlock(key: string) {
    const block = methods.find((item) => item.key === key)
    if (!block) return
    const hasData = block.accounts.some((account) => account.trim())
    if (hasData && !window.confirm('هل تريد حذف وسيلة الاستقبال وبياناتها؟')) return
    onChange(methods.filter((item) => item.key !== key))
  }

  return (
    <section className="am-section">
      <header className="am-section-head">
        <span className="am-step">3</span>
        <h2>وسائل الاستقبال</h2>
      </header>
      <p className="am-section-hint">
        اختر الوسيلة من وسائل الدفع المفعلة، ثم أضف رقمًا واحدًا أو أكثر أو حسابًا واحدًا أو أكثر لها
      </p>

      <div className="am-methods">
        {methods.map((block) => (
          <PaymentMethodBlock
            key={block.key}
            block={block}
            methods={availableMethods}
            usedMethodIds={usedMethodIds}
            accountErrors={errors.accounts?.[block.key]}
            disabled={disabled}
            onChangeMethod={(methodId) => updateBlock(block.key, (current) => ({ ...current, methodId }))}
            onChangeAccount={(index, value) => updateBlock(block.key, (current) => {
              const accounts = [...current.accounts]
              accounts[index] = value
              return { ...current, accounts }
            })}
            onAddAccount={() => updateBlock(block.key, (current) => ({
              ...current,
              accounts: [...current.accounts, ''],
            }))}
            onRemoveAccount={(index) => updateBlock(block.key, (current) => ({
              ...current,
              accounts: current.accounts.length <= 1
                ? ['']
                : current.accounts.filter((_, i) => i !== index),
            }))}
            onRemoveBlock={() => removeBlock(block.key)}
          />
        ))}
      </div>

      {errors.methods && <small className="am-error">{errors.methods}</small>}

      <button
        type="button"
        className="am-add-method"
        disabled={disabled || availableMethods.every((method) => usedMethodIds.includes(method.id))}
        onClick={addBlock}
      >
        <Plus size={14} />إضافة وسيلة استقبال أخرى
      </button>
    </section>
  )
}

export default ReceivingMethodsSection
