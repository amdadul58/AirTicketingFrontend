import { useEffect, useState } from "react";
import { getCustomerDashboard } from "../../api/dashboard";
import Loader from "../../components/Loader";
import { apiErrorMessage } from "../../utils/helpers";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCustomerDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = [
    {
      title: "Upcoming Flights",
      value: data?.upcoming_flights ?? 0,
      icon: "🛫",
    },
    {
      title: "My Bookings",
      value: data?.active_bookings ?? 0,
      icon: "🎫",
    },
    {
      title: "Payments",
      value: data?.successful_payments ?? 0,
      icon: "💳",
    },
    {
      title: "Refund Requests",
      value: data?.refund_requests ?? 0,
      icon: "💰",
    },
    {
      title: "Notifications",
      value: data?.notifications ?? 0,
      icon: "🔔",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow">Customer</p>
        <h1 className="text-3xl font-semibold text-navy-900 mt-2">
          My Dashboard
        </h1>
      </div>

      {error && (
        <div className="text-danger bg-danger/10 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="card text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">{card.icon}</div>

            <div className="mt-3 text-sm text-slate-500">
              {card.title}
            </div>

            <div className="mt-2 text-3xl font-bold text-navy-900">
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}