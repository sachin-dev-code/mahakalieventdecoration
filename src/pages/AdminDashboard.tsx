import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  LogOut,
  CalendarDays,
  MessageSquare,
  Star,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BookingCard from "@/components/admin/BookingCard";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Realtime subscription for bookings
  useEffect(() => {
    const channel = supabase
      .channel("admin-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((prev) => [payload.new as any, ...prev]);
            toast({ title: "📩 New booking received!" });
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((b) => (b.id === (payload.new as any).id ? payload.new : b))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin"); return; }
    if (sessionStorage.getItem("admin_2fa_verified") !== "true") { navigate("/admin"); return; }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast({ title: "Access denied", variant: "destructive" });
      await supabase.auth.signOut();
      navigate("/admin");
      return;
    }
    fetchAllData();
  };

  const fetchAllData = async () => {
    setLoading(true);
    const [bookingsRes, contactsRes, reviewsRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
    ]);
    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (contactsRes.data) setContacts(contactsRes.data);
    if (reviewsRes.data) setReviews(reviewsRes.data);
    setLoading(false);
  };

  const handleUpdateStatus = useCallback(async (id: string, status: string) => {
    setActionLoading(true);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "✅ Booking approved!" : "❌ Booking rejected" });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    }
    setActionLoading(false);
  }, [toast]);

  const handleDeleteReview = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete review", variant: "destructive" });
    } else {
      toast({ title: "Review deleted" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("admin_2fa_verified");
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const pendingCount = bookings.filter((b) => (b.status ?? "pending") === "pending").length;
  const approvedCount = bookings.filter((b) => b.status === "approved").length;
  const rejectedCount = bookings.filter((b) => b.status === "rejected").length;

  const filteredBookings = statusFilter === "all"
    ? bookings
    : bookings.filter((b) => (b.status ?? "pending") === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={fetchAllData} title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", count: bookings.length, icon: CalendarDays, color: "text-primary" },
            { label: "Pending", count: pendingCount, icon: Clock, color: "text-accent" },
            { label: "Approved", count: approvedCount, icon: CheckCircle, color: "text-emerald-400" },
            { label: "Rejected", count: rejectedCount, icon: XCircle, color: "text-destructive" },
          ].map(({ label, count, icon: Icon, color }) => (
            <div key={label} className="card-festive p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">
              <CalendarDays className="w-4 h-4 mr-1.5" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <MessageSquare className="w-4 h-4 mr-1.5" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-1.5" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={statusFilter === f ? "default" : "outline"}
                  onClick={() => setStatusFilter(f)}
                  className="capitalize"
                >
                  {f === "all" ? `All (${bookings.length})` : `${f} (${f === "pending" ? pendingCount : f === "approved" ? approvedCount : rejectedCount})`}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">No bookings found.</p>
              ) : (
                filteredBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onUpdateStatus={handleUpdateStatus}
                    loading={actionLoading}
                    formatDate={formatDate}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">No messages yet.</p>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="card-festive p-5">
                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{c.name}</h3>
                      <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-sm mb-1"><span className="text-muted-foreground">Mobile: </span>{c.mobile}</p>
                    <p className="text-sm mb-1"><span className="text-muted-foreground">Village: </span>{c.village}</p>
                    <p className="text-sm mt-2 bg-muted p-3 rounded-md">{c.message}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="card-festive p-5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold">{r.name}</h3>
                        <p className="text-sm text-muted-foreground">{r.event_category} • {r.location}</p>
                        <div className="flex gap-0.5 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
                          ))}
                        </div>
                        <p className="text-sm mt-1">{r.review_text}</p>
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteReview(r.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(r.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
