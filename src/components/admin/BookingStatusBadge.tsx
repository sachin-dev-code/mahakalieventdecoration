import { CheckCircle, XCircle, Clock } from "lucide-react";

type Status = "pending" | "approved" | "rejected";

const config: Record<Status, { label: string; icon: typeof Clock; className: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-accent/15 text-accent border-accent/30",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

const BookingStatusBadge = ({ status }: { status: string }) => {
  const s = (config[status as Status] ? status : "pending") as Status;
  const { label, icon: Icon, className } = config[s];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

export default BookingStatusBadge;
