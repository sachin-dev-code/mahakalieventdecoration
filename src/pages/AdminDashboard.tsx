import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  LogOut,
  CalendarDays,
  MessageSquare,
  Star,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/admin");
      return;
    }

    // Verify 2FA was completed
    if (sessionStorage.getItem("admin_2fa_verified") !== "true") {
      navigate("/admin");
      return;
    }

    // Verify admin role server-side
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
      supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (contactsRes.data) setContacts(contactsRes.data);
    if (reviewsRes.data) setReviews(reviewsRes.data);
    setLoading(false);
  };

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
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Bookings", count: bookings.length, icon: CalendarDays },
            { label: "Messages", count: contacts.length, icon: MessageSquare },
            { label: "Reviews", count: reviews.length, icon: Star },
          ].map(({ label, count, icon: Icon }) => (
            <div key={label} className="card-festive p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No bookings yet.
                </p>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="card-festive p-5">
                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{b.full_name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(b.created_at)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Service: </span>
                        {b.service}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date: </span>
                        {b.event_date}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mobile: </span>
                        {b.mobile}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Village: </span>
                        {b.village}
                      </div>
                    </div>
                    {b.venue && (
                      <p className="text-sm mt-2">
                        <span className="text-muted-foreground">Venue: </span>
                        {b.venue}
                      </p>
                    )}
                    {b.additional_details && (
                      <p className="text-sm mt-1 text-muted-foreground">
                        {b.additional_details}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No messages yet.
                </p>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="card-festive p-5">
                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{c.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                    <p className="text-sm mb-1">
                      <span className="text-muted-foreground">Mobile: </span>
                      {c.mobile}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="text-muted-foreground">Village: </span>
                      {c.village}
                    </p>
                    <p className="text-sm mt-2 bg-muted p-3 rounded-md">
                      {c.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No reviews yet.
                </p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="card-festive p-5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold">{r.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {r.event_category} • {r.location}
                        </p>
                        <div className="flex gap-0.5 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating
                                  ? "text-primary fill-primary"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm mt-1">{r.review_text}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteReview(r.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(r.created_at)}
                    </p>
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
