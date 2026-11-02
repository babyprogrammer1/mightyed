export default function Avatar({ student, size = 36, selected = false }) {
  const initials = student.name.split(" ").map((w) => w[0]).join("");
  return (
    <span className="relative inline-block flex-none" style={{ width: size, height: size }}>
      {student.photo
        ? <img src={student.photo} alt="" className="size-full rounded-lg object-cover" />
        : <span className="grid size-full place-items-center rounded-lg bg-purple-200 text-xs font-semibold text-purple-900">{initials}</span>}
      {selected && <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-brand" />}
    </span>
  );
}
