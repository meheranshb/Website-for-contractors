export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-black">
                ⬢
              </span>
              Build<span className="text-gradient">Craft</span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Premium residential & commercial contracting. Licensed, insured, and
              obsessed with the details that last.
            </p>
            <div className="mt-5 flex gap-3">
              {["IG", "FB", "IN", "YT"].map((s) => (
                <a
                  key={s}
                  href="#top"
                  className="grid h-9 w-9 place-items-center rounded-lg glass text-xs text-slate-300 transition hover:text-white"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#process" className="hover:text-white">Process</a></li>
              <li><a href="#stats" className="hover:text-white">Why Us</a></li>
              <li><a href="/admin" className="hover:text-white">Admin</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Get started</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><a href="#quote" className="hover:text-white">Get a Quote</a></li>
              <li><a href="#pay" className="hover:text-white">Pay Deposit</a></li>
              <li><a href="#top" className="hover:text-white">Careers</a></li>
              <li><a href="#top" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} BuildCraft Contracting. All rights reserved.</p>
          <p>Licensed & Insured · Payments processed securely</p>
        </div>
      </div>
    </footer>
  );
}
