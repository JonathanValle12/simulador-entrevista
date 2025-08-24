
type Variant = "blue" | "purple";

export default function Card({
    selected,
    disabled,
    onSelect,
    className = "",
    variant = "purple",
    children,
}: {
    selected: boolean;
    disabled?: boolean;
    onSelect?: () => void;
    className?: string;
    variant?: Variant;
    children: React.ReactNode;
}) {
    const selectedCls =
        variant === "blue"
        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
        : "border-purple-600 bg-purple-50 ring-2 ring-purple-200"

    return (
        <article
            onClick={!disabled ? onSelect : undefined}
            className={[
                "rounded-xl border p-4 transition",
                selected ? selectedCls : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                className
            ].join(" ")}>

            {children}
        </article>
    )
}