import { useParams, Link } from "react-router-dom";

export default function Placeholder() {
  const { slug } = useParams();
  return (
    <div className="card flex flex-col items-center gap-3 py-16 text-center">
      <h2 className="text-xl font-semibold capitalize">{slug.replace(/-/g, " ")}</h2>
      <p className="text-slate-500">This page isn't built yet.</p>
      <Link className="btn btn-primary" to="/">Back to dashboard</Link>
    </div>
  );
}
