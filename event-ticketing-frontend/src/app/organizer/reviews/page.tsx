import { dummyOrganizerReviews } from "@/data/org-reviews";

export default function OrganizerReviewList() {
  return (
    <div className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Organizer Reviews</h2>
      {dummyOrganizerReviews.map((review) => (
        <div key={review.id} className="border-b pb-3">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{review.name}</p>
              <p className="text-sm text-gray-500">{review.date} – {review.organizer}</p>
            </div>
            <p className="text-yellow-500 font-bold">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </p>
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
