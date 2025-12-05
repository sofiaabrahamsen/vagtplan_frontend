// components/BicyclesList.tsx
import { useBicycles } from "../hooks/useBicycles";

export default function BicyclesList() {
  const { bicycles, loading, error } = useBicycles();

  if (loading) return <p>Loading bicycles...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!bicycles.length) return <p>No bicycles found.</p>;

  return (
  <ul>
    {bicycles.map((bike) => (
      <li key={bike.bicycleId}>
        #{bike.bicycleNumber} - {bike.inOperate ? "In operation" : "Out of service"}
      </li>
    ))}
  </ul>
  );
}
