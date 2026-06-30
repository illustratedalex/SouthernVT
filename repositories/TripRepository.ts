export {
  archiveTrip,
  createTrip,
  generateMockTrip,
  getTripById,
  getTrips,
  tripRepository,
  updateTrip,
} from "@/lib/repositories/TripRepository";

export type { GenerateMockTripInput, TripInput, TripUpdateInput } from "@/lib/repositories/TripRepository";
