import { CheckCircle, XCircle, MapPin, Phone, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingCardProps {
  booking: any;
  onUpdateStatus: (id: string, status: string) => void;
  loading: boolean;
  formatDate: (d: string) => string;
}

const BookingCard = ({ booking: b, onUpdateStatus, loading, formatDate }: BookingCardProps) => (
  <div className="card-festive p-5 animate-fade-in">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="font-display text-lg font-semibold">{b.full_name}</h3>
        <p className="text-xs text-muted-foreground">{formatDate(b.created_at)}</p>
      </div>
      <BookingStatusBadge status={b.status ?? "pending"} />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary shrink-0" />
        <span>
          <span className="text-muted-foreground">Event: </span>
          {b.event_date}
          {b.event_time && ` at ${b.event_time}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-primary shrink-0" />
        <span>{b.mobile}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary shrink-0" />
        <span>
          <span className="text-muted-foreground">Service: </span>
          {b.service}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <span>{b.venue ? `${b.venue}, ${b.village}` : b.village}</span>
      </div>
    </div>

    {b.additional_details && (
      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mb-4">
        {b.additional_details}
      </p>
    )}

    {(b.status ?? "pending") === "pending" && (
      <div className="flex gap-2 pt-2 border-t border-border/50">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={loading}
          onClick={() => onUpdateStatus(b.id, "approved")}
        >
          <CheckCircle className="w-4 h-4 mr-1.5" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={loading}
          onClick={() => onUpdateStatus(b.id, "rejected")}
        >
          <XCircle className="w-4 h-4 mr-1.5" />
          Reject
        </Button>
      </div>
    )}
  </div>
);

export default BookingCard;
