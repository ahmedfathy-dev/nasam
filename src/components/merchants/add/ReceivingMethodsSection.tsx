import { Plus } from 'lucide-react'
import PaymentMethodBlock from './PaymentMethodBlock'
import { useAddMerchantForm } from './addMerchantFormContext'
import type { MethodBlock } from './addMerchantTypes'
import { amError, amSection, amSectionHead, amStep } from '../merchantTw'

function ReceivingMethodsSection() {
  const { values, availableMethods, errors, disabled, onChange } = useAddMerchantForm()
  const methods = values.methods ?? []
  const changeMethods = (next: MethodBlock[]) => onChange('methods', next)
  const usedMethodIds = methods.map((block) => block.methodId)

  function updateBlock(key: string, updater: (block: MethodBlock) => MethodBlock) {
    changeMethods(methods.map((block) => (block.key === key ? updater(block) : block)))
  }

  function addBlock() {
    const next = (availableMethods ?? []).find((method) => !usedMethodIds.includes(method.id))
    if (!next) return
    changeMethods([
      ...methods,
      { key: `m-${Date.now()}`, methodId: next.id, accounts: [''] },
    ])
  }

  function removeBlock(key: string) {
    const block = methods.find((item) => item.key === key)
    if (!block) return
    const hasData = (block.accounts ?? []).some((account) => account.trim())
    if (hasData && !window.confirm('هل تريد حذف وسيلة الاستقبال وبياناتها؟')) return
    changeMethods(methods.filter((item) => item.key !== key))
  }

  return (
    <section className={amSection}>
      <header className={amSectionHead}>
        <span className={amStep}>3</span>
        <h2 className="text-sm font-bold text-[#303b46]">وسائل الاستقبال</h2>
      </header>
      <p className="am-section-hint -mt-1 text-[11px] leading-[1.7] text-text-muted">
        اختر الوسيلة من وسائل الدفع المفعلة، ثم أضف رقمًا واحدًا أو أكثر أو حسابًا واحدًا أو أكثر لها
      </p>

      <div className="am-methods grid gap-2.5">
        {methods.map((block) => (
          <PaymentMethodBlock
            key={block.key}
            editor={{
              block,
              methods: availableMethods,
              usedMethodIds,
              accountErrors: errors.accounts?.[block.key],
              disabled,
              onChangeMethod: (methodId) => updateBlock(block.key, (current) => ({ ...current, methodId })),
              onChangeAccount: (index, value) => updateBlock(block.key, (current) => {
                const accounts = [...current.accounts]
                accounts[index] = value
                return { ...current, accounts }
              }),
              onAddAccount: () => updateBlock(block.key, (current) => ({
                ...current,
                accounts: [...current.accounts, ''],
              })),
              onRemoveAccount: (index) => updateBlock(block.key, (current) => ({
                ...current,
                accounts: current.accounts.length <= 1
                  ? ['']
                  : current.accounts.filter((_, i) => i !== index),
              })),
              onRemoveBlock: () => removeBlock(block.key),
            }}
          />
        ))}
      </div>

      {errors.methods && <small className={amError}>{errors.methods}</small>}

      <button
        type="button"
        className="am-add-method inline-flex min-h-10 w-full items-center justify-center gap-[5px] rounded-sm border border-green-border bg-[#f3faf1] text-[11px] font-semibold text-green disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || availableMethods.every((method) => usedMethodIds.includes(method.id))}
        onClick={addBlock}
      >
        <Plus size={14} />إضافة وسيلة استقبال أخرى
      </button>
    </section>
  )
}

export default ReceivingMethodsSection
