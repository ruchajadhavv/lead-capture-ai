import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboardApi";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Total Leads: {stats.totalLeads}</h2>
      <h2>Hot Leads: {stats.hotLeads}</h2>
      <h2>Warm Leads: {stats.warmLeads}</h2>
      <h2>Cold Leads: {stats.coldLeads}</h2>
    </div>
  );
}

export default Dashboard;