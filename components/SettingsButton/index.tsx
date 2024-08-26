const SettingButton = useMemo(() => {
    return (
      <button
        aria-pressed={settingOpen || chatOpen}
        data-lk-unread-msgs="0"
        className={`lk-button !items-center absolute  ${
          settingOpen ? '!bg-[var(--lk-control-active-bg)]' : ' !bg-[var(--lk-control-bg)]'
        }`}
        onClick={() => {
          setChatOpen(false);
          setSettingOpen(!settingOpen);
        }}
      >
        <GearIcon />
        <p
          className={` ${
            (chatOpen || settingOpen || width <= 1020) && !(width >= 1124) && '!hidden'
          } `}
        >
          Setting
        </p>
      </button>
    );
  }, [settingOpen, ChatButton, width]);