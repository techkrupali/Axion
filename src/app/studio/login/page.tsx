import LoginForm from "./LoginForm";

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function StudioLogin({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  return (
    <div className="max-w-[420px] mx-auto pt-10">
      <h1 className="font-serif text-[34px] leading-tight text-[var(--fg)]">Sign in to the Studio</h1>
      <p className="text-[15px] text-[var(--fg-4)] mt-3 mb-8">Add, preview and publish reports and articles.</p>
      <LoginForm callbackUrl={callbackUrl?.startsWith("/studio") ? callbackUrl : "/studio"} />
    </div>
  );
}
