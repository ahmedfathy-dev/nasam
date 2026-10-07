import { useState, type FormEvent } from 'react'
import { AlertCircle, Eye, EyeOff, Mail, ShieldCheck } from 'lucide-react'
import './LoginPage.css'

type LoginPageProps = {
  onLogin: (rememberMe: boolean) => void
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showResetMessage, setShowResetMessage] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onLogin(rememberMe)
  }

  return (
    <main className="login-page" dir="rtl">
      <div className="login-shell">
        <section className="login-promo">
          <img className="login-brand-logo" src="/logo.png" alt="نسام" />
          <div className="promo-copy">
            <h1>نظام إدارة التجار<br /><span>والتحويلات المالية</span></h1>
            <p>مرجع مركزي لإدارة حساباتك وحوالاتك المالية بأمان ووضوح. تابع أعمالك اليومية من مكان واحد.</p>
          </div>
          <small className="promo-copyright">© ٢٠٢٦ نسام. جميع الحقوق محفوظة</small>
        </section>

        <section className="login-content" aria-labelledby="login-title">
          <div className="login-form-wrap">
            <header className="login-heading">
              <h2 id="login-title">تسجيل الدخول</h2>
              <p>أدخل بيانات حسابك للوصول إلى نظام إدارة الحوالات</p>
            </header>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-label" htmlFor="login-email">اسم المستخدم / البريد الإلكتروني <span>*</span></label>
              <div className="login-input-wrap">
                <Mail size={15} />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@nasam.org"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <label className="login-label password-label" htmlFor="login-password">كلمة المرور <span>*</span></label>
              <div className="login-input-wrap password-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? 'إخفاء' : 'إظهار'}</span>
                </button>
              </div>

              <div className="login-options">
                <label className="remember-option">
                  <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                  <span>تذكرني</span>
                </label>
                <button className="forgot-password" type="button" onClick={() => setShowResetMessage(!showResetMessage)}>نسيت كلمة المرور؟</button>
              </div>
              {showResetMessage && <p className="reset-message">يرجى التواصل مع مسؤول النظام لإعادة تعيين كلمة المرور.</p>}
              <button className="login-submit" type="submit">تسجيل الدخول</button>
            </form>

            <section className="login-notices" aria-label="ملاحظات مهمة">
              <h3>ملاحظات مهمة</h3>
              <p className="login-notice notice-danger"><AlertCircle size={12} />تأكد من صحة البريد الإلكتروني وكلمة المرور.</p>
              <p className="login-notice notice-warning"><AlertCircle size={12} />لا تشارك بيانات الدخول مع أي شخص.</p>
              <p className="login-notice notice-danger"><ShieldCheck size={12} />سجّل الخروج عند استخدام جهاز مشترك.</p>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginPage