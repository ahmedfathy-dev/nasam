import { cn } from '@/lib/cn'
import { useAddMerchantForm } from './addMerchantFormContext'
import { amHint, amSectionHead, amSectionLast, amStep } from '../merchantTw'

function MerchantAccountSection() {
  const { values, disabled, onChange } = useAddMerchantForm()
  const createAccount = values.createAccount
  const email = values.email
  const setCreateAccount = (value: boolean) => onChange('createAccount', value)
  return (
    <section className={amSectionLast}>
      <header className={amSectionHead}>
        <span className={amStep}>4</span>
        <h2 className="text-sm font-bold text-[#303b46]">حساب التاجر</h2>
      </header>

      <label className="am-switch-row flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="absolute opacity-0 pointer-events-none"
          checked={createAccount}
          disabled={disabled}
          onChange={(event) => setCreateAccount(event.target.checked)}
        />
        <i
          aria-hidden="true"
          className={cn(
            'relative mt-0.5 h-6 w-[42px] flex-none rounded-full bg-[#c7cdd1] transition-[background] duration-[140ms] ease-in-out',
            'peer-checked:bg-green',
            createAccount && 'bg-green',
          )}
        />
        <span className="grid gap-1">
          <strong className="text-xs font-bold text-[#303b46]">إنشاء حساب دخول للتاجر</strong>
          <small className="text-[11px] leading-[1.6] text-text-muted">يصل التاجر لبياناته فقط وفقًا لدورة — بدون الوصول لتجار أو دول أخرى</small>
          {createAccount && (
            <em className={amHint}>
              سيتم استخدام {email.trim() || 'البريد الإلكتروني'} كاسم مستخدم، وتوليد كلمة مرور مؤقتة بعد الحفظ.
            </em>
          )}
        </span>
      </label>
    </section>
  )
}

export default MerchantAccountSection
