import LoginForm from "./LoginForm";
import { ui } from "../ui";

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

/** Studio sign-in: one centred card on a quiet background. */
export default async function StudioLogin({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-16 overflow-hidden">
      {/* soft gold light from above, and a faint frame of lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(201,162,74,0.10), transparent 70%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[min(560px,92vw)] border-x border-[rgba(240,241,245,0.04)]" />

      <div className="relative w-full max-w-[440px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/axion-index-lockup-gold-transparent.svg" alt="Axion Index" className="mx-auto w-[150px] h-auto" />

        <div className={`${ui.panel} mt-10 px-7 py-9 sm:px-10 sm:py-11 shadow-[0_40px_120px_rgba(0,0,0,0.55)]`}>
          <div className="text-center">
            <p className={`${ui.mono} text-[#C9A24A]`}>Axion Studio</p>
            <h1 className="font-display font-medium text-[40px] leading-none text-[var(--fg)] mt-4">Sign in</h1>
            <p className="text-[14.5px] leading-[1.6] text-[var(--fg-4)] mt-4">Add, preview and publish reports and articles.</p>
          </div>
          <div className="mt-9">
            <LoginForm callbackUrl={callbackUrl?.startsWith("/studio") ? callbackUrl : "/studio"} />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center text-[12.5px] leading-snug text-[var(--fg-5)]">
          <p>Forgotten your password? Ask the tech team to reset it.</p>
          <p>
            <span aria-hidden className="inline-block align-middle w-1.5 h-1.5 mr-2 -mt-0.5 rounded-full bg-[#6FCF9F]" />
            Changes go live on axionindex.org the moment you publish.
          </p>
        </div>
      </div>
    </div>
  );
}
