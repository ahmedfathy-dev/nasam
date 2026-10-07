type MerchantAccountSectionProps = {
  createAccount: boolean
  email: string
  disabled?: boolean
  onChange: (value: boolean) => void
}

function MerchantAccountSection({ createAccount, email, disabled, onChange }: MerchantAccountSectionProps) {
  return (
    <section className="am-section am-section-last">
      <header className="am-section-head">
        <span className="am-step">4</span>
        <h2>حساب التاجر</h2>
      </header>

      <label className="am-switch-row">
        <input
          type="checkbox"
          checked={createAccount}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <i aria-hidden="true" />
        <span>
          <strong>إنشاء حساب دخول للتاجر</strong>
          <small>يصل التاجر لبياناته فقط وفقًا لدورة — بدون الوصول لتجار أو دول أخرى</small>
          {createAccount && (
            <em className="am-hint">
              سيتم استخدام {email.trim() || 'البريد الإلكتروني'} كاسم مستخدم، وتوليد كلمة مرور مؤقتة بعد الحفظ.
            </em>
          )}
        </span>
      </label>
    </section>
  )
}

export default MerchantAccountSection
