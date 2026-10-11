import { useState, type FormEvent } from 'react'
import { AlertCircle, Eye, EyeOff, Mail, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'

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
    <main
      className={cn(
        /* `login-page` retained for DashboardPrimitives.css selectors */
        'login-page grid min-h-dvh place-items-start bg-canvas-soft p-3',
        'min-[681px]:place-items-center min-[681px]:p-4',
      )}
      dir="rtl"
    >
      <div
        className={cn(
          'grid w-[min(100%,1400px)] min-h-0 grid-cols-1 items-stretch gap-[18px] p-0',
          'min-[681px]:min-h-[calc(100dvh-32px)] min-[681px]:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] min-[681px]:gap-8 min-[681px]:px-1 min-[681px]:py-3',
          'min-[901px]:grid-cols-[minmax(0,1.12fr)_minmax(350px,0.88fr)] min-[901px]:gap-[clamp(48px,9vw,128px)] min-[901px]:px-[18px]',
        )}
        dir="ltr"
      >
        <section
          className={cn(
            'relative isolate flex min-h-[220px] flex-col items-start overflow-hidden rounded-xl border border-[#e4eade]',
            'bg-[linear-gradient(140deg,#fff_4%,#f7faf3_58%,#e1efd4_100%)] px-5 py-[18px] text-end',
            'before:pointer-events-none before:absolute before:bottom-[-210px] before:start-[-150px] before:z-[-1] before:size-[550px] before:rounded-full before:border before:border-[rgb(102_164_64_/_7%)] before:content-[""]',
            'after:pointer-events-none after:absolute after:bottom-[-130px] after:start-[-74px] after:z-[-1] after:size-[400px] after:rounded-full after:border after:border-[rgb(102_164_64_/_7%)] after:content-[""]',
            'min-[681px]:min-h-[650px] min-[681px]:rounded-2xl min-[681px]:px-7 min-[681px]:pb-[22px] min-[681px]:pt-[38px]',
            'min-[901px]:px-[42px]',
            '[@media(min-width:681px)_and_(max-height:760px)]:min-h-[560px]',
          )}
          dir="rtl"
        >
          <img
            className="block h-auto w-[min(100%,220px)] object-contain min-[681px]:w-[min(100%,260px)]"
            src="/logo.png"
            alt="نسام"
          />
          <div
            className={cn(
              'mt-[23px] mb-[14px] w-[min(100%,430px)] p-0',
              'min-[681px]:my-auto min-[681px]:py-[70px]',
            )}
          >
            <h1
              className={cn(
                'text-[22px] font-medium leading-[1.5] text-[#161a17]',
                'min-[681px]:text-[clamp(25px,2.3vw,34px)]',
              )}
            >
              نظام إدارة التجار
              <br />
              <span className="text-green-bright">والتحويلات المالية</span>
            </h1>
            <p
              className={cn(
                'mt-2 max-w-full text-[10px] leading-[2] text-[#7c847b]',
                'min-[681px]:mt-5 min-[681px]:max-w-[390px] min-[681px]:text-[12px]',
              )}
            >
              مرجع مركزي لإدارة حساباتك وحوالاتك المالية بأمان ووضوح. تابع أعمالك اليومية من مكان واحد.
            </p>
          </div>
          <small className="hidden text-[8px] text-[#91988f] min-[681px]:inline">
            © ٢٠٢٦ نسام. جميع الحقوق محفوظة
          </small>
        </section>

        <section
          className={cn(
            'flex min-w-0 items-center justify-center px-2 pt-[18px] pb-6',
            'min-[681px]:py-7',
            '[@media(min-width:681px)_and_(max-height:760px)]:py-3',
          )}
          aria-labelledby="login-title"
          dir="rtl"
        >
          <div className="w-[min(100%,420px)]">
            <header
              className={cn(
                'mb-6',
                'min-[681px]:mb-8',
                '[@media(min-width:681px)_and_(max-height:760px)]:mb-[22px]',
              )}
            >
              <h2
                id="login-title"
                className="text-[25px] font-medium leading-[1.5] text-[#17191c] min-[681px]:text-[30px]"
              >
                تسجيل الدخول
              </h2>
              <p className="mt-[3px] text-[11px] text-[#8b8e91]">
                أدخل بيانات حسابك للوصول إلى نظام إدارة الحوالات
              </p>
            </header>

            <form className="grid" onSubmit={handleSubmit}>
              <label className="mb-[7px] text-[10px] font-medium text-[#3d4144]" htmlFor="login-email">
                اسم المستخدم / البريد الإلكتروني <span className="text-[#e03e3e]">*</span>
              </label>
              <div className="flex h-12 items-center gap-2.5 border border-[#e2e4e6] bg-[#f0f1f2] px-[13px] text-[#8a8e92]">
                <Mail size={15} />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@nasam.org"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-full w-full min-w-0 border-0 bg-transparent p-0 text-base text-[#272b2e] outline-0 min-[681px]:text-[11px]"
                />
              </div>

              <label
                className="mt-[18px] mb-[7px] text-[10px] font-medium text-[#3d4144]"
                htmlFor="login-password"
              >
                كلمة المرور <span className="text-[#e03e3e]">*</span>
              </label>
              <div className="relative flex h-12 items-center gap-2.5 border border-[#e2e4e6] bg-[#f0f1f2] px-[13px] text-[#8a8e92]">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-full w-full min-w-0 border-0 bg-transparent py-0 pe-[72px] ps-0 text-base text-[#272b2e] outline-0 min-[681px]:text-[11px]"
                />
                <button
                  className="absolute end-3 inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-[3px] text-[9px] text-[#81868a]"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? 'إخفاء' : 'إظهار'}</span>
                </button>
              </div>

              <div className="mt-[14px] mb-[19px] flex items-center justify-between gap-3">
                <label className="inline-flex cursor-pointer items-center gap-[7px] text-[10px] text-[#606569]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="m-0 size-4"
                  />
                  <span>تذكرني</span>
                </label>
                <button
                  className="cursor-pointer border-0 bg-transparent p-0 text-[10px] text-green-link hover:text-green-link-hover hover:underline"
                  type="button"
                  onClick={() => setShowResetMessage(!showResetMessage)}
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              {showResetMessage && (
                <p className="-mt-[9px] mb-[13px] text-[10px] text-[#777f76]">
                  يرجى التواصل مع مسؤول النظام لإعادة تعيين كلمة المرور.
                </p>
              )}
              <button
                className="h-12 cursor-pointer rounded-[6px] border border-ink bg-ink text-[12px] font-medium text-white transition-[background] duration-[140ms] ease-in-out hover:bg-ink-hover"
                type="submit"
              >
                تسجيل الدخول
              </button>
            </form>

            <section
              className={cn(
                'mt-8',
                'min-[681px]:mt-11',
                '[@media(min-width:681px)_and_(max-height:760px)]:mt-7',
              )}
              aria-label="ملاحظات مهمة"
            >
              <h3 className="mb-[9px] text-[10px] font-medium text-[#777d80]">ملاحظات مهمة</h3>
              <p className="mt-2 flex min-h-[38px] items-center gap-[7px] rounded-[9px] border border-[#f1c3c3] bg-[#f9eaea] px-2.5 py-1.5 text-[9px] text-[#cf4242]">
                <AlertCircle size={12} />
                تأكد من صحة البريد الإلكتروني وكلمة المرور.
              </p>
              <p className="mt-2 flex min-h-[38px] items-center gap-[7px] rounded-[9px] border border-[#ead6af] bg-[#f7f0e4] px-2.5 py-1.5 text-[9px] text-[#aa7c30]">
                <AlertCircle size={12} />
                لا تشارك بيانات الدخول مع أي شخص.
              </p>
              <p className="mt-2 flex min-h-[38px] items-center gap-[7px] rounded-[9px] border border-[#f1c3c3] bg-[#f9eaea] px-2.5 py-1.5 text-[9px] text-[#cf4242]">
                <ShieldCheck size={12} />
                سجّل الخروج عند استخدام جهاز مشترك.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
