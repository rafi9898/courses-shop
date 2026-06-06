export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 grid-cols-2 gap-1 rounded-xl text-primary" aria-hidden="true">
        <span className="rounded-full border-2 border-current" />
        <span className="rounded-full border-2 border-current" />
        <span className="rounded-full border-2 border-current" />
        <span className="rounded-full border-2 border-current" />
      </div>
      <div className="leading-none">
        <div className="text-sm font-black tracking-wide text-foreground">PROJECT_NAME</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Online Courses
        </div>
      </div>
    </div>
  );
}
