type ButtonSelectProps = {
  label: string;
  active?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const ButtonSelect = (props: ButtonSelectProps) => {
  return (
    <div
      {...props}
      className={`px-[1.6rem] py-[0.8rem] text-[1.6rem] font-500 rounded-[0.8rem] cursor-pointer ${
        props.active
          ? "bg-active-tab text-[var(--text-3)]"
          : "bg-[var(--bg-item)] text-[var(--text-7)]"
      } ${props.className ?? ""}`}
    >
      {props.label}
    </div>
  );
};

export default ButtonSelect;
