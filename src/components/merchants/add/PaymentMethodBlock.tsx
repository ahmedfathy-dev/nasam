import { Plus, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import FormSelect from '../../ui/FormSelect'
import { accountCountLabel, type CatalogPaymentMethod } from '../../../data/merchantCatalog'
import type { MethodBlock } from './addMerchantTypes'
import { amControlInput, amControlShell, amError, amSelect } from '../merchantTw'

type PaymentMethodEditor = {
  block: MethodBlock
  methods?: CatalogPaymentMethod[]
  usedMethodIds?: string[]
  accountErrors?: Record<number, string>
  disabled?: boolean
  onChangeMethod: (methodId: string) => void
  onChangeAccount: (index: number, value: string) => void
  onAddAccount: () => void
  onRemoveAccount: (index: number) => void
  onRemoveBlock: () => void
}

function PaymentMethodBlock({ editor }: { editor: PaymentMethodEditor }) {
  if (!editor?.block) return null
  const block = editor.block
  const accounts = Array.isArray(block?.accounts) && block.accounts.length ? block.accounts : ['']
  const methods = editor.methods ?? []
  const usedMethodIds = editor.usedMethodIds ?? []
  const accountErrors = editor.accountErrors
  const disabled = Boolean(editor.disabled)
  const { onChangeMethod, onChangeAccount, onAddAccount, onRemoveAccount, onRemoveBlock } = editor
  const selected = methods.find((method) => method.id === block.methodId)
  const options = methods
    .filter((method) => method.id === block.methodId || !usedMethodIds.includes(method.id))
    .map((method) => ({ label: method.name, value: method.id }))

  return (
    <article className="am-method-block grid gap-2.5 rounded-md border border-[#e7eaec] bg-white p-3">
      <div className="am-method-head flex flex-wrap items-center gap-2">
        <FormSelect
          field={{
            className: cn(amSelect, 'am-method-select min-w-0 flex-1 max-[560px]:w-full max-[560px]:flex-[1_1_100%]'),
            ariaLabel: 'وسيلة الاستقبال',
            value: block.methodId,
            disabled: disabled || options.length === 0,
            onChange: onChangeMethod,
            options: options.length ? options : [{ label: 'لا توجد وسائل متاحة', value: block.methodId || 'none' }],
          }}
        />
        <span className="am-method-count whitespace-nowrap text-[10px] text-text-muted">
          {accountCountLabel(accounts.filter(Boolean).length || accounts.length)}
        </span>
        <button
          type="button"
          className="am-icon-danger grid size-10 place-items-center rounded-[7px] border border-[#f0c4c4] bg-[#fff5f5] text-danger min-[561px]:size-8"
          aria-label="حذف الوسيلة"
          disabled={disabled}
          onClick={onRemoveBlock}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="am-accounts grid gap-2">
        {accounts.map((account, index) => (
          <label className="am-account-row grid gap-1 text-[10px] text-[#6d767e]" key={`${block.key}-${index}`}>
            <span className="am-account-label text-[10px]">{selected?.accountLabel ?? 'الحساب'}</span>
            <div className={`am-account-input ${amControlShell}`}>
              <input
                className={amControlInput}
                dir="ltr"
                value={account}
                placeholder={selected?.accountPlaceholder}
                disabled={disabled}
                aria-invalid={Boolean(accountErrors?.[index])}
                onChange={(event) => onChangeAccount(index, event.target.value)}
              />
              <button
                type="button"
                className="am-icon-mute grid size-10 place-items-center rounded-[7px] border-0 bg-transparent text-[#95a0a7] min-[561px]:size-8"
                aria-label="حذف الحساب"
                disabled={disabled || accounts.length <= 1}
                onClick={() => onRemoveAccount(index)}
              >
                <X size={13} />
              </button>
            </div>
            {accountErrors?.[index] && <small className={amError}>{accountErrors[index]}</small>}
          </label>
        ))}
      </div>

      <button
        type="button"
        className="am-link inline-flex items-center justify-center gap-[5px] border-0 bg-transparent text-[11px] font-semibold text-green disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={onAddAccount}
      >
        <Plus size={13} />إضافة رقم / حساب آخر
      </button>
    </article>
  )
}

export default PaymentMethodBlock
