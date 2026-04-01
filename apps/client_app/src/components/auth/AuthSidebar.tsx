interface AuthSidebarProps {
  title: string;
  subtitle: string;
}
// почитать про кастом классы, темы.
export function AuthSidebar({ title, subtitle }: AuthSidebarProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] items-center justify-center p-8">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <p className="text-2xl opacity-90">{subtitle}</p>
      </div>
    </div>
  );
}
