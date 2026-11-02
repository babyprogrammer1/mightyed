import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function Breadcrumb({ trail }) {
  const nav = useNavigate();
  return (
    <div className="flex items-center gap-4 text-slate-600">
      <button className="icon-btn text-ink" aria-label="Go back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
      {trail.map((t, i) => (
        <Fragment key={t.label}>
          {i > 0 && <ChevronRight size={16} />}
          {i === trail.length - 1 ? <b className="font-semibold text-ink">{t.label}</b>
            : t.to ? <Link to={t.to} className="hover:text-brand">{t.label}</Link> : <span>{t.label}</span>}
        </Fragment>
      ))}
    </div>
  );
}
