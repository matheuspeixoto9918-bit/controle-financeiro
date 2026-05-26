interface CardProps {
  title: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}

const Card = ({ title, value, positive, negative }: CardProps) => (
  <div className="card">
    <p className="text-sm text-slate-500">{title}</p>
    <p
      className={`mt-2 text-2xl font-bold ${
        positive ? "text-emerald-600" : negative ? "text-rose-600" : "text-slate-800"
      }`}
    >
      {value}
    </p>
  </div>
);

export default Card;
