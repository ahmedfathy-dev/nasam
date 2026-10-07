import { Plus, Trash2, X } from 'lucide-react'
import FormSelect from '../../ui/FormSelect'
import { accountCountLabel, type CatalogPaymentMethod } from '../../../data/merchantCatalog'
import type { MethodBlock } from './addMerchantTypes'

type PaymentMethodBlockProps = {
  block: MethodBlock
  methods: CatalogPaymentMethod[]
  usedMethodIds: string[]
  accountErrors?: Record<number, string>
  disabled?: boolean
  onChangeMethod: (methodId: string) => void
  onChangeAccount: (index: number, value: string) => void
  onAddAccount: () => void
  onRemoveAccount: (index: number) => void
  onRemoveBlock: () => void
}

function PaymentMethodBlock({
  block, methods, usedMethodIds, accountErrors, disabled,
  onChangeMethod, onChangeAccount, onAddAccount, onRemoveAccount, onRemoveBlock,
}: PaymentMethodBlockProps) {
  const selected = methods.find((method) => method.id === block.methodId)
  const options = methods
    .filter((method) => method.id === block.methodId || !usedMethodIds.includes(method.id))
    .map((method) => ({ label: method.name, value: method.id }))

  return (
    <article className="am-method-block">
      <div className="am-method-head">
        <FormSelect
          className="am-select am-method-select"
          ariaLabel="وسيلة الاستقبال"
          value={block.methodId}
          disabled={disabled || options.length === 0}
          onChange={onChangeMethod}
          options={options.length ? options : [{ label: 'لا توجد وسائل متاحة', value: block.methodId }]}
        />
        <span className="am-method-count">{accountCountLabel(block.accounts.filter(Boolean).length || block.accounts.length)}</span>
        <button
          type="button"
          className="am-icon-danger"
          aria-label="حذف الوسيلة"
          disabled={disabled}
          onClick={onRemoveBlock}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="am-accounts">
        {block.accounts.map((account, index) => (
          <label className="am-account-row" key={`${block.key}-${index}`}>
            <span className="am-account-label">{selected?.accountLabel ?? 'الحساب'}</span>
            <div className="am-account-input">
              <input
                dir="ltr"
                value={account}
                placeholder={selected?.accountPlaceholder}
                disabled={disabled}
                aria-invalid={Boolean(accountErrors?.[index])}
                onChange={(event) => onChangeAccount(index, event.target.value)}
              />
              <button
                type="button"
                className="am-icon-mute"
                aria-label="حذف الحساب"
                disabled={disabled || block.accounts.length <= 1}
                onClick={() => onRemoveAccount(index)}
              >
                <X size={13} />
              </button>
            </div>
            {accountErrors?.[index] && <small className="am-error">{accountErrors[index]}</small>}
          </label>
        ))}
      </div>

      <button type="button" className="am-link" disabled={disabled} onClick={onAddAccount}>
        <Plus size={13} />إضافة رقم / حساب آخر
      </button>
    </article>
  )
}

export default PaymentMethodBlock
