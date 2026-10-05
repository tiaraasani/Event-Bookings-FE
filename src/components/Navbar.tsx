function Navbar() {
  return (
    <div className="w-full bg-[#002B36] text-white">
      <div className="flex h-[90px] items-center justify-between px-8 lg:px-12">
        {/* Left */}
        <div className="flex items-center gap-8">
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
            aria-label="Open menu"
          >
            <span className="block h-[3px] w-6 bg-white"></span>
            <span className="block h-[3px] w-6 bg-white"></span>
            <span className="block h-[3px] w-6 bg-white"></span>
          </button>

          <div className="flex items-center gap-2">
            <div className="text-[32px] font-black tracking-tighter">EB</div>

            <div className="flex flex-col leading-[0.9]">
              <span className="text-[21px] font-bold">EVENT</span>

              <span className="text-[16px] font-medium tracking-wide">
                BOOKINGS
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
      </div>
    </div>
  );
}

export default Navbar;
